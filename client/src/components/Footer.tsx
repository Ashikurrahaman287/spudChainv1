import Logo from "@/components/Logo";
import { 
  Twitter, 
  Github, 
  MessageCircle,
  Send 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={32} />
              <h3 
                className="text-xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] bg-clip-text text-transparent"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                SpudChain
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The AI-Powered Blockchain for Mass Adoption. Ultra-fast, zero fees, and fully decentralized.
            </p>
            <div className="flex gap-4">
              <a href="#twitter" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#discord" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#github" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#telegram" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Features</a></li>
              <li><a href="#whitepaper" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Whitepaper</a></li>
              <li><a href="#roadmap" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Roadmap</a></li>
              <li><a href="#ecosystem" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Ecosystem</a></li>
              <li><a href="#tokenomics" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Tokenomics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#documentation" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Documentation</a></li>
              <li><a href="#api" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">API Reference</a></li>
              <li><a href="#sdks" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">SDKs & Tools</a></li>
              <li><a href="#tutorials" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Tutorials</a></li>
              <li><a href="#github" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">About Us</a></li>
              <li><a href="#careers" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Careers</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Blog</a></li>
              <li><a href="#press" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Press</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-[#2D9CDB] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} SpudChain. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-[#2D9CDB] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#2D9CDB] transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-[#2D9CDB] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
