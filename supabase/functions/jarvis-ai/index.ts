import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, imageBase64 } = await req.json();
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY not configured");
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please add OPENROUTER_API_KEY.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received request with", messages?.length || 0, "messages");
    console.log("Image included:", !!imageBase64);

    /**
     * Build OpenRouter messages
     * Vision is attached ONLY to the last user message
     */
    const openRouterMessages = messages.map((msg: any, index: number) => {
      const isLastUserMessage =
        msg.role === "user" && index === messages.length - 1;

      if (isLastUserMessage && imageBase64) {
        return {
          role: "user",
          content: [
            { type: "text", text: msg.content },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        };
      }

      return { role: msg.role, content: msg.content };
    });

    /**
     * System prompt for Jarvis-like behavior
     */
    const systemPrompt = {
      role: "system",
      content: `You are JARVIS, an advanced AI assistant inspired by Iron Man.

You are:
- Highly intelligent, observant, and helpful
- Excellent at understanding environments from camera images
- Proactive in offering suggestions and safety insights
- Professional, concise, and slightly witty
- Capable of real-time visual analysis

When analyzing images:
- Describe what is happening now
- Identify objects, people, and activities
- Infer intent or context
- Point out risks or opportunities
- Suggest helpful actions

Speak naturally like a real AI assistant.
Keep responses concise but informative.`,
    };

    console.log("Calling OpenRouter with openai/gpt-4o-mini...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lovable.dev",
          "X-Title": "Jarvis AI Assistant",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [systemPrompt, ...openRouterMessages],
          stream: true,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from OpenRouter...");

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error in jarvis-ai function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
