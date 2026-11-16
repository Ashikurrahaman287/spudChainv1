import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const communitySections = [
  {
    title: "For Developers",
    description: "Access documentation, SDKs, and developer tools to start building on SpudChain.",
    link: "#developers",
    hoverColor: "group-hover:text-[#2D9CDB]",
    hoverBorder: "hover:border-[#2D9CDB]/50"
  },
  {
    title: "For Businesses",
    description: "Discover how SpudChain can transform your operations with blockchain technology.",
    link: "#businesses",
    hoverColor: "group-hover:text-[#9B51E0]",
    hoverBorder: "hover:border-[#9B51E0]/50"
  },
  {
    title: "Join Community",
    description: "Connect with thousands of SpudChain enthusiasts, builders, and innovators.",
    link: "#community",
    hoverColor: "group-hover:text-[#00F0FF]",
    hoverBorder: "hover:border-[#00F0FF]/50"
  }
];

export default function CTASection() {
  return (
    <section id="community" className="py-16 md:py-24 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0A0A0A] opacity-50"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 10px rgba(0, 240, 255, 0.7), 0 0 20px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.3)"
            }}
          >
            Join the AI-Blockchain Revolution
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Be part of the next generation of blockchain technology. Build, innovate, and scale with SpudChain's unprecedented performance and AI-powered capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {communitySections.map((section, index) => (
              <motion.a 
                href={section.link} 
                key={index}
                className={`group bg-[#111111] rounded-xl p-6 border border-gray-800 ${section.hoverBorder} transition-all`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 
                  className={`text-xl font-semibold mb-2 text-white ${section.hoverColor} transition-colors`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {section.description}
                </p>
              </motion.a>
            ))}
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              className="bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] hover:shadow-lg hover:shadow-[#9B51E0]/30 transition-all text-white px-8 py-6 h-auto text-lg"
              size="lg"
            >
              Explore SpudChain
            </Button>
            <Button 
              variant="outline" 
              className="border-[#2D9CDB] text-white hover:bg-[#2D9CDB]/20 transition-all px-8 py-6 h-auto text-lg"
              size="lg"
            >
              Read Whitepaper
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
