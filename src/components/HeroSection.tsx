import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Multimodal AI • Real-Time Vision Processing</span>
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Meet{" "}
            <span className="gradient-text">OMNI-INFER</span>
            <br />
            Your AI Companion
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            An intelligent assistant that sees through your camera, understands context, 
            and responds in real time — powered by Google Gemini Vision AI.
          </motion.p>
          
          {/* CTA Buttons - Now with navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/omni-infer">
              <Button variant="hero" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Launch ASSISTANT
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/phone-camera">
              <Button variant="glow" size="xl" className="gap-2">
                <Camera className="w-5 h-5" />
                Phone Camera Setup
              </Button>
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
          </motion.div>
          
          {/* Floating visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 relative inline-block"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-accent/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-primary shadow-glow-strong floating flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm" />
                </div>
              </div>
              
              {/* Floating icons */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary shadow-glow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                👁️
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-accent shadow-glow-accent"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                🎤
              </motion.div>
              <motion.div
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-glow"
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                🧠
              </motion.div>
              <motion.div
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-glow-accent"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                💬
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
