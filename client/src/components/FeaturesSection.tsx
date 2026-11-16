import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Zap, 
  DollarSign, 
  Lightbulb, 
  BarChart, 
  ShieldCheck, 
  Globe 
} from "lucide-react";

const features = [
  {
    title: "1.5M Transactions Per Second",
    description: "No more waiting for confirmations. SpudChain processes transactions instantly with unmatched throughput.",
    icon: Zap,
    gradient: "from-[#2D9CDB] to-[#00F0FF]",
    hoverBorder: "hover:border-[#2D9CDB]/50"
  },
  {
    title: "Practically Zero Fees",
    description: "At just $0.00002 per transaction, SpudChain makes blockchain usable for real-world applications at scale.",
    icon: DollarSign,
    gradient: "from-[#00F0FF] to-[#9B51E0]",
    hoverBorder: "hover:border-[#9B51E0]/50"
  },
  {
    title: "AI-Powered Efficiency",
    description: "Our AI engine optimizes every transaction for maximum speed, reliability, and security.",
    icon: Lightbulb,
    gradient: "from-[#9B51E0] to-[#FB37FF]", 
    hoverBorder: "hover:border-[#FB37FF]/50"
  },
  {
    title: "Infinite Scalability",
    description: "Built for enterprise performance, SpudChain handles millions of transactions effortlessly.",
    icon: BarChart,
    gradient: "from-[#00F0FF] to-[#00FF85]",
    hoverBorder: "hover:border-[#00FF85]/50"
  },
  {
    title: "AI-Driven Security",
    description: "Advanced fraud detection and protection mechanisms keep your transactions safe.",
    icon: ShieldCheck,
    gradient: "from-[#00FF85] to-[#FFB800]",
    hoverBorder: "hover:border-[#FFB800]/50"
  },
  {
    title: "Eco-Friendly Technology",
    description: "0% carbon impact with AI-optimized Proof-of-Stake that consumes minimal energy.",
    icon: Globe,
    gradient: "from-[#FFB800] to-[#2D9CDB]",
    hoverBorder: "hover:border-[#2D9CDB]/50"
  }
];

export default function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-16 md:py-24 relative px-4">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Unmatched Speed & Zero Fees
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            SpudChain combines AI-powered efficiency with blockchain technology to deliver performance that other chains can't match.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`bg-[#111111] rounded-xl p-6 border border-gray-800 ${feature.hoverBorder} transition-all`}
              variants={itemVariants}
            >
              <div className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-br ${feature.gradient} flex justify-center items-center`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
