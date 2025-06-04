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
  const menuButtonRef = useRef(null); 
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          opacity: 1,
          visibility: "visible",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.fromTo(mobileMenuRef.current.querySelector('.menu-content'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (menuButtonRef.current) {
      const menuIcon = menuButtonRef.current.querySelector('.menu-icon');
      const closeIcon = menuButtonRef.current.querySelector('.close-icon');

      if (isMobileMenuOpen) {
        gsap.to(menuButtonRef.current, {
          scale: 1.1,
          rotate: 90,
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
        gsap.to(menuIcon, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in" });
        gsap.to(closeIcon, { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3, 
          ease: "back.out(1.7)", 
          delay: 0.1 
        });
      } else {
        gsap.to(menuButtonRef.current, {
          scale: 1,
          rotate: 0,
          boxShadow: "0 0 0 rgba(255, 255, 255, 0)",
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
        gsap.to(closeIcon, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in" });
        gsap.to(menuIcon, { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3, 
          ease: "back.out(1.7)", 
          delay: 0.1 
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

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isNavVisible]);

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
    <>
      <div
        ref={navContainerRef}
        className="fixed left-0 right-0 mx-auto top-2 sm:top-4 z-50 w-[95%] sm:w-11/12 max-w-6xl transition-all duration-300"
      >
        <header className="relative rounded-2xl sm:rounded-full sm:bg-black/80 sm:backdrop-blur-md sm:border sm:border-white/10 sm:shadow-lg">
          <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            {/* Logo - Hidden on mobile */}
            <div className="hidden sm:flex items-center z-20 relative">
              <img 
                src="/img/logo.png" 
                alt="CR8 Logo" 
                className="w-16 h-16 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
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
              ref={menuButtonRef}
              className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 hover:bg-black/90 transition-all duration-300 z-50 relative ml-auto" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-5 h-5">
                <FiMenu 
                  className={clsx(
                    "absolute inset-0 text-white text-xl transition-all duration-300 menu-icon",
                    isMobileMenuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  )} 
                />
                <FiX 
                  className={clsx(
                    "absolute inset-0 text-white text-xl transition-all duration-300 close-icon",
                    isMobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  )} 
                />
              </div>
            </button>
          </nav>
        </header>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden fixed inset-0 z-40 opacity-0 invisible"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(20px)' }}
      >
        <div className="menu-content flex flex-col items-start justify-center h-full px-8 max-w-md">
          {/* Logo in menu */}
          <div className="mb-4">
            <img 
              src="/img/logo.png" 
              alt="CR8 Logo" 
              className="w-32 h-32 object-contain opacity-90 -mt-16"
            />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-8 w-full">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                onClick={() => handleNavItemClick(item)}
                className="text-white text-4xl sm:text-5xl font-light tracking-wide hover:text-white/80 transition-all duration-300 transform hover:translate-x-2"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
