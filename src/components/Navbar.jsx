// src/components/Navbar.jsx
import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = ["Home", "Works", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

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

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
    } else if (currentScrollY > lastScrollY) {
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
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed left-0 right-0 mx-auto top-4 z-50 h-12 sm:h-14 md:h-16 w-11/12 max-w-4xl rounded-full border-none transition-all duration-700 sm:w-10/12 md:w-3/4 lg:w-2/3"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-md">
        <nav className="relative flex size-full items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full">
          {/* Logo */}
          <div className="flex items-center z-10">
            <img src="/img/logo.png" alt="logo" className="w-9 lg:w-16 sm:w-7 md:w-8" />
          </div>

          {/* Desktop Links */}
          <div className="absolute left-0 right-0 mx-auto flex justify-center">
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => handleNavItemClick(item)}
                  className="nav-hover-btn text-white text-xs lg:text-sm font-medium transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3 z-10">
            <button onClick={toggleAudioIndicator} className="flex items-center space-x-0.5">
              <audio ref={audioElementRef} className="hidden" src="/audio/loop.mp3" loop />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>

            <button className="md:hidden flex items-center justify-center" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FiX className="text-white text-xl" /> : <FiMenu className="text-white text-xl" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full mt-2 rounded-xl bg-black/90 backdrop-blur-md overflow-hidden opacity-0 pointer-events-none"
          style={{ transformOrigin: "top center" }}
        >
          <div className="flex flex-col py-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                onClick={() => handleNavItemClick(item)}
                className="px-6 py-3 text-white hover:bg-white/10 transition-colors duration-300"
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
