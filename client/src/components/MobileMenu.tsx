import { Link } from "wouter";

export default function MobileMenu() {
  const handleClick = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  };

  return (
    <div id="mobile-menu" className="fixed top-16 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-lg z-40 border-b border-gray-800 hidden">
      <div className="container mx-auto py-4 px-4">
        <nav className="flex flex-col gap-4">
          <Link href="#features" onClick={handleClick} className="text-gray-300 hover:text-white py-2 transition-colors duration-200">Features</Link>
          <Link href="#benefits" onClick={handleClick} className="text-gray-300 hover:text-white py-2 transition-colors duration-200">Benefits</Link>
          <Link href="#ecosystem" onClick={handleClick} className="text-gray-300 hover:text-white py-2 transition-colors duration-200">Ecosystem</Link>
          <Link href="#community" onClick={handleClick} className="text-gray-300 hover:text-white py-2 transition-colors duration-200">Community</Link>
          <Link href="#explore" onClick={handleClick} className="text-gray-300 hover:text-white py-2 transition-colors duration-200">Explore</Link>
        </nav>
      </div>
    </div>
  );
}
