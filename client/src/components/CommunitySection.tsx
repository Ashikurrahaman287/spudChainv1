import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function CommunitySection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="community-stats" className="py-16 md:py-24 relative px-4 bg-[#0A0A0A]">
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Join a thriving community.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Be part of the fastest growing community of blockchain developers, entrepreneurs, and innovators.
          </p>
        </motion.div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* First Card - Developers */}
          <motion.div 
            className="relative rounded-lg overflow-hidden aspect-square group"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/80 to-[#000000]/40 z-10"></div>
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <div className="text-[#00FF85] text-4xl md:text-5xl font-bold mb-1">
                <AnimatedCounter end={48000} />
              </div>
              <p className="text-white text-sm">Developers building during SpudChain Hackathons</p>
            </div>
          </motion.div>
          
          {/* Second Card - Events */}
          <motion.div 
            className="relative rounded-lg overflow-hidden aspect-square group"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/80 to-[#000000]/40 z-10"></div>
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <div className="text-[#9B51E0] text-4xl md:text-5xl font-bold mb-1">
                <AnimatedCounter end={9300} />
              </div>
              <p className="text-white text-sm">Total SpudChain Breakpoint attendees</p>
            </div>
          </motion.div>
          
          {/* Third Card - Hacker House */}
          <motion.div 
            className="relative rounded-lg overflow-hidden aspect-square group md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/80 to-[#000000]/40 z-10"></div>
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <h3 className="text-white text-xl font-bold mb-1">Seoul Hacker House</h3>
              <p className="text-gray-300 text-sm">Local dev camp for the SpudChain Foundation's Seoul Hacker House event</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}