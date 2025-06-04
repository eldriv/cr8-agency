import React, { useRef, useEffect, useState } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VerticalTextSlider = () => {
  const containerRef = useRef(null);
  const slideRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [slide1Ref, slide2Ref, slide3Ref, slide4Ref] = slideRefs;
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
    return (hero2.loaded && hero2.canPlay && hero2.readyState >= 3) && 
           (hero3.loaded && hero3.canPlay && hero3.readyState >= 3);
  };

  const setInitialPositions = () => {
    gsap.set(slide2Ref.current, { y: "100vh", force3D: true });
    gsap.set(slide3Ref.current, { x: "100vw", force3D: true });
    gsap.set(slide4Ref.current, { x: "-100vw", force3D: true });
    gsap.set(".slide-overlay", { opacity: 0, force3D: true });
    gsap.set(".slide-content", { y: -60, opacity: 0, force3D: true });
    gsap.set([".slide-3", ".slide-4"], { opacity: 0, force3D: true });
    gsap.set([".slide-3 video", ".slide-4 video"], { scale: 1, force3D: true });
  };

  const startVideoPlayback = async (videoRef, videoKey) => {
    const isReady = videoKey === 'video1' ? state.videoReady : state.video2Ready;
    if (videoRef.current && isReady) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        await videoRef.current.play();
        console.log(`${videoKey} started playing`);
        updateState(videoKey === 'video1' ? { videoStarted: true } : { video2Started: true });
        return true;
      } catch (error) {
        console.log(`${videoKey} start error:`, error);
        return false;
      }
    }
    return false;
  };

  const toggleVideoSound = async (videoRef, videoKey) => {
    const { isMuted, isMuted2, videoReady, video2Ready, videoStarted, video2Started } = state;
    const isReady = videoKey === 'video1' ? videoReady : video2Ready;
    const isStarted = videoKey === 'video1' ? videoStarted : video2Started;
    const currentMuted = videoKey === 'video1' ? isMuted : isMuted2;

    if (videoRef.current && isReady) {
      try {
        if (videoRef.current.paused || !isStarted) await startVideoPlayback(videoRef, videoKey);
        const newMutedState = !currentMuted;
        videoRef.current.muted = newMutedState;
        updateState(videoKey === 'video1' ? { isMuted: newMutedState } : { isMuted2: newMutedState });
        console.log(`${videoKey} sound: ${newMutedState ? 'OFF' : 'ON'}`);
      } catch (error) {
        console.log(`Error toggling sound for ${videoKey}:`, error);
      }
    }
  };

  const initializeVideo = (videoElement, videoKey) => {
    if (!videoElement) return;

    try {
      videoElement.load();
      Object.assign(videoElement, {
        loop: true,
        muted: true,
        preload: "metadata",
        playsInline: true
      });

      const updateState = () => {
        updateVideoLoadState(videoKey, {
          loaded: videoElement.readyState >= 2,
          canPlay: videoElement.readyState >= 3,
          readyState: videoElement.readyState
        });
      };

      const events = ['loadeddata', 'canplay', 'canplaythrough', 'loadedmetadata', 'progress'];
      events.forEach(event => {
        videoElement.addEventListener(event, () => {
          console.log(`${videoKey}: ${event}`);
          updateState();
        });
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

  useEffect(() => {
    if (slideRefs.every(ref => ref.current)) setInitialPositions();
  }, []);

  useEffect(() => {
    if (areVideosReady()) {
      console.log('Both hero videos are fully loaded and ready');
      const timer = setTimeout(() => {
        updateState({ loading: false, videoReady: true, video2Ready: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.videoLoadStates]);

  useEffect(() => {
    initializeVideo(videoRef.current, 'hero2');
    initializeVideo(video2Ref.current, 'hero3');
  }, []);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (state.loading) {
        console.log('Fallback: Force ending loading after timeout');
        updateState({ loading: false, videoReady: true, video2Ready: true });
      }
    }, 2000);
    return () => clearTimeout(fallbackTimer);
  }, [state.loading]);

  useEffect(() => {
    if (state.loading || !state.videoReady || !state.video2Ready) return;

    setInitialPositions();

    const initAnimation = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onUpdate: (self) => updateState({ isVideoSlideActive: self.progress > 0.7 })
        }
      });

      tl.to(".slide-1 .slide-content",{y:0,opacity:1,duration:0.2,ease:"power3.out",force3D:true})
        .to(".slide-1 .slide-overlay",{opacity:0.4,duration:0.15,ease:"power2.out"},"<")
        .to([slide2Ref.current,slide1Ref.current],{y:(i)=>i===0?"0vh":"-100vh",duration:0.2,ease:"power2.out",force3D:true,stagger:0},0.2)
        .to(".slide-1 .slide-content",{y:-40,opacity:0,duration:0.15,ease:"power2.in",force3D:true},0.2)
        .to(".slide-1 .slide-overlay",{opacity:0.8,duration:0.15,ease:"power2.in"},0.2)
        .to(".slide-2 .slide-content",{y:0,opacity:1,duration:0.25,ease:"power3.out",force3D:true},0.3)
        .to(".slide-2 .slide-overlay",{opacity:0.3,duration:0.2,ease:"power2.out"},0.3)
        .to(".slide-2 .slide-content",{y:-40,opacity:0,duration:0.2,ease:"power2.inOut",force3D:true},0.4)
        .to(".slide-2 .slide-overlay",{opacity:0.8,duration:0.2,ease:"power2.inOut"},0.4)
        .to(slide3Ref.current,{x:"0vw",duration:0.2,ease:"power2.inOut",force3D:true},0.5)
        .to(".slide-3",{opacity:1,duration:0.15,ease:"power2.inOut",force3D:true},0.55)
        .to(".slide-3 video",{scale:1.02,duration:0.15,ease:"power2.inOut",force3D:true},0.6)
        .to(".slide-3 video",{scale:1.04,duration:0.2,ease:"power2.inOut",force3D:true},0.7)
        .to(slide4Ref.current,{x:"0vw",duration:0.2,ease:"power2.inOut",force3D:true},0.8)
        .to(".slide-4",{opacity:1,duration:0.15,ease:"power2.inOut",force3D:true},0.85)
        .to(".slide-4 video",{scale:1.02,duration:0.15,ease:"power2.inOut",force3D:true},0.87)
        .to(".slide-4 video",{scale:1.05,duration:0.13,ease:"power2.inOut",force3D:true},0.92);
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

  const VideoControls = ({ videoRef, isStarted, isMuted, onToggle, position = "left" }) => (
    <div className={`absolute bottom-8 sm:bottom-16 ${position === "left" ? "left-4 sm:left-8" : "right-4 sm:right-8 text-right"} z-10`}>
      <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-display font-bold mb-2">
        {position === "left" ? "Experience the Creativity." : "Helping clients succeed"}
      </h2>
      <p className="text-white/80 text-sm sm:text-lg font-body max-w-xs sm:max-w-md mb-4">
        {position === "left" ? "Watch the client's vision turned into life." : "Discover how we push creative boundaries and deliver exceptional results."}
      </p>
      
      <div className={`flex flex-col gap-2 ${position === "right" ? "items-end" : ""}`}>
        <button onClick={onToggle} className="px-3 py-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30 font-medium w-fit flex items-center gap-2 text-sm">
          {!isStarted ? 'Start Video' : (
            <>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'Sound On' : 'Sound Off'}
            </>
          )}
        </button>
        
        {isStarted && (
          <p className="text-white/60 text-xs">
            Video is {videoRef.current?.paused ? 'paused' : 'playing'} • Sound {isMuted ? 'off' : 'on'}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative h-[500vh]">
      {state.loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative flex flex-col items-center px-4">
            <video className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-full" autoPlay loop muted playsInline>
              <source src="/videos/loading.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="mt-6 sm:mt-8 text-white text-center">
              <div className="text-sm opacity-75 mb-2">Thank you for waiting!</div>
              <div className="flex gap-4 text-xs justify-center">
                <div className={`transition-colors duration-300 ${state.videoLoadStates.hero2.loaded && state.videoLoadStates.hero2.canPlay ? 'text-green-400' : 'text-white/50'}`}>
                  Resources: {state.videoLoadStates.hero2.readyState}/4
                </div>
                <div className={`transition-colors duration-300 ${state.videoLoadStates.hero3.loaded && state.videoLoadStates.hero3.canPlay ? 'text-green-400' : 'text-white/50'}`}>
                  Assets: {state.videoLoadStates.hero3.readyState}/4
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="sticky top-0 h-screen w-screen overflow-hidden" style={{ willChange: 'transform' }}>
        {/* Slide 1 */}
        <div ref={slide1Ref} className="slide-1 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-4 sm:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-display font-bold mb-4 sm:mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Let's Create Your Creative Vision
              </span>
            </h1>
            <p className="appointment-description font-body font-light tracking-wide opacity-90 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed translate-y-6 px-4">
              We craft unique visual stories that amplify your brand and captivate your audience.
              From design to production, we partner with you every step of the way to bring your ideas to life.
            </p>
            <div className="mt-6 sm:mt-8 w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        {/* Slide 2 */}
        <div ref={slide2Ref} className="slide-2 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-4 sm:px-8">
            <h1 className="text-2xl sm:text-4xl md:text-7xl font-display font-bold mb-6 sm:mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text">
                See Our Creative Impact
              </span>
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl font-body font-light tracking-wide opacity-90 max-w-2xl sm:max-w-4xl md:max-w-6xl leading-relaxed">
              Explore our portfolio to see the creativity, precision, and innovation that CR8 brings to every project. We've collaborated with a wide range of brands across industries, delivering standout results that captivate audiences.
            </p>
            <div className="mt-6 sm:mt-8 w-20 sm:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        {/* Slide 3 - Video */}
        <div ref={slide3Ref} className="slide-3 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
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
            isStarted={state.videoStarted}
            isMuted={state.isMuted}
            onToggle={() => toggleVideoSound(videoRef, 'video1')}
            position="left"
          />
        </div>

        {/* Slide 4 - Video */}
        <div ref={slide4Ref} className="slide-4 absolute inset-0 h-full w-full opacity-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>
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
            isStarted={state.video2Started}
            isMuted={state.isMuted2}
            onToggle={() => toggleVideoSound(video2Ref, 'video2')}
            position="right"
          />
        </div>

        {/* Scroll Indicator */}
        {!state.isVideoSlideActive && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 md:left-1/2 md:transform md:-translate-x-1/2 z-20">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center mx-auto">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mt-2 text-center tracking-wider font-body">SCROLL</p>
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

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .slide-content {
            padding-top: env(safe-area-inset-top, 20px);
            padding-bottom: env(safe-area-inset-bottom, 20px);
          }
          
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
        }

        /* Smooth scrolling improvements */
        @media (prefers-reduced-motion: no-preference) {
          .slide-1, .slide-2, .slide-3, .slide-4 {
            will-change: transform;
          }
        }
        
        /* Prevent horizontal overflow on mobile */
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          
          .slide-content {
            max-width: 100vw;
          }
        }

        /* Ensure scroll indicator is centered on desktop, unchanged on mobile */
        @media (min-width: 769px) {
          .scroll-indicator {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default VerticalTextSlider;