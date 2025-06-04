import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useState, useRef } from "react";

// ModernButton component (imported from your Features.jsx)
const ModernButton = ({ icon, label, className = "", onClick, href }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const buttonRef = useRef(null);
  
  const handleMouseMove = (event) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCursorPosition({ 
      x: event.clientX - rect.left, 
      y: event.clientY - rect.top, 
    });
  };
  
  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);
  
  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (onClick) onClick(e);
  };

  const ButtonContent = () => (
    <>
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" 
        style={{ 
          opacity: hoverOpacity, 
          background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #ffffff33, #00000026)`, 
        }} 
      />
      <span className="relative z-20">{icon}</span>
      <span className="relative z-20">{label}</span>
    </>
  );

  if (href) {
    return (
      <a 
        ref={buttonRef} 
        href={href}
        onMouseMove={handleMouseMove} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-black px-5 py-3 text-sm uppercase text-white border border-gray-800 font-body ${className}`}
      >
        <ButtonContent />
      </a>
    );
  }

  return (
    <button 
      ref={buttonRef} 
      onMouseMove={handleMouseMove} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleClick} 
      className={`relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-black px-5 py-3 text-sm uppercase text-white border border-gray-800 font-body ${className}`}
    >
      <ButtonContent />
    </button>
  );
};

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  // Ensure video plays on mobile
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Force play on mobile
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video autoplay prevented:", error);
        });
      }
    }
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        markers: false,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        immediateRender: false,
      },
    });

    gsap.set("#next-section", { 
      x: "100%",
      opacity: 0
    });

    gsap.set(".appointment-content", {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // Adjust animation values for better mobile performance
    const scaleValue = 0.95;
    const translateValue = "-25%";

    tl.to("#next-section", {
      x: "0%",
      opacity: 1,
      ease: "power2.inOut",
      duration: 0.33,
    })
    .to("#video-container", {
      scale: scaleValue,
      opacity: 0.8,
      ease: "power2.inOut",
      duration: 0.33,
    }, 0)
    .to(".hero-content", {
      x: translateValue,
      opacity: 0.2,
      ease: "power2.inOut",
      duration: 0.33,
    }, 0)
    .to(".appointment-content", {
      opacity: 1,
      y: 0,
      scale: 1,
      ease: "power2.out",
      duration: 0.25,
    }, 0.1)
    .to(".appointment-title", {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 0.2,
    }, 0.13)
    .to(".appointment-description", {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 0.2,
    }, 0.2)
    .to(".appointment-buttons", {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 0.2,
    }, 0.27)
    .to("#video-container", {
      opacity: 0,
      scale: 0.8,
      y: -100,
      ease: "power2.in",
      duration: 0.33,
    }, 0.33)
    .to(".hero-content", {
      opacity: 0,
      y: -50,
      ease: "power2.in",
      duration: 0.33,
    }, 0.33)
    .to("#next-section", {
      opacity: 1,
      ease: "none",
      duration: 0.33,
    }, 0.33)
    .to("#next-section", {
      opacity: 0,
      y: -50,
      scale: 0.95,
      ease: "power2.inOut",
      duration: 0.34,
    }, 0.66)
    .to(".appointment-content", {
      opacity: 0,
      y: -30,
      ease: "power2.inOut",
      duration: 0.34,
    }, 0.66);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [], { scope: heroRef });

  return (
    <div id="home" className="relative h-[300vh]">
      <div ref={heroRef} className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
        
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}

        {/* Main video container - Fixed mobile positioning */}
        <div
          id="video-container"
          ref={containerRef}
          className="absolute inset-0 z-10 h-full w-full bg-black"
        >
          <div
            id="video-frame"
            className="relative h-full w-full overflow-hidden bg-black"
          >
            <video
              ref={videoRef}
              src="videos/hero-1.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedData={handleVideoLoad}
            />
          </div>
        </div>

        {/* Next section - Improved mobile layout */}
        <div 
          id="next-section"
          className="absolute inset-0 z-20 flex items-center justify-center bg-black h-full w-full"
        >
          <div className="appointment-content text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 max-w-4xl">
            <h2 className="appointment-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight opacity-0 translate-y-8 leading-tight px-2">
              Book an Appointment
            </h2>
            <p className="appointment-description font-body font-light tracking-wide opacity-90 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed translate-y-6 px-4">
              Ready to bring your creative vision to life? Let's discuss your project and create something extraordinary together.
            </p>
            <div className="appointment-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center opacity-0 translate-y-4">
              <ModernButton
                icon={<TiLocationArrow className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="Schedule a Call"
                href="#contact"
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;