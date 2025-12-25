/// <reference types="vite/client" />
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX,
  Smartphone,
  Monitor,
  Zap,
  Eye,
  Brain,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const JarvisOrb = ({ isProcessing, isListening }: { isProcessing: boolean; isListening: boolean }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rings */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-primary/30"
        animate={{
          scale: isProcessing ? [1, 1.2, 1] : 1,
          opacity: isProcessing ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full border border-primary/20"
        animate={{
          scale: isProcessing ? [1, 1.15, 1] : 1,
          opacity: isProcessing ? [0.2, 0.4, 0.2] : 0.2,
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
      />
      
      {/* Core orb */}
      <motion.div
        className="relative w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--accent)))',
          boxShadow: isProcessing 
            ? '0 0 60px hsl(var(--primary) / 0.6), inset 0 0 30px rgba(255,255,255,0.2)'
            : '0 0 30px hsl(var(--primary) / 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
        }}
        animate={{
          scale: isListening ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
      >
        <motion.div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 60%)',
          }}
        />
        
        {/* Eye/Core indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              opacity: isProcessing ? [0.5, 1, 0.5] : 0.8,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isProcessing ? (
              <Brain className="w-8 h-8 text-background" />
            ) : isListening ? (
              <Mic className="w-8 h-8 text-background" />
            ) : (
              <Eye className="w-8 h-8 text-background" />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const JarvisAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);

  
  const { toast } = useToast();

  // Get available cameras (including DroidCam)
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Request permission first
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        
        // Auto-select DroidCam if available, otherwise first camera
        const droidCam = cameras.find(cam => 
          cam.label.toLowerCase().includes('droidcam') || 
          cam.label.toLowerCase().includes('droid')
        );
        if (droidCam) {
          setSelectedCameraId(droidCam.deviceId);
        } else if (cameras.length > 0) {
          setSelectedCameraId(cameras[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };
    getCameras();
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

recognitionRef.current.onresult = (event: any) => {
  if (isSpeakingRef.current) return;

  let finalTranscript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript;
    }
  }

  const command = finalTranscript.trim().toLowerCase();

  // 🛑 VOICE COMMAND: TURN MIC OFF
  if (
    command === "off" ||
    command === "mic off" ||
    command === "stop listening"
  ) {
    setIsListening(false);              // 🔑 THIS IS IMPORTANT
    recognitionRef.current?.stop();     // stop mic

    toast({
      title: "Mic Off",
      description: "Listening stopped by voice command",
    });

    return; // ❌ do NOT send to AI
  }

  if (command) {
    handleSendMessage(command);
  }
};

recognitionRef.current.onend = () => {
  if (isListening) {
    recognitionRef.current.start(); // 🔁 auto restart
  }
};

      recognitionRef.current.onerror = (event: any) => {
        if (isSpeakingRef.current) return;
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };
    }
  }, []);

  // Start camera with selected device
  const startCamera = async (deviceId?: string) => {
    try {
      // Stop existing stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      
      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId }, width: 1280, height: 720 }
          : { width: 1280, height: 720 },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  // Capture current frame
  const captureFrame = useCallback((): string | null => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
      }
    }
    return null;
  }, []);

  // Text-to-speech
const speak = (text: string) => {
  if (!isSpeaking) return;

  // 🛑 Pause mic while AI speaks
  if (isListening && recognitionRef.current) {
    isSpeakingRef.current = true;
    recognitionRef.current.stop();
  }

  window.speechSynthesis.cancel();
  speechSynthRef.current = new SpeechSynthesisUtterance(text);

  speechSynthRef.current.rate = 1.0;
  speechSynthRef.current.pitch = 0.9;
  speechSynthRef.current.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    v => v.name.includes('Google UK English Male') || v.name.includes('Daniel')
  );
  if (preferredVoice) {
    speechSynthRef.current.voice = preferredVoice;
  }

  // ✅ Resume mic AFTER AI finishes speaking
  speechSynthRef.current.onend = () => {
    isSpeakingRef.current = false;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  window.speechSynthesis.speak(speechSynthRef.current);
};


  // Send message to AI
  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const imageBase64 = captureFrame();
      
      const response = await fetch(
  import.meta.env.VITE_JARVIS_API_URL,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      })),
      imageBase64
    })
  }
);


      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantContent = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant') {
                    return prev.map((m, i) => 
                      i === prev.length - 1 ? { ...m, content: assistantContent } : m
                    );
                  }
                  return [...prev, { role: 'assistant', content: assistantContent, timestamp: new Date() }];
                });
              }
            } catch (e) {
              // Skip parse errors
            }
          }
        }
      }

      speak(assistantContent);

    } catch (error) {
      console.error('AI Error:', error);
      toast({
        title: "AI Error",
        description: "Failed to get response from OMNI-INFER. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start camera when device is selected
  useEffect(() => {
    if (selectedCameraId) {
      startCamera(selectedCameraId);
    }
    return () => stopCamera();
  }, [selectedCameraId]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.05)_0%,_transparent_70%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.05)_0%,_transparent_50%)]" />
      
      {/* Grid overlay */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 h-screen flex flex-col lg:flex-row p-4 gap-4">
        {/* Video Feed Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 h-1/2 lg:h-full flex flex-col gap-4"
        >
          {/* Camera selector dropdown */}
          <div className="flex gap-2 items-center">
            <Camera className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {availableCameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startCamera(selectedCameraId)}
              className="gap-2"
            >
              <Monitor className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Video container */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border bg-card">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Status overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${videoStream ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-foreground/80 bg-background/50 px-2 py-1 rounded backdrop-blur-sm">
                {videoStream ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Processing indicator */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                >
                  <div className="flex items-center gap-3 bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm">Analyzing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 h-1/2 lg:h-full flex flex-col"
        >
          {/* Header with Orb */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <JarvisOrb isProcessing={isProcessing} isListening={isListening} />
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">OMNI-INFER</h1>
                <p className="text-sm text-muted-foreground">Just A Rather Very Intelligent System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSpeaking(!isSpeaking)}
              className="rounded-full"
            >
              {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Zap className="w-16 h-16 text-primary/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Hello, I'm OMNI-INFER</h2>
                <p className="text-muted-foreground max-w-md">
                  Your AI assistant ready to help. I can see through your camera and answer questions about your environment.
                  Speak or type to get started.
                </p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
              className={`rounded-full ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask OMNI-INFER anything..."
              className="flex-1 rounded-full bg-card border-border"
              disabled={isProcessing}
            />
            
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              className="rounded-full"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JarvisAssistant;
