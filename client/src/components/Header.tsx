import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Menu, Search } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.toggle('hidden');
  };

  const isExplorer = location.startsWith('/explorer');

  return (
    <header className={`fixed top-0 w-full z-50 px-4 py-3 border-b transition-all duration-300 ${
      isScrolled || isExplorer
        ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-gray-800'
        : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={36} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] bg-clip-text text-transparent"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SpudChain
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/#features" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Features</Link>
          <Link href="/#benefits" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Benefits</Link>
          <Link href="/#ecosystem" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Ecosystem</Link>
          <Link href="/#community" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Community</Link>
          <Link
            href="/explorer"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
              isExplorer ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
            }`}
          >
            <Search size={13} />
            Explorer
          </Link>
        </nav>

        <div className="flex gap-3">
          <Link href="/explorer">
            <Button variant="outline" className="hidden md:inline-flex text-white border-[#2D9CDB] hover:bg-[#2D9CDB]/20 transition-all text-sm gap-1.5">
              <Search size={13} /> Open Explorer
            </Button>
          </Link>
          <Button
            className="bg-gradient-to-r from-[#2D9CDB] to-[#9B51E0] hover:shadow-lg hover:shadow-[#9B51E0]/20 transition-all bg-size-200 animate-gradient text-sm"
          >
            Start Building
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
