import { motion } from "framer-motion";
import { Eye, Mic, Brain, MessageCircle, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Real-time object detection, scene understanding, and hazard identification using advanced AI models.",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Natural speech recognition and synthesis for seamless hands-free communication.",
  },
  {
    icon: Brain,
    title: "Contextual Reasoning",
    description: "Intelligent decision-making that combines visual, audio, and conversational context.",
  },
  {
    icon: MessageCircle,
    title: "Natural Language",
    description: "Understands complex queries and responds with human-like conversational ability.",
  },
  {
    icon: Shield,
    title: "Safety Aware",
    description: "Proactive hazard detection and safety alerts for navigation and daily activities.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Sub-second response times with optimized edge computing and cloud infrastructure.",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group glass-panel p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:shadow-glow transition-all duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Intelligent</span> Capabilities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combining multiple AI modalities for a truly aware and helpful assistant experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
