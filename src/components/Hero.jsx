import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useState, useRef } from "react";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleVideoLoad = () => {
    setLoading(false);
  };

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

    tl.to("#next-section", {
      x: "0%",
      opacity: 1,
      ease: "power2.inOut",
      duration: 0.33,
    })
    .to("#video-container", {
      scale: 0.95,
      opacity: 0.8,
      ease: "power2.inOut",
      duration: 0.33,
    }, 0)
    .to(".hero-content", {
      x: "-25%",
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

        {/* Loading screen */}
        {loading && (
          <div className="flex-center absolute z-[100] h-screen w-screen overflow-hidden bg-black">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}

        {/* Main video container */}
        <div
          id="video-container"
          ref={containerRef}
          className="absolute inset-0 z-10 h-full w-full"
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
              className="absolute left-0 top-0 size-full object-cover object-center"
              onLoadedData={handleVideoLoad}
              playsInline
            />
          </div>
        </div>

        {/* Next section */}
        <div 
          id="next-section"
          className="absolute inset-0 z-20 flex items-center justify-center bg-black h-full w-full"
        >
          <div className="appointment-content text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 max-w-4xl">
            <h2 className="appointment-title font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight opacity-0 translate-y-8 leading-tight">
              Book an Appointment
            </h2>
            <p className="appointment-description font-body text-lg sm:text-xl md:text-2xl opacity-80 mb-8 max-w-2xl mx-auto leading-relaxed translate-y-6">
              Ready to bring your creative vision to life? Let's discuss your project and create something extraordinary together.
            </p>
            <div className="appointment-buttons flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 translate-y-4">
              <Button
                id="schedule-call"
                title="Schedule a Call"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-white text-black flex-center gap-2 text-sm sm:text-base px-6 py-3 hover:bg-gray-200 transition-all duration-300 font-brand font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;