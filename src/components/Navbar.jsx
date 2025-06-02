// src/components/Navbar.jsx
import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = ["Home", "Works", "Contact"];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          y: 0,
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          y: -20,
          opacity: 0,
          pointerEvents: "none",
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMobileMenuOpen]);

  const handleNavItemClick = (title) => {
    document.title = `CR8 - ${title}`;
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Hide/show navbar on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsNavVisible(false);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY, isMobileMenuOpen]);

  // Navbar visibility animation
  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isNavVisible]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      ref={navContainerRef}
      className="fixed left-0 right-0 mx-auto top-2 sm:top-4 z-50 w-[95%] sm:w-11/12 max-w-6xl transition-all duration-300"
    >
      <header className="relative rounded-2xl sm:rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center z-20 relative">
            <img 
              src="/img/logo.png" 
              alt="CR8 Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8 xl:gap-12">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => handleNavItemClick(item)}
                  className="text-white/90 hover:text-white text-sm xl:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 z-20 relative" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-5">
              <FiMenu 
                className={clsx(
                  "absolute inset-0 text-white text-xl transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                )} 
              />
              <FiX 
                className={clsx(
                  "absolute inset-0 text-white text-xl transition-all duration-300",
                  isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                )} 
              />
            </div>
          </button>

        </nav>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 w-full mt-2 rounded-2xl bg-black/95 backdrop-blur-md border border-white/10 overflow-hidden opacity-0 pointer-events-none"
        >
          <div className="flex flex-col py-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                onClick={() => handleNavItemClick(item)}
                className="px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 text-base font-medium border-b border-white/5 last:border-b-0"
              >
                {item}
              </a>
            ))}

          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;