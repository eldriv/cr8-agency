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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const initializeVideos = () => {
      if (!loading) {
        if (videoRef.current) {
          try {
            videoRef.current.preload = "auto";
            videoRef.current.loop = true;
            videoRef.current.muted = true;
            const onLoadedData = () => {
              setVideoReady(true);
              console.log('Video initialized and ready to play');
              videoRef.current.removeEventListener('loadeddata', onLoadedData);
            };
            videoRef.current.addEventListener('loadeddata', onLoadedData);
            videoRef.current.addEventListener('error', (e) => {
              console.error('Video loading error:', e);
              setVideoReady(true);
            }, { once: true });
          } catch (error) {
            console.log('Video initialization error:', error);
            setVideoReady(true);
          }
        }
        if (video2Ref.current) {
          try {
            video2Ref.current.preload = "auto";
            video2Ref.current.loop = true;
            video2Ref.current.muted = true;
            const onLoadedData2 = () => {
              setVideo2Ready(true);
              console.log('Video 2 initialized and ready to play');
              video2Ref.current.removeEventListener('loadeddata', onLoadedData2);
            };
            video2Ref.current.addEventListener('loadeddata', onLoadedData2);
            video2Ref.current.addEventListener('error', (e) => {
              console.error('Video 2 loading error:', e);
              setVideo2Ready(true);
            }, { once: true });
          } catch (error) {
            console.log('Video 2 initialization error:', error);
            setVideo2Ready(true);
          }
        }
      }
    };

    if (!loading) initializeVideos();

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => {});
        videoRef.current.removeEventListener('error', () => {});
      }
      if (video2Ref.current) {
        video2Ref.current.removeEventListener('loadeddata', () => {});
        video2Ref.current.removeEventListener('error', () => {});
      }
    };
  }, [loading]);

  useEffect(() => {
    if (loading || !videoReady || !video2Ready) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.3,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.8) {
            setIsVideoSlideActive(true);
          } else {
            setIsVideoSlideActive(false);
          }
        }
      }
    });

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

    tl.to(".slide-1 .slide-content", { y: 0, opacity: 1, duration: 0.1, ease: "power3.out", force3D: true })
      .to(".slide-1 .slide-overlay", { opacity: 0.4, duration: 0.1, ease: "power2.out" }, "<")
      .to([slide2Ref.current, slide1Ref.current], { y: (i) => (i === 0 ? "0vh" : "-100vh"), duration: 0.1, ease: "power2.out", force3D: true }, 0.1)
      .to(".slide-1 .slide-content", { y: -40, opacity: 0, duration: 0.1, ease: "power2.in", force3D: true }, 0.1)
      .to(".slide-1 .slide-overlay", { opacity: 0.8, duration: 0.1, ease: "power2.in" }, 0.1)
      .to(".slide-2 .slide-content", { y: 0, opacity: 1, duration: 0.1, ease: "power3.out", force3D: true }, 0.2)
      .to(".slide-2 .slide-overlay", { opacity: 0.3, duration: 0.1, ease: "power2.out" }, 0.2)
      .to(".slide-2 .slide-content", { y: -40, opacity: 0, duration: 0.1, ease: "power2.in", force3D: true }, 0.3)
      .to(".slide-2 .slide-overlay", { opacity: 0.8, duration: 0.1, ease: "power2.in" }, 0.3)
      .to([slide3Ref.current, slide2Ref.current], { y: (i) => (i === 0 ? "0vh" : "-100vh"), duration: 0.1, ease: "power2.out", force3D: true }, 0.4)
      .to(".slide-3 .slide-content", { y: 0, opacity: 1, duration: 0.1, ease: "power3.out", force3D: true }, 0.5)
      .to(".slide-3 .slide-overlay", { opacity: 0.3, duration: 0.1, ease: "power2.out" }, 0.5)
      .to(".slide-3 .slide-content", { y: -40, opacity: 0, duration: 0.1, ease: "power2.inOut", force3D: true }, 0.6)
      .to(".slide-3 .slide-overlay", { opacity: 0.8, duration: 0.1, ease: "power2.inOut" }, 0.6)
      .to(slide4Ref.current, { x: "0vw", duration: 0.1, ease: "power2.inOut", force3D: true }, 0.7)
      .to(".slide-4", { opacity: 1, duration: 0.1, ease: "power2.inOut", force3D: true }, 0.8)
      .to(".slide-4 video", { scale: 1.02, duration: 0.1, ease: "power2.inOut", force3D: true }, 0.9)
      .to(".slide-4 video", { scale: 1.04, duration: 0.1, ease: "power2.inOut", force3D: true }, 1.0)
      .to(slide5Ref.current, { x: "0vw", duration: 0.1, ease: "power2.inOut", force3D: true }, 1.1)
      .to(".slide-5", { opacity: 1, duration: 0.1, ease: "power2.inOut", force3D: true }, 1.2)
      .to(".slide-5 video", { scale: 1.02, duration: 0.1, ease: "power2.inOut", force3D: true }, 1.3)
      .to(".slide-5 video", { scale: 1.05, duration: 0.1, ease: "power2.inOut", force3D: true }, 1.4);

    return () => {
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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/20 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
          </div>
          <p className="ml-4 text-white font-body font-light text-lg tracking-wider">Loading Experience...</p>
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

        <div ref={slide2Ref} className="slide-2 absolute inset-0 h-full w-full bg-black" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-8 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-12 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" id="services">
                SERVICES OFFERED
              </span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 flex mx-auto items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Graphic Design</h3>
                <p className="text-white/80 font-body leading-relaxed">From logos to comprehensive brand visuals</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Video Editing</h3>
                <p className="text-white/80 font-body leading-relaxed">Crafting dynamic content that captures attention</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Motion Graphics</h3>
                <p className="text-white/80 font-body leading-relaxed">Elevating your visuals with movements</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">2D/3D Animation</h3>
                <p className="text-white/80 font-body leading-relaxed">Bringing your ideas to life with dimension</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Logo Animation</h3>
                <p className="text-white/80 font-body leading-relaxed">Giving your brand identity dynamic edge</p>
              </div>

              <div className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-transparent to-white/10 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Web Development</h3>
                <p className="text-white/80 font-body leading-relaxed">Build website effectively and promotes a brand</p>
              </div>
            </div>

            <div className="mt-12 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>

        <div ref={slide3Ref} className="slide-3 absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
          <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black pointer-events-none" />
          <div className="slide-content absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-8">
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white-800 bg-clip-text ">
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
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ willChange: 'transform' }} src="videos/hero-2.mp4" loop playsInline preload="auto" onLoadedData={() => console.log('Video loaded successfully')} onError={(e) => console.error('Video loading error:', e)} />
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
            <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{backgroundImage:`linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyMCIgeTI9IjEwODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMUUxRTFFIi8+PHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMzNzM3MzciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxRTFFMUUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')`}}>
            </div>
          )}
          
          <video ref={video2Ref} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${video2Started ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'transform' }} src="videos/hero-3.mp4" loop playsInline preload="auto" onLoadedData={() => console.log('Video 2 loaded successfully')} onError={(e) => console.error('Video 2 loading error:', e)} />
          
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
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-6 ml-4 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
            <p className="text-white/60 text-sm mt-2 text-center tracking-wider font-body">SCROLL</p>
          </div>
        )}
      </div>

      <style jsx>{`
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