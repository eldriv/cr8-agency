import React, { useRef, useEffect, useState } from 'react';
import { Palette, Film, Zap, Layers, RotateCcw, Code, VolumeX, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VerticalTextSlider = () => {
  const containerRef = useRef(null);
  const slideRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [slide1Ref, slide2Ref, slide3Ref, slide4Ref, slide5Ref] = slideRefs;
  const videoRef = useRef(null);
  const video2Ref = useRef(null);
  
  const [state, setState] = useState({
    isVideoSlideActive: false,
    loading: true,
    videoReady: false,
    video2Ready: false,
    isMuted: true,
    isMuted2: true,
    videoStarted: false,
    video2Started: false,
    videoLoadStates: {
      hero2: { loaded: false, canPlay: false, readyState: 0 },
      hero3: { loaded: false, canPlay: false, readyState: 0 }
    }
  });

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const updateVideoLoadState = (videoKey, updates) => {
    setState(prev => ({
      ...prev,
      videoLoadStates: {
        ...prev.videoLoadStates,
        [videoKey]: { ...prev.videoLoadStates[videoKey], ...updates }
      }
    }));
  };

  const areVideosReady = () => {
    const { hero2, hero3 } = state.videoLoadStates;
    return [hero2, hero3].every(v => v.loaded && v.canPlay && v.readyState >= 3);
  };

  const setInitialPositions = () => {
    if (slideRefs.every(ref => ref.current)) {
      gsap.set(slide2Ref.current, { y: "100vh", force3D: true });
      gsap.set(slide3Ref.current, { y: "100vh", force3D: true });
      gsap.set(slide4Ref.current, { x: "100vw", force3D: true });
      gsap.set(slide5Ref.current, { x: "-100vw", force3D: true });
      gsap.set(".slide-overlay", { opacity: 0, force3D: true });
      gsap.set(".slide-content", { y: -60, opacity: 0, force3D: true });
      gsap.set([".slide-4", ".slide-5"], { opacity: 0, force3D: true });
      gsap.set([".slide-4 video", ".slide-5 video"], { scale: 1, force3D: true });
    }
  };

  const startVideoPlayback = async (videoRef, setStarted) => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        await videoRef.current.play();
        setStarted(true);
        return true;
      } catch (error) {
        console.log('Video start error:', error);
        return false;
      }
    }
    return false;
  };

  const toggleVideoSound = async (videoRef, isMuted, setMuted, videoReady, videoStarted, setStarted) => {
    if (videoRef.current && videoReady) {
      try {
        if (videoRef.current.paused || !videoStarted) {
          await startVideoPlayback(videoRef, setStarted);
        }
        const newMutedState = !isMuted;
        videoRef.current.muted = newMutedState;
        setMuted(newMutedState);
      } catch (error) {
        console.log('Error toggling sound:', error);
      }
    }
  };

  const initializeVideo = (videoElement, videoKey) => {
    if (!videoElement) return;

    try {
      videoElement.load();
      Object.assign(videoElement, { loop: true, muted: true, preload: "metadata", playsInline: true });

      const updateState = () => {
        updateVideoLoadState(videoKey, {
          loaded: videoElement.readyState >= 2,
          canPlay: videoElement.readyState >= 3,
          readyState: videoElement.readyState
        });
      };

      ['loadeddata', 'canplay', 'canplaythrough', 'loadedmetadata', 'progress'].forEach(event => {
        videoElement.addEventListener(event, updateState);
      });

      videoElement.addEventListener('error', (e) => {
        console.error(`${videoKey} loading error:`, e);
        updateVideoLoadState(videoKey, { loaded: true, canPlay: true, readyState: 4 });
      });

      updateState();
    } catch (error) {
      console.log(`${videoKey} initialization error:`, error);
      updateVideoLoadState(videoKey, { loaded: true, canPlay: true, readyState: 4 });
    }
  };

  // Set initial positions on mount
  useEffect(() => {
    setInitialPositions();
  }, []);

  // Check if videos are ready and hide loading
  useEffect(() => {
    if (areVideosReady()) {
      setTimeout(() => {
        updateState({ loading: false, videoReady: true, video2Ready: true });
      }, 500);
    }
  }, [state.videoLoadStates]);

  // Initialize videos
  useEffect(() => {
    initializeVideo(videoRef.current, 'hero2');
    initializeVideo(video2Ref.current, 'hero3');
  }, []);

  // Fallback timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.loading) {
        updateState({ loading: false, videoReady: true, video2Ready: true });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [state.loading]);

  // Main animation setup
  useEffect(() => {
    if (state.loading || !state.videoReady || !state.video2Ready) return;

    setInitialPositions();

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
          onUpdate: (self) => updateState({ isVideoSlideActive: self.progress > 0.8 })
        }
      });

      tl.to(".slide-1 .slide-content", { y: 0, opacity: 1, duration: 0.16, ease: "power3.out", force3D: true })
        .to(".slide-1 .slide-overlay", { opacity: 0.4, duration: 0.12, ease: "power2.out" }, "<")
        .to([slide2Ref.current, slide1Ref.current], { y: (i) => i === 0 ? "0vh" : "-100vh", duration: 0.16, ease: "power2.out", force3D: true, stagger: 0 }, 0.16)
        .to(".slide-1 .slide-content", { y: -40, opacity: 0, duration: 0.12, ease: "power2.in", force3D: true }, 0.16)
        .to(".slide-1 .slide-overlay", { opacity: 0.8, duration: 0.12, ease: "power2.in" }, 0.16)
        .to(".slide-2 .slide-content", { y: 0, opacity: 1, duration: 0.2, ease: "power3.out", force3D: true }, 0.24)
        .to(".slide-2 .slide-overlay", { opacity: 0.3, duration: 0.16, ease: "power2.out" }, 0.24)
        .to(".slide-2 .slide-content", { y: -40, opacity: 0, duration: 0.16, ease: "power2.in", force3D: true }, 0.32)
        .to(".slide-2 .slide-overlay", { opacity: 0.8, duration: 0.16, ease: "power2.in" }, 0.32)
        .to([slide3Ref.current, slide2Ref.current], { y: (i) => i === 0 ? "0vh" : "-100vh", duration: 0.16, ease: "power2.out", force3D: true, stagger: 0 }, 0.36)
        .to(".slide-3 .slide-content", { y: 0, opacity: 1, duration: 0.2, ease: "power3.out", force3D: true }, 0.44)
        .to(".slide-3 .slide-overlay", { opacity: 0.3, duration: 0.16, ease: "power2.out" }, 0.44)
        .to(".slide-3 .slide-content", { y: -40, opacity: 0, duration: 0.16, ease: "power2.inOut", force3D: true }, 0.48)
        .to(".slide-3 .slide-overlay", { opacity: 0.8, duration: 0.16, ease: "power2.inOut" }, 0.48)
        .to(slide4Ref.current, { x: "0vw", duration: 0.16, ease: "power2.inOut", force3D: true }, 0.52)
        .to(".slide-4", { opacity: 1, duration: 0.12, ease: "power2.inOut", force3D: true }, 0.56)
        .to(".slide-4 video", { scale: 1.02, duration: 0.12, ease: "power2.inOut", force3D: true }, 0.6)
        .to(".slide-4 video", { scale: 1.04, duration: 0.16, ease: "power2.inOut", force3D: true }, 0.68)
        .to(slide5Ref.current, { x: "0vw", duration: 0.16, ease: "power2.inOut", force3D: true }, 0.8)
        .to(".slide-5", { opacity: 1, duration: 0.12, ease: "power2.inOut", force3D: true }, 0.84)
        .to(".slide-5 video", { scale: 1.02, duration: 0.12, ease: "power2.inOut", force3D: true }, 0.86)
        .to(".slide-5 video", { scale: 1.05, duration: 0.1, ease: "power2.inOut", force3D: true }, 0.9);
    };

    const timeoutId = setTimeout(initAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(st => st.kill());
      [videoRef, video2Ref].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.muted = true;
        }
      });
    };
  }, [state.loading, state.videoReady, state.video2Ready]);

  const services = [
    { icon: Palette, title: "Graphic Design", desc: "From logos to comprehensive brand visuals" },
    { icon: Film, title: "Video Editing", desc: "Crafting dynamic content that captures attention" },
    { icon: Zap, title: "Motion Graphics", desc: "Elevating your visuals with movements" },
    { icon: Layers, title: "2D/3D Animation", desc: "Bringing your ideas to life with dimension" },
    { icon: RotateCcw, title: "Logo Animation", desc: "Giving your brand identity dynamic edge" },
    { icon: Code, title: "Web Development", desc: "Build websites effectively and promote your brand" }
  ];

  const ServiceCard = ({ icon: Icon, title, desc, className = "" }) => (
    <div className={`group relative overflow-hidden p-6 sm:p-7 md:p-8 bg-gradient-to-br from-white/12 via-white/6 to-white/3 backdrop-blur-2xl border border-white/20 rounded-2xl transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 active:scale-95 shadow-2xl hover:shadow-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/20 hover:to-white/15 cursor-pointer ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-sm rounded-xl mb-4 sm:mb-5 mx-auto flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-white/40 group-hover:via-white/25 group-hover:to-white/10 transition-all duration-500 group-hover:shadow-white/30">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" />
        </div>
        <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-white drop-shadow-sm group-hover:text-white group-hover:drop-shadow-lg transition-all duration-300">{title}</h3>
        <p className="text-white/85 font-body leading-relaxed text-sm sm:text-base drop-shadow-sm group-hover:text-white/95 transition-all duration-300">{desc}</p>
      </div>
    </div>
  );

  const VideoControls = ({ videoRef, isMuted, setMuted, videoReady, videoStarted, setStarted, position = "left" }) => (
    <div className={`absolute bottom-16 ${position === 'left' ? 'left-8' : 'right-8 text-right'} z-10`}>
      <h2 className="text-white text-2xl md:text-4xl font-display font-bold mb-2">
        {position === 'left' ? 'Experience the Creativity.' : 'Helping clients succeed'}
      </h2>
      <p className="text-white/80 text-lg font-body max-w-md mb-4">
        {position === 'left' ? 'Watch the client\'s vision turned into life.' : 'Discover how we push creative boundaries and deliver exceptional results.'}
      </p>
      
      <div className={`flex flex-col gap-2 ${position === 'right' ? 'items-end' : ''}`}>
        <button 
          onClick={() => toggleVideoSound(videoRef, isMuted, setMuted, videoReady, videoStarted, setStarted)} 
          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30 font-medium w-fit flex items-center gap-2"
        >
          {!videoStarted ? 'Start Video' : (
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
  );

  return (
    <div className="relative h-[700vh]">
      {state.loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative flex flex-col items-center">
            <video className="w-64 h-64 object-cover rounded-full" autoPlay loop muted playsInline>
              <source src="/videos/loading.mp4" type="video/mp4" />
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </video>
            
            <div className="mt-8 text-white text-center">
              <div className="text-sm opacity-75 mb-2">Thank you for waiting!</div>
              <div className="flex gap-4 text-xs">
                {Object.entries(state.videoLoadStates).map(([key, value], index) => (
                  <div key={key} className={`transition-colors duration-300 ${value.loaded && value.canPlay ? 'text-green-400' : 'text-white/50'}`}>
                    {index === 0 ? 'Resources' : 'Assets'}: {value.readyState}/4
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="sticky top-0 h-screen w-screen overflow-hidden" style={{ willChange: 'transform' }}>
        {/* Slide 1 */}
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

        {/* Slide 2 - Services */}
        <div ref={slide2Ref} className="slide-2 relative min-h-screen w-full bg-black" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 pointer-events-none" />
          <div className="slide-content relative flex flex-col justify-center items-center text-center text-white z-10 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-8 sm:mb-10 md:mb-12 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" id="services">
                SERVICES OFFERED
              </span>
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  desc={service.desc}
                  className={[2, 5].includes(index) ? "sm:col-span-2 lg:col-span-1" : ""}
                />
              ))}
            </div>
            
            <div className="mt-8 sm:mt-10 md:mt-12 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        {/* Slide 3 */}
        <div ref={slide3Ref} className="slide-3 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-8">
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text">
                See Our Creative Impact
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-body font-light tracking-wide opacity-90 max-w-6xl leading-relaxed">
              Explore our portfolio to see the creativity, precision, and innovation that CR8 brings to every project. We've collaborated with a wide range of brands across industries, delivering standout results that captivate audiences.
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        {/* Slide 4 - Video 1 */}
        <div ref={slide4Ref} className="slide-4 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ willChange: 'transform' }} 
            src="videos/hero-2.mp4" 
            loop 
            playsInline 
            preload="metadata"
          />
          <VideoControls 
            videoRef={videoRef}
            isMuted={state.isMuted}
            setMuted={(muted) => updateState({ isMuted: muted })}
            videoReady={state.videoReady}
            videoStarted={state.videoStarted}
            setStarted={(started) => updateState({ videoStarted: started })}
            position="left"
          />
        </div>

        {/* Slide 5 - Video 2 */}
        <div ref={slide5Ref} className="slide-5 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
          {!state.video2Started && (
            <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url('img/thumbnail.png')`}}>
            </div>
          )}
          <video 
            ref={video2Ref} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${state.video2Started ? 'opacity-100' : 'opacity-0'}`} 
            style={{ willChange: 'transform' }} 
            src="videos/hero-3.mp4" 
            loop 
            playsInline 
            preload="metadata"
          />
          <VideoControls 
            videoRef={video2Ref}
            isMuted={state.isMuted2}
            setMuted={(muted) => updateState({ isMuted2: muted })}
            videoReady={state.video2Ready}
            videoStarted={state.video2Started}
            setStarted={(started) => updateState({ video2Started: started })}
            position="right"
          />
        </div>

        {/* Scroll Indicator */}
        {!state.isVideoSlideActive && (
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