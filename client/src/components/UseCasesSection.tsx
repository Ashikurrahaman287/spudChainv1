import { motion } from "framer-motion";
import { CheckIcon, ArrowRightIcon } from "lucide-react";

const useCases = [
  {
    title: "DeFi",
    description: "Ultra-fast transactions and near-zero fees make SpudChain perfect for DeFi applications, from lending and trading to yield farming.",
    bgFrom: "[#2D9CDB]/20",
    bgTo: "[#9B51E0]/20",
    features: [
      "High-volume trading with no slippage",
      "Flash loans without prohibitive gas fees",
      "AI-enhanced yield optimization"
    ],
    link: "#defi"
  },
  {
    title: "NFTs & Gaming",
    description: "Create, trade, and interact with NFTs and blockchain games without the frustrating delays and high costs.",
    bgFrom: "[#00F0FF]/20",
    bgTo: "[#FB37FF]/20",
    features: [
      "Instant minting and trading",
      "Real-time game state changes",
      "Affordable microtransactions"
    ],
    link: "#nfts"
  },
  {
    title: "Enterprise",
    description: "Scale your business with enterprise-grade blockchain technology that can handle millions of operations per day.",
    bgFrom: "[#9B51E0]/20",
    bgTo: "[#00FF85]/20",
    features: [
      "Supply chain tracking at scale",
      "Secure identity & authentication",
      "AI-enhanced data analytics"
    ],
    link: "#enterprise"
  }
];

export default function UseCasesSection() {
  return (
    <section id="ecosystem" className="py-16 md:py-24 relative px-4">
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built for Infinite Scalability
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            SpudChain is the ideal platform for a wide range of applications, from DeFi and NFTs to AI-powered dApps and enterprise solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div 
              key={index}
              className="bg-[#111111] rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`h-40 bg-gradient-to-br from-${useCase.bgFrom} to-${useCase.bgTo} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {useCase.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  {useCase.description}
                </p>
                <ul className="space-y-2 text-gray-400 text-sm mb-4">
                  {useCase.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-[#00FF85]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a 
                  href={useCase.link} 
                  className="text-[#2D9CDB] hover:text-[#00F0FF] transition-colors text-sm font-medium flex items-center gap-1"
                >
                  Explore {useCase.title} Use Cases
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
