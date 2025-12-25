import { motion } from "framer-motion";
import { Accessibility, Home, HardHat, Navigation, HeartPulse, GraduationCap } from "lucide-react";

const useCases = [
  {
    icon: Accessibility,
    title: "Assistive Technology",
    description: "Empowering visually impaired users with real-time environmental awareness and navigation assistance.",
  },
  {
    icon: Home,
    title: "Smart Home Assistant",
    description: "Hands-free control and monitoring for a more accessible and convenient living experience.",
  },
  {
    icon: HardHat,
    title: "Workplace Safety",
    description: "Proactive hazard detection and safety compliance monitoring in industrial environments.",
  },
  {
    icon: Navigation,
    title: "Smart Navigation",
    description: "Context-aware wayfinding with obstacle detection and route optimization.",
  },
  {
    icon: HeartPulse,
    title: "Elder Care",
    description: "Supportive monitoring and assistance for elderly individuals living independently.",
  },
  {
    icon: GraduationCap,
    title: "Educational Tools",
    description: "Interactive learning experiences with visual and audio accessibility features.",
  },
];

const UseCasesSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-dark">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Real-World <span className="gradient-text">Applications</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforming lives across diverse domains with intelligent, context-aware assistance.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
                <div className="relative p-6 border border-border rounded-xl hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
