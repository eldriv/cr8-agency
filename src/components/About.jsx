import React, { useRef, useEffect, useState } from 'react';
import { Palette, Film, Zap, Layers, RotateCcw, Code, VolumeX, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VerticalTextSlider = () => {
  const containerRef = useRef(null);
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);
  const slide4Ref = useRef(null);
  const slide5Ref = useRef(null);
  const videoRef = useRef(null);
  const video2Ref = useRef(null);
  const [isVideoSlideActive, setIsVideoSlideActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [video2Ready, setVideo2Ready] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMuted2, setIsMuted2] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const [video2Started, setVideo2Started] = useState(false);

  // Track video loading states
  const [videoLoadStates, setVideoLoadStates] = useState({
    hero2: { loaded: false, canPlay: false, readyState: 0 },
    hero3: { loaded: false, canPlay: false, readyState: 0 }
  });

  // Set initial positions immediately on mount
  useEffect(() => {
    if (slide2Ref.current && slide3Ref.current && slide4Ref.current && slide5Ref.current) {
      gsap.set(slide2Ref.current, { y: "100vh", force3D: true });
      gsap.set(slide3Ref.current, { y: "100vh", force3D: true });
      gsap.set(slide4Ref.current, { x: "100vw", force3D: true });
      gsap.set(slide5Ref.current, { x: "-100vw", force3D: true });
      gsap.set(".slide-overlay", { opacity: 0, force3D: true });
      gsap.set(".slide-content", { y: -60, opacity: 0, force3D: true });
      gsap.set(".slide-4", { opacity: 0, force3D: true });
      gsap.set(".slide-5", { opacity: 0, force3D: true });
      gsap.set(".slide-4 video", { scale: 1, force3D: true });
      gsap.set(".slide-5 video", { scale: 1, force3D: true });
    }
  }, []);

  // Enhanced video loading detection
  const updateVideoLoadState = (videoKey, updates) => {
    setVideoLoadStates(prev => ({
      ...prev,
      [videoKey]: { ...prev[videoKey], ...updates }
    }));
  };

  // Check if both videos are fully ready
  const areVideosReady = () => {
    const hero2Ready = videoLoadStates.hero2.loaded && 
                      videoLoadStates.hero2.canPlay && 
                      videoLoadStates.hero2.readyState >= 3; // HAVE_FUTURE_DATA or higher
    
    const hero3Ready = videoLoadStates.hero3.loaded && 
                      videoLoadStates.hero3.canPlay && 
                      videoLoadStates.hero3.readyState >= 3;
    
    return hero2Ready && hero3Ready;
  };

  // Hide loading when both videos are ready
  useEffect(() => {
    if (areVideosReady()) {
      console.log('Both hero videos are fully loaded and ready');
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
        setVideoReady(true);
        setVideo2Ready(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoLoadStates]);

  const startVideoPlayback = async () => {
    if (videoRef.current && videoReady) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        await videoRef.current.play();
        console.log('Video started playing');
        setVideoStarted(true);
        return true;
      } catch (error) {
        console.log('Video start error:', error);
        return false;
      }
    }
    return false;
  };

  const startVideo2Playback = async () => {
    if (video2Ref.current && video2Ready) {
      try {
        video2Ref.current.currentTime = 0;
        video2Ref.current.muted = true;
        await video2Ref.current.play();
        console.log('Video 2 started playing');
        setVideo2Started(true);
        return true;
      } catch (error) {
        console.log('Video 2 start error:', error);
        return false;
      }
    }
    return false;
  };

  const toggleVideoSound = async () => {
    if (videoRef.current && videoReady) {
      try {
        if (videoRef.current.paused || !videoStarted) await startVideoPlayback();
        const newMutedState = !isMuted;
        videoRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
        console.log(`Video sound: ${newMutedState ? 'OFF' : 'ON'}`);
      } catch (error) {
        console.log('Error toggling sound:', error);
      }
    }
  };

  const toggleVideo2Sound = async () => {
    if (video2Ref.current && video2Ready) {
      try {
        if (video2Ref.current.paused || !video2Started) await startVideo2Playback();
        const newMutedState = !isMuted2;
        video2Ref.current.muted = newMutedState;
        setIsMuted2(newMutedState);
        console.log(`Video 2 sound: ${newMutedState ? 'OFF' : 'ON'}`);
      } catch (error) {
        console.log('Error toggling sound for video 2:', error);
      }
    }
  };

  // Enhanced video initialization with detailed loading tracking
  useEffect(() => {
    const initializeVideos = () => {
      // Initialize hero-2 video
      if (videoRef.current) {
        const video1 = videoRef.current;
        
        try {
          video1.load();
          video1.loop = true;
          video1.muted = true;
          video1.preload = "metadata";
          video1.playsInline = true;

          const updateHero2State = () => {
            updateVideoLoadState('hero2', {
              loaded: video1.readyState >= 2,
              canPlay: video1.readyState >= 3,
              readyState: video1.readyState
            });
          };

          // Multiple event listeners for comprehensive loading detection
          video1.addEventListener('loadeddata', () => {
            console.log('Hero-2: Data loaded');
            updateHero2State();
          });

          video1.addEventListener('canplay', () => {
            console.log('Hero-2: Can play');
            updateHero2State();
          });

          video1.addEventListener('canplaythrough', () => {
            console.log('Hero-2: Can play through');
            updateHero2State();
          });

          video1.addEventListener('loadedmetadata', () => {
            console.log('Hero-2: Metadata loaded');
            updateHero2State();
          });

          video1.addEventListener('progress', () => {
            updateHero2State();
          });

          video1.addEventListener('error', (e) => {
            console.error('Hero-2 loading error:', e);
            // Mark as ready even on error to prevent infinite loading
            updateVideoLoadState('hero2', {
              loaded: true,
              canPlay: true,
              readyState: 4
            });
          });

          // Initial state check
          updateHero2State();

        } catch (error) {
          console.log('Hero-2 initialization error:', error);
          updateVideoLoadState('hero2', {
            loaded: true,
            canPlay: true,
            readyState: 4
          });
        }
      }

      // Initialize hero-3 video
      if (video2Ref.current) {
        const video2 = video2Ref.current;
        
        try {
          video2.load();
          video2.loop = true;
          video2.muted = true;
          video2.preload = "metadata";
          video2.playsInline = true;

          const updateHero3State = () => {
            updateVideoLoadState('hero3', {
              loaded: video2.readyState >= 2,
              canPlay: video2.readyState >= 3,
              readyState: video2.readyState
            });
          };

          // Multiple event listeners for comprehensive loading detection
          video2.addEventListener('loadeddata', () => {
            console.log('Hero-3: Data loaded');
            updateHero3State();
          });

          video2.addEventListener('canplay', () => {
            console.log('Hero-3: Can play');
            updateHero3State();
          });

          video2.addEventListener('canplaythrough', () => {
            console.log('Hero-3: Can play through');
            updateHero3State();
          });

          video2.addEventListener('loadedmetadata', () => {
            console.log('Hero-3: Metadata loaded');
            updateHero3State();
          });

          video2.addEventListener('progress', () => {
            updateHero3State();
          });

          video2.addEventListener('error', (e) => {
            console.error('Hero-3 loading error:', e);
            // Mark as ready even on error to prevent infinite loading
            updateVideoLoadState('hero3', {
              loaded: true,
              canPlay: true,
              readyState: 4
            });
          });

          // Initial state check
          updateHero3State();

        } catch (error) {
          console.log('Hero-3 initialization error:', error);
          updateVideoLoadState('hero3', {
            loaded: true,
            canPlay: true,
            readyState: 4
          });
        }
      }
    };

    // Initialize videos immediately
    initializeVideos();

    // Cleanup function
    return () => {
      if (videoRef.current) {
        const video1 = videoRef.current;
        video1.removeEventListener('loadeddata', () => {});
        video1.removeEventListener('canplay', () => {});
        video1.removeEventListener('canplaythrough', () => {});
        video1.removeEventListener('loadedmetadata', () => {});
        video1.removeEventListener('progress', () => {});
        video1.removeEventListener('error', () => {});
      }
      if (video2Ref.current) {
        const video2 = video2Ref.current;
        video2.removeEventListener('loadeddata', () => {});
        video2.removeEventListener('canplay', () => {});
        video2.removeEventListener('canplaythrough', () => {});
        video2.removeEventListener('loadedmetadata', () => {});
        video2.removeEventListener('progress', () => {});
        video2.removeEventListener('error', () => {});
      }
    };
  }, []);

  // Fallback timer to prevent infinite loading (30 seconds max)
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.log('Fallback: Force ending loading after 30 seconds timeout');
        setLoading(false);
        setVideoReady(true);
        setVideo2Ready(true);
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [loading]);

  useEffect(() => {
    if (loading || !videoReady || !video2Ready) return;

    // Ensure initial positions are set before creating timeline
    gsap.set(slide2Ref.current, { y: "100vh", force3D: true });
    gsap.set(slide3Ref.current, { y: "100vh", force3D: true });
    gsap.set(slide4Ref.current, { x: "100vw", force3D: true });
    gsap.set(slide5Ref.current, { x: "-100vw", force3D: true });
    gsap.set(".slide-overlay", { opacity: 0, force3D: true });
    gsap.set(".slide-content", { y: -60, opacity: 0, force3D: true });
    gsap.set(".slide-4", { opacity: 0, force3D: true });
    gsap.set(".slide-5", { opacity: 0, force3D: true });
    gsap.set(".slide-4 video", { scale: 1, force3D: true });
    gsap.set(".slide-5 video", { scale: 1, force3D: true });

    // Small delay to ensure DOM is fully ready
    const initAnimation = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onUpdate: (self) => {
            if (self.progress > 0.8) {
              setIsVideoSlideActive(true);
            } else {
              setIsVideoSlideActive(false);
            }
          }
        }
      });

      tl.to(".slide-1 .slide-content",{y:0,opacity:1,duration:0.16,ease:"power3.out",force3D:true}).to(".slide-1 .slide-overlay",{opacity:0.4,duration:0.12,ease:"power2.out"},"<").to([slide2Ref.current,slide1Ref.current],{y:(i)=>i===0?"0vh":"-100vh",duration:0.16,ease:"power2.out",force3D:true,stagger:0},0.16).to(".slide-1 .slide-content",{y:-40,opacity:0,duration:0.12,ease:"power2.in",force3D:true},0.16).to(".slide-1 .slide-overlay",{opacity:0.8,duration:0.12,ease:"power2.in"},0.16).to(".slide-2 .slide-content",{y:0,opacity:1,duration:0.2,ease:"power3.out",force3D:true},0.24).to(".slide-2 .slide-overlay",{opacity:0.3,duration:0.16,ease:"power2.out"},0.24).to(".slide-2 .slide-content",{y:-40,opacity:0,duration:0.16,ease:"power2.in",force3D:true},0.32).to(".slide-2 .slide-overlay",{opacity:0.8,duration:0.16,ease:"power2.in"},0.32).to([slide3Ref.current,slide2Ref.current],{y:(i)=>i===0?"0vh":"-100vh",duration:0.16,ease:"power2.out",force3D:true,stagger:0},0.36).to(".slide-3 .slide-content",{y:0,opacity:1,duration:0.2,ease:"power3.out",force3D:true},0.44).to(".slide-3 .slide-overlay",{opacity:0.3,duration:0.16,ease:"power2.out"},0.44).to(".slide-3 .slide-content",{y:-40,opacity:0,duration:0.16,ease:"power2.inOut",force3D:true},0.48).to(".slide-3 .slide-overlay",{opacity:0.8,duration:0.16,ease:"power2.inOut"},0.48).to(slide4Ref.current,{x:"0vw",duration:0.16,ease:"power2.inOut",force3D:true},0.52).to(".slide-4",{opacity:1,duration:0.12,ease:"power2.inOut",force3D:true},0.56).to(".slide-4 video",{scale:1.02,duration:0.12,ease:"power2.inOut",force3D:true},0.6).to(".slide-4 video",{scale:1.04,duration:0.16,ease:"power2.inOut",force3D:true},0.68).to(slide5Ref.current,{x:"0vw",duration:0.16,ease:"power2.inOut",force3D:true},0.8).to(".slide-5",{opacity:1,duration:0.12,ease:"power2.inOut",force3D:true},0.84).to(".slide-5 video",{scale:1.02,duration:0.12,ease:"power2.inOut",force3D:true},0.86).to(".slide-5 video",{scale:1.05,duration:0.1,ease:"power2.inOut",force3D:true},0.9);
    };

    // Small delay to ensure everything is properly initialized
    const timeoutId = setTimeout(initAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }
      if (video2Ref.current) {
        video2Ref.current.pause();
        video2Ref.current.muted = true;
      }
    };
  }, [loading, videoReady, video2Ready]);

  return (
    <div className="relative h-[700vh]">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative flex flex-col items-center">
            <video
              className="w-64 h-64 object-cover rounded-full"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/loading.mp4" type="video/mp4" />
              {/* Fallback spinner if video fails to load */}
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </video>
            
            {/* Loading progress indicator */}
            <div className="mt-8 text-white text-center">
              <div className="text-sm opacity-75 mb-2">Thank you for waiting!</div>
              <div className="flex gap-4 text-xs">
                <div className={`transition-colors duration-300 ${
                  videoLoadStates.hero2.loaded && videoLoadStates.hero2.canPlay ? 'text-green-400' : 'text-white/50'
                }`}>
                  Resources: {videoLoadStates.hero2.readyState}/4
                </div>
                <div className={`transition-colors duration-300 ${
                  videoLoadStates.hero3.loaded && videoLoadStates.hero3.canPlay ? 'text-green-400' : 'text-white/50'
                }`}>
                  Assets: {videoLoadStates.hero3.readyState}/4
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={containerRef} className="sticky top-0 h-screen w-screen overflow-hidden" style={{ willChange: 'transform' }}>
        <div ref={slide1Ref} className="slide-1 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-8">
            <h1 className="text-3xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Let's Create Your Creative Vision
              </span>
            </h1>
            <p className="text-lg md:text-xl font-body font-light tracking-wide opacity-90 max-w-2xl leading-relaxed">
              We craft unique visual stories that amplify your brand and captivate your audience.
              From design to production, we partner with you every step of the way to bring your ideas to life.
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

       <div ref={slide2Ref} className="slide-2 relative min-h-screen w-full bg-black" style={{ willChange: 'transform' }}>
      <div className="slide-overlay absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 pointer-events-none" />
      <div className="slide-content relative flex flex-col justify-center items-center text-center text-white z-10 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-8 sm:mb-10 md:mb-12 tracking-tight">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" id="services">
            SERVICES OFFERED
          </span>
        </h1>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl">
          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-black/10 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 flex mx-auto items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">Graphic Design</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">From logos to comprehensive brand visuals</p>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <Film className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">Video Editing</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">Crafting dynamic content that captures attention</p>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">Motion Graphics</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">Elevating your visuals with movements</p>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">2D/3D Animation</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">Bringing your ideas to life with dimension</p>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">Logo Animation</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">Giving your brand identity dynamic edge</p>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
                <Code className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">Web Development</h3>
              <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">Build websites effectively and promote your brand</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-10 md:mt-12 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
    </div>

        <div ref={slide3Ref} className="slide-3 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-8">
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white-800 bg-clip-text">
              See Our Creative Impact
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-body font-light tracking-wide opacity-90 max-w-6xl leading-relaxed">
            Explore our portfolio to see the creativity, precision, and innovation that CR8 brings to every project. We've collaborated with a wide range of brands across industries, delivering standout results that captivate audiences.
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        <div ref={slide4Ref} className="slide-4 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ willChange: 'transform' }} src="videos/hero-2.mp4" loop playsInline preload="metadata" onLoadedData={() => console.log('Video loaded successfully')} onCanPlay={() => console.log('Video can start playing')} onError={(e) => console.error('Video loading error:', e)} onLoadStart={() => console.log('Video loading started')} />
          <div className="absolute bottom-16 left-8 z-10">
            <h2 className="text-white text-2xl md:text-4xl font-display font-bold mb-2">
              Experience the Creativity.
            </h2>
            <p className="text-white/80 text-lg font-body max-w-md mb-4">
              Watch the client's vision turned into life.
            </p>
            
            <div className="flex flex-col gap-2">
              <button onClick={toggleVideoSound} className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30 font-medium w-fit flex items-center gap-2">
                {!videoStarted ? (
                  'Start Video'
                ) : (
                  <>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isMuted ? 'Sound On' : 'Sound Off'}
                  </>
                )}
              </button>
              
              {videoStarted && (
                <p className="text-white/60 text-xs">
                  Video is {videoRef.current?.paused ? 'paused' : 'playing'} • Sound {isMuted ? 'off' : 'on'}
                </p>
              )}
            </div>
          </div>
        </div>

	<div ref={slide5Ref} className="slide-5 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
  {!video2Started && (
    <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url('img/thumbnail.png')`}}>
    </div>
  )}
          <video ref={video2Ref} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${video2Started ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'transform' }} src="videos/hero-3.mp4" loop playsInline preload="metadata" onLoadedData={() => console.log('Video 2 loaded successfully')} onCanPlay={() => console.log('Video 2 can start playing')} onError={(e) => console.error('Video 2 loading error:', e)} onLoadStart={() => console.log('Video 2 loading started')} />
          
          <div className="absolute bottom-16 right-8 z-10 text-right">
            <h2 className="text-white text-2xl md:text-4xl font-display font-bold mb-2">
              Helping clients succeed
            </h2>
            <p className="text-white/80 text-lg font-body max-w-md mb-4">
              Discover how we push creative boundaries and deliver exceptional results.
            </p>
            
            <div className="flex flex-col gap-2 items-end">
              <button onClick={toggleVideo2Sound} className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30 font-medium w-fit flex items-center gap-2">
                {!video2Started ? (
                  'Start Video'
                ) : (
                  <>
                    {isMuted2 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isMuted2 ? 'Sound On' : 'Sound Off'}
                  </>
                )}
              </button>
              
              {video2Started && (
                <p className="text-white/60 text-xs">
                  Video is {video2Ref.current?.paused ? 'paused' : 'playing'} • Sound {isMuted2 ? 'off' : 'on'}
                </p>
              )}
            </div>
          </div>
        </div>

        {!isVideoSlideActive && (
  <div className="absolute bottom-8 left-40 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 z-20">
  <div className="w-6 ml-4 h-10 border-2 border-white/50 rounded-full flex justify-center">
    <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
  </div>
  <p className="text-white/60 text-sm mt-2 text-right tracking-wider font-body">SCROLL</p>
</div>
        )}
      </div>

      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        html {
          scroll-behavior: auto;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-content {
          animation: fadeInDown 1s ease-out;
        }

        .slide-1, .slide-2, .slide-3, .slide-4 {
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default VerticalTextSlider;