import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="hero" className="pt-24 md:pt-32 pb-16 md:pb-24 relative px-4">
      <div className="container mx-auto relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#2D9CDB] via-[#00F0FF] to-[#9B51E0] bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The AI-Powered Blockchain for Mass Adoption
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            SpudChain is built to empower businesses, developers, and users with cutting-edge blockchain technology, ensuring instant transactions, ultra-low fees, and full decentralization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              className="bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] hover:shadow-lg hover:shadow-[#9B51E0]/30 transition-all text-white px-8 py-6 h-auto"
              size="lg"
            >
              Explore SpudChain
            </Button>
            <Button
              variant="outline"
              className="border-[#2D9CDB] text-white hover:bg-[#2D9CDB]/20 transition-all px-8 py-6 h-auto"
              size="lg"
            >
              Build on SpudChain
            </Button>
          </div>
          <div className="flex justify-center">
            <Link href="/explorer">
              <button className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/8 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/50 transition-all text-sm font-medium">
                <Search size={15} />
                Open Blockchain Explorer
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="rounded-xl p-6 transform hover:scale-105 transition-all relative overflow-hidden group backdrop-blur-md bg-[rgba(10,10,10,0.6)] border border-[rgba(255,255,255,0.08)]">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#2D9CDB] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Transaction Speed</h3>
            <div className="flex items-baseline">
              <AnimatedCounter end={1500000} className="text-4xl font-mono font-bold text-white" />
              <span className="ml-2 text-gray-400">TPS</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm">The fastest blockchain ever created</p>
          </div>

          <div className="rounded-xl p-6 transform hover:scale-105 transition-all relative overflow-hidden group backdrop-blur-md bg-[rgba(10,10,10,0.6)] border border-[rgba(255,255,255,0.08)]">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00F0FF] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Transaction Fees</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-mono font-bold text-white">$0.00002</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm">Practically zero fees per transaction</p>
          </div>

          <div className="rounded-xl p-6 transform hover:scale-105 transition-all relative overflow-hidden group backdrop-blur-md bg-[rgba(10,10,10,0.6)] border border-[rgba(255,255,255,0.08)]">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#9B51E0] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Validator Nodes</h3>
            <div className="flex items-baseline">
              <AnimatedCounter end={3927} className="text-4xl font-mono font-bold text-white" />
              <span className="ml-2 text-gray-400">Nodes</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm">Ensuring security & decentralization</p>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-[#2D9CDB]/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-[#9B51E0]/10 rounded-full blur-xl animate-pulse-slow"></div>
    </section>
  );
}
