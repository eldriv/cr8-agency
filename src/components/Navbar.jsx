import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Contact", href: "#contact" },
];

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      rafId = null;
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (label) => {
    document.title = `CR8 - ${label}`;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-black/75 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.8)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            onClick={() => handleNavClick("Home")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition group-hover:accent-border">
              <img src="/img/logo.png" alt="CR8" className="h-7 w-7 object-contain" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              CR8 <span className="text-white/40">Agency</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="nav-link relative px-4 py-2 text-sm font-medium text-white/65 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => handleNavClick("Contact")}
              className="ml-3 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 hover:shadow-[0_0_30px_-6px_rgba(255,255,255,0.4)]"
            >
              Start a project
            </a>
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-white/30 lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <div
          ref={progressRef}
          className="progress-line absolute bottom-0 left-0 h-0.5 w-full origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
          aria-hidden
        />
      </header>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl transition-all duration-500 lg:hidden",
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <nav className="relative flex h-full flex-col justify-center gap-2 px-10">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.label)}
              className="border-b border-white/5 py-4 font-display text-3xl font-light text-white transition accent-text-hover"
              style={{ transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : "0ms" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default NavBar;
