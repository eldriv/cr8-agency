import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { Palette, Film, Zap, Layers, RotateCcw, Code } from 'lucide-react';
import { useEffect, useState, useRef } from "react";

// ModernButton component
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

// ServiceCard component
const ServiceCard = ({ icon: Icon, title, desc, className = "" }) => (
  <div 
    className={`service-card group relative overflow-hidden p-4 sm:p-6 md:p-8 border border-gray-700 rounded-xl sm:rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/10 hover:border-gray-600 cursor-pointer flex-shrink-0 ${className}`}
    style={{ backgroundColor: '#1f2937', minWidth: '280px' }}
  >
    <div className="absolute inset-0 opacity-100 z-0" style={{ backgroundColor: '#000000' }}></div>
    <div className="absolute inset-0 bg-black/30 group-hover:opacity-100 transition-opacity duration-700 z-1"></div>
    
    <div className="relative z-10">
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-5 mx-auto flex items-center justify-center border border-gray-600 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:shadow-white/20"
        style={{ backgroundColor: '#374151' }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-display font-bold mb-2 sm:mb-3 md:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300 text-center">{title}</h3>
      <p className="text-gray-300 font-body leading-relaxed text-xs sm:text-sm md:text-base drop-shadow-sm group-hover:text-white transition-all duration-300 text-center">{desc}</p>
    </div>
  </div>
);

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const servicesScrollRef = useRef(null);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  const services = [
    { icon: Palette, title: "Graphic Design", desc: "From logos to comprehensive brand visuals" },
    { icon: Film, title: "Video Editing", desc: "Crafting dynamic content that captures attention" },
    { icon: Zap, title: "Motion Graphics", desc: "Elevating your visuals with movements" },
    { icon: Layers, title: "2D/3D Animation", desc: "Bringing your ideas to life with dimension" },
    { icon: RotateCcw, title: "Logo Animation", desc: "Giving your brand identity dynamic edge" },
    { icon: Code, title: "Web Development", desc: "Build websites effectively and promote your brand" }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video autoplay prevented:", error);
        });
      }
    }
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simplified scroll handling for desktop only
  useEffect(() => {
    const scrollContainer = servicesScrollRef.current;
    if (!scrollContainer || isMobile) return; // Skip custom scrolling on mobile

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      scrollContainer.style.cursor = 'grabbing';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    // Only add mouse events for desktop
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseUp);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseUp);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=800%",
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
      x: "100%"
    });

    gsap.set("#services-section", {
      x: "-100%"
    });

    gsap.set(".appointment-content", {
      y: 50,
      scale: 0.9
    });

    gsap.set(".services-content", {
      x: -50,
      opacity: 0
    });

    gsap.set(".service-card", {
      x: -120,
      opacity: 0,
      scale: 0.8
    });

    // Set initial state for services title and description
    gsap.set(".services-title", {
      y: 30,
      opacity: 0
    });

    gsap.set(".services-description", {
      y: 30,
      opacity: 0
    });

    const scaleValue = 0.95;
    const translateValue = "-25%";

    tl.to("#next-section", {
      x: "0%",
      ease: "power2.inOut",
      duration: 0.25,
    })
    .to("#video-container", {
      scale: scaleValue,
      ease: "power2.inOut",
      duration: 0.25,
    }, 0)
    .to(".hero-content", {
      x: translateValue,
      ease: "power2.inOut",
      duration: 0.25,
    }, 0)
    .to(".appointment-content", {
      y: 0,
      scale: 1,
      ease: "power2.out",
      duration: 0.2,
    }, 0.05)
    .to(".appointment-title", {
      y: 0,
      ease: "power2.out",
      duration: 0.15,
    }, 0.08)
    .to(".appointment-description", {
      y: 0,
      ease: "power2.out",
      duration: 0.15,
    }, 0.13)
    .to(".appointment-buttons", {
      y: 0,
      ease: "power2.out",
      duration: 0.15,
    }, 0.18)
    .to("#services-section", {
      x: "0%",
      ease: "power2.inOut",
      duration: 0.15,
    }, 0.25)
    .to("#next-section", {
      x: "100%",
      ease: "power2.inOut",
      duration: 0.15,
    }, 0.25)
    .to("#video-container", {
      x: "-100%",
      opacity: 0,
      scale: 0.8,
      ease: "power2.inOut",
      duration: 0.15,
    }, 0.25)
    .to(".services-content", {
      x: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 0.1,
    }, 0.3)
    .to(".services-title", {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 0.08,
    }, 0.32)
    .to(".services-description", {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 0.08,
    }, 0.34)
    .to(".service-card", {
      x: 0,
      opacity: 1,
      scale: 1,
      ease: "power2.out",
      duration: 0.35,
      stagger: {
        amount: 0.25,
        from: "start"
      }
    }, 0.4)
    .to({}, { duration: 0.1 }, 0.85)
    .to("#video-container", {
      x: "-150%",
      y: -100,
      opacity: 0,
      scale: 0.6,
      ease: "power2.in",
      duration: 0.05,
    }, 0.95)
    .to(".hero-content", {
      y: -50,
      ease: "power2.in",
      duration: 0.05,
    }, 0.95)
    .to("#services-section", {
      y: "100%",
      ease: "power2.inOut",
      duration: 0.05,
    }, 0.95)
    .to(".services-content", {
      y: 50,
      opacity: 0.5,
      ease: "power2.inOut",
      duration: 0.05,
    }, 0.95);

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
    <div id="home" className="relative h-[800vh]">
      <div ref={heroRef} className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}

        <div
          id="video-container"
          ref={containerRef}
          className="absolute inset-0 z-5 h-full w-full bg-black"
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

        <div 
          id="next-section"
          className="absolute inset-0 z-15 flex items-center justify-center bg-black h-full w-full"
        >
          <div className="appointment-content text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 max-w-4xl">
            <h2 className="appointment-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight translate-y-8 leading-tight px-2">
              Book an Appointment
            </h2>
            <p className="appointment-description font-body font-light tracking-wide text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed translate-y-6 px-4">
              Ready to bring your creative vision to life? Let's discuss your project and create something extraordinary together.
            </p>
            <div className="appointment-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center translate-y-4">
              <ModernButton
                icon={<TiLocationArrow className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="Schedule a Call"
                href="#contact"
                className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto max-w-xs justify-center"
              />
            </div>
          </div>
        </div>

        <div 
          id="services-section"
          className="absolute inset-0 z-30 h-full w-full"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="absolute inset-0 bg-black opacity-100 z-0"></div>
          <div className="absolute inset-0" style={{ backgroundColor: '#000000' }}></div>
          
          <div className="services-content relative flex flex-col justify-center items-center text-center text-white z-10 px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto min-h-screen" style={{ backgroundColor: '#000000' }}>
            <h1 className="services-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                SERVICES OFFERED
              </span>
            </h1>
            <p className="services-description font-body text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Explore our comprehensive range of creative services designed to elevate your brand and captivate your audience.
            </p>
            
            <div className="services-container w-full max-w-xs sm:max-w-4xl lg:max-w-6xl">
              <div 
                ref={servicesScrollRef}
                className="services-scroll-container md:hidden overflow-x-auto"
              >
                <div className="services-row flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {services.map((service, index) => (
                    <ServiceCard 
                      key={service.title}
                      icon={service.icon}
                      title={service.title}
                      desc={service.desc}
                    />
                  ))}
                </div>
              </div>
              
              <div className="services-grid hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
                {services.map((service, index) => (
                  <ServiceCard 
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    desc={service.desc}
                    className={index === 2 || index === 5 ? "lg:col-span-1" : ""}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 w-16 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        html {
          scroll-behavior: auto;
        }
        
        /* Native smooth scrolling for mobile */
        .services-scroll-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
          overscroll-behavior-x: contain;
        }
        
        /* Hide scrollbar but keep functionality */
        .services-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .services-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .service-card {
          scroll-snap-align: start;
          transform: translateZ(0);
        }
        
        /* Desktop drag cursor only */
        @media (min-width: 768px) {
          .services-scroll-container {
            cursor: grab;
          }
          
          .services-scroll-container:active {
            cursor: grabbing;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .services-content {
            padding-top: env(safe-area-inset-top, 20px);
            padding-bottom: env(safe-area-inset-bottom, 20px);
          }
          
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
          
          .services-content {
            padding: 1rem;
          }
          
          .services-scroll-container {
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
            /* Enhanced native mobile scrolling */
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
            touch-action: pan-x;
          }
          
          .service-card {
            touch-action: manipulation;
          }
          
          @media (max-width: 375px) {
            .services-content {
              padding: 0.75rem;
            }
            
            .services-scroll-container {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
              margin-left: -0.75rem;
              margin-right: -0.75rem;
            }
            
            .service-card {
              min-width: 260px;
            }
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          #services-section, #next-section, #video-container {
            will-change: transform;
          }
        }
        
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          
          .services-content, .appointment-content {
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;