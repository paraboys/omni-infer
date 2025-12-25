import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, RefreshCw, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PhoneCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('jarvis-camera');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      broadcastChannelRef.current?.postMessage({ type: 'phone-disconnect' });
      broadcastChannelRef.current?.close();
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      toast({
        title: "Camera Started",
        description: "Your phone camera is now active",
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsConnected(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleFacingMode = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (stream) {
      startCamera();
    }
  };

  const startStreaming = () => {
    if (!stream || !videoRef.current || !canvasRef.current) {
      toast({
        title: "Start Camera First",
        description: "Please start your camera before connecting",
        variant: "destructive"
      });
      return;
    }

    setIsConnected(true);
    
    // Send frames at ~10 FPS
    intervalRef.current = window.setInterval(() => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (canvas && video && video.readyState >= 2) {
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
          broadcastChannelRef.current?.postMessage({ 
            type: 'phone-frame', 
            frame 
          });
        }
      }
    }, 100);

    toast({
      title: "Connected!",
      description: "Your phone camera is now streaming to JARVIS",
    });
  };

  const stopStreaming = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsConnected(false);
    broadcastChannelRef.current?.postMessage({ type: 'phone-disconnect' });
    
    toast({
      title: "Disconnected",
      description: "Stopped streaming to JARVIS",
    });
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">JARVIS Camera</h1>
            <p className="text-sm text-muted-foreground">Stream your phone camera</p>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      <div className="flex-1 relative bg-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : stream ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <span className="text-sm bg-background/70 px-2 py-1 rounded backdrop-blur-sm">
            {isConnected ? 'STREAMING' : stream ? 'READY' : 'OFFLINE'}
          </span>
        </div>

        {/* Connection overlay */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 border-4 border-primary/30 animate-pulse" />
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Connected to JARVIS</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4 border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={stream ? stopCamera : startCamera}
            className="flex-1 gap-2"
          >
            {stream ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {stream ? 'Stop Camera' : 'Start Camera'}
          </Button>
          
          <Button
            variant="outline"
            onClick={toggleFacingMode}
            disabled={!stream}
            size="icon"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        <Button
          onClick={isConnected ? stopStreaming : startStreaming}
          disabled={!stream}
          className="w-full gap-2"
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? (
            <>
              <CameraOff className="w-5 h-5" />
              Disconnect from JARVIS
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5" />
              Connect to JARVIS
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Open this page on your phone to use it as a camera for JARVIS.
          Make sure both devices are on the same browser session.
        </p>
      </div>
    </div>
  );
};

export default PhoneCamera;
