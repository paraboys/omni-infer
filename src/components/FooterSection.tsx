import { motion } from "framer-motion";
import { Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-12 text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            This project demonstrates scalable AI system design with real-world applications in assistive technology and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg">
              <Github className="w-5 h-5" />
              View on GitHub
            </Button>
            <Button variant="glass" size="lg">
              Read Documentation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">VisionAI Assistant</span>
          </div>
          <p>Built with scalable microservices architecture</p>
          <p>© 2024 Final Year Project</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
