import { motion } from "framer-motion";
import { Sparkles, Menu, X, Bot, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const isHomePage = location.pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="glass-panel px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">OMNI-INFER</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <button 
                  onClick={() => scrollToSection("features")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection("use-cases")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use Cases
                </button>
              </>
            ) : (
              <Link 
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            )}
            <Link 
              to="/jarvis"
              className={`text-sm transition-colors flex items-center gap-1 ${
                location.pathname === "/jarvis" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="w-4 h-4" />
              OMNI-INFER
            </Link>
            <Link 
              to="/phone-camera"
              className={`text-sm transition-colors flex items-center gap-1 ${
                location.pathname === "/phone-camera" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Camera className="w-4 h-4" />
              Camera
            </Link>
          </div>
          
          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/jarvis">
              <Button variant="default" size="sm" className="gap-2">
                <Bot className="w-4 h-4" />
                Launch AI
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-panel p-4 flex flex-col gap-4"
          >
            {isHomePage && (
              <>
                <button 
                  onClick={() => scrollToSection("features")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection("use-cases")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Use Cases
                </button>
              </>
            )}
            <Link 
              to="/jarvis"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              JARVIS Assistant
            </Link>
            <Link 
              to="/phone-camera"
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Phone Camera
            </Link>
            <Link to="/jarvis" onClick={() => setIsOpen(false)}>
              <Button variant="default" size="sm" className="w-full gap-2">
                <Bot className="w-4 h-4" />
                Launch JARVIS
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
