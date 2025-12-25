import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mic, MicOff, Video, VideoOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoiceOrb = ({ isListening, isSpeaking }: { isListening: boolean; isSpeaking: boolean }) => {
  return (
    <div className="relative w-32 h-32">
      {/* Outer ring animations */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
      
      {/* Main orb */}
      <motion.div
        className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening || isSpeaking
            ? 'bg-gradient-primary shadow-glow-strong'
            : 'bg-secondary border border-border'
        }`}
        animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex gap-1"
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-foreground rounded-full"
                  animate={{ height: [8, 24, 8] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="w-8 h-8 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const AssistantDemo = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVideo = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsVideoOn(true);
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoOn(false);
  }, []);

  const toggleAudio = useCallback(async () => {
    if (isAudioOn) {
      setIsAudioOn(false);
      setIsListening(false);
      return;
    }
    
    try {
      setError(null);
      setIsConnecting(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsAudioOn(true);
      setIsListening(true);
      
      // Simulate listening cycle for demo
      setTimeout(() => {
        setIsListening(false);
        setIsSpeaking(true);
        setTranscript(prev => [...prev, "User: What can you see around me?"]);
        
        setTimeout(() => {
          setIsSpeaking(false);
          setTranscript(prev => [...prev, "AI: I can see you're in an indoor environment. There appears to be a desk and computer setup in front of you. The lighting is good."]);
          setIsListening(true);
        }, 3000);
      }, 3000);
      
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
      console.error("Microphone error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [isAudioOn]);

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, [stopVideo]);

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Try the <span className="gradient-text">Demo</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Experience real-time vision and voice interaction. Enable your camera and microphone to begin.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video Preview */}
            <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden">
              {isVideoOn ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scanning-line" />
                  </div>
                  {/* Corner markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">Camera Preview</p>
                </div>
              )}
            </div>
            
            {/* Voice Interface */}
            <div className="flex flex-col items-center gap-6">
              <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {isConnecting ? "Connecting..." : 
                   isListening ? "Listening..." : 
                   isSpeaking ? "Speaking..." : 
                   "Ready to assist"}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {isAudioOn ? "Tap microphone to stop" : "Enable microphone to start"}
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex gap-4">
                <Button
                  variant={isVideoOn ? "default" : "glass"}
                  size="icon-lg"
                  onClick={isVideoOn ? stopVideo : startVideo}
                  className="rounded-full"
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                
                <Button
                  variant={isAudioOn ? "default" : "glass"}
                  size="icon-lg"
                  onClick={toggleAudio}
                  disabled={isConnecting}
                  className="rounded-full"
                >
                  {isConnecting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isAudioOn ? (
                    <Mic className="w-6 h-6" />
                  ) : (
                    <MicOff className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Transcript */}
          {transcript.length > 0 && (
            <div className="mt-8 p-4 bg-secondary/50 rounded-lg max-h-40 overflow-y-auto">
              {transcript.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm mb-2 ${
                    line.startsWith("User:") ? "text-primary" : "text-foreground"
                  }`}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AssistantDemo;
