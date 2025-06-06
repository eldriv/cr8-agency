import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const styles = `
@keyframes infiniteScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes pulse-subtle { 
  0% { opacity: 0.8; transform: scale(1); } 
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); } 
} 
@keyframes ping-slow { 
  0% { transform: scale(0.8); opacity: 0.3; } 
  100% { transform: scale(1.8); opacity: 0; } 
} 
@keyframes ping-slower { 
  0% { transform: scale(0.7); opacity: 0.3; } 
  100% { transform: scale(1.7); opacity: 0; } 
} 
@keyframes ping-slowest { 
  0% { transform: scale(0.6); opacity: 0.3; } 
  100% { transform: scale(1.6); opacity: 0; } 
} 
@keyframes float-icon { 
  0%, 100% { transform: translateY(0) rotate(0deg); } 
  25% { transform: translateY(-5px) rotate(2deg); } 
  50% { transform: translateY(-10px) rotate(0deg); } 
  75% { transform: translateY(-5px) rotate(-2deg); } 
} 
.infinite-scroll { animation: infiniteScroll 25s linear infinite; }
.infinite-scroll.paused { animation-play-state: paused; }
.animate-pulse-subtle { animation: pulse-subtle 3s infinite ease-in-out; } 
.animate-ping-slow { animation: ping-slow 3s infinite cubic-bezier(0, 0, 0.2, 1); } 
.animate-ping-slower { animation: ping-slower 4s infinite cubic-bezier(0, 0, 0.2, 1); } 
.animate-ping-slowest { animation: ping-slowest 5s infinite cubic-bezier(0, 0, 0.2, 1); } 
.animate-float-icon { animation: float-icon 4s ease-in-out infinite; } 
.lightbox-overlay { 
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
  background-color: rgba(0, 0, 0, 0.95); z-index: 9999; 
  display: flex; align-items: center; justify-content: center; 
  backdrop-filter: blur(10px); 
} 
.lightbox-content { 
  position: relative; width: 90vw; max-width: 400px; height: 85vh; 
  border-radius: 12px; overflow: hidden; 
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.3); 
} 
@media (max-width: 768px) { 
  .lightbox-content { width: 95vw; max-width: 100vw; height: 90vh; border-radius: 8px; } 
} 
.lightbox-video { width: 100%; height: 100%; object-fit: cover; } 
.lightbox-close { 
  position: absolute; top: 15px; right: 15px; 
  background: rgba(0, 0, 0, 0.6); color: white; 
  width: 35px; height: 35px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.2); 
  transition: background 0.3s ease; z-index: 10000; 
} 
@media (max-width: 768px) { 
  .lightbox-close { top: 10px; right: 10px; width: 30px; height: 30px; } 
} 
.lightbox-close:hover { background: rgba(255, 255, 255, 0.2); }
`;

// Mobile detection hook
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isSmallScreen || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Optimized components
export const BentoBox = ({ children, className = "", height = "auto" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);
  
  const handleMouseMove = useCallback((event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.3) * 3;
    const tiltY = (relativeX - 0.3) * -3;
    const newTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
    setTransformStyle(newTransform);
  }, []);
  
  const handleMouseLeave = useCallback(() => setTransformStyle(""), []);
  
  const boxStyle = useMemo(() => ({
    transform: transformStyle,
    height,
    boxShadow: transformStyle ? "0 20px 40px rgba(0,0,0,0.2)" : "0 10px 30px rgba(0,0,0,0.1)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
    position: "relative",
  }), [transformStyle, height]);
  
  return (
    <div 
      ref={itemRef} 
      className={`rounded-xl overflow-hidden ${className}`} 
      style={boxStyle}
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export const ModernButton = ({ icon, label, className = "", onClick, href }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const buttonRef = useRef(null);
  
  const handleMouseMove = useCallback((event) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCursorPosition({ 
      x: event.clientX - rect.left, 
      y: event.clientY - rect.top 
    });
  }, []);
  
  const handleMouseEnter = useCallback(() => setHoverOpacity(1), []);
  const handleMouseLeave = useCallback(() => setHoverOpacity(0), []);
  
  const handleClick = useCallback((e) => {
    if (href) {
      e.preventDefault();
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (onClick) onClick(e);
  }, [href, onClick]);

  const ButtonContent = useMemo(() => (
    <>
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" 
        style={{ 
          opacity: hoverOpacity, 
          background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #ffffff33, #00000026)` 
        }} 
      />
      <span className="relative z-20">{icon}</span>
      <span className="relative z-20">{label}</span>
    </>
  ), [hoverOpacity, cursorPosition, icon, label]);

  const commonProps = {
    ref: buttonRef,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    className: `relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-black px-5 py-3 text-sm uppercase text-white border border-gray-800 font-body ${className}`
  };

  return href ? (
    <a {...commonProps} href={href}>
      {ButtonContent}
    </a>
  ) : (
    <button {...commonProps}>
      {ButtonContent}
    </button>
  );
};

// Memoized VideoLightbox
const VideoLightbox = ({ video, onClose }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay in lightbox prevented:", error);
      });
    }
    
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <div className="lightbox-content" onClick={handleContentClick}>
        <video 
          ref={videoRef} 
          className="lightbox-video" 
          controls 
          autoPlay 
          loop 
          src={video.video} 
        />
        <button className="lightbox-close" onClick={handleOverlayClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Optimized VideoCard with better performance
const VideoCard = ({ video, onClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const thumbnailAttemptRef = useRef(0);
  const isMobile = useMobileDetection();
  
  const maxThumbnailAttempts = 3;

  // Optimized thumbnail generation
  const generateThumbnail = useCallback((videoElement) => {
    try {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (videoElement.readyState < 2) return false;

      const videoWidth = videoElement.videoWidth || videoElement.clientWidth || 400;
      const videoHeight = videoElement.videoHeight || videoElement.clientHeight || 300;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const quality = isMobile ? 0.7 : 0.8;
      const dataURL = canvas.toDataURL('image/jpeg', quality);

      if (dataURL && dataURL !== 'data:,') {
        setThumbnailUrl(dataURL);
        setThumbnailError(false);
        return true;
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      setThumbnailError(true);
    }
    return false;
  }, [isMobile]);

  // Debounced retry function
  const retryThumbnailGeneration = useCallback((videoElement, delay = 500) => {
    if (thumbnailAttemptRef.current >= maxThumbnailAttempts) {
      setThumbnailError(true);
      return;
    }

    thumbnailAttemptRef.current += 1;
    setTimeout(() => {
      if (!thumbnailUrl && videoElement) {
        const success = generateThumbnail(videoElement);
        if (!success && thumbnailAttemptRef.current < maxThumbnailAttempts) {
          retryThumbnailGeneration(videoElement, delay * 1.5);
        }
      }
    }, delay);
  }, [thumbnailUrl, generateThumbnail]);

  // Video setup with consolidated event handlers
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    thumbnailAttemptRef.current = 0;

    const handleVideoReady = () => {
      setIsLoaded(true);
      if (!thumbnailUrl) {
        const success = generateThumbnail(video);
        if (!success) retryThumbnailGeneration(video, 200);
      }
    };

    const handleError = (e) => {
      console.error('Video error:', e);
      setThumbnailError(true);
    };

    const handleTimeUpdate = () => {
      if (video.currentTime <= 0.1 && !thumbnailUrl && video.readyState >= 2) {
        generateThumbnail(video);
      }
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('canplaythrough', handleVideoReady);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    // Mobile-specific settings
    if (isMobile) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
      video.muted = true;
    }

    video.preload = isMobile ? 'metadata' : 'auto';
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('canplaythrough', handleVideoReady);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
    };
  }, [isMobile, thumbnailUrl, generateThumbnail, retryThumbnailGeneration]);

  // Interaction handlers
  const handleInteractionStart = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    const delay = isMobile ? 200 : 100;
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isMobile) {
        setIsPlaying(true);
        if (videoRef.current && isLoaded) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      }
    }, delay);
  }, [isMobile, isLoaded]);

  const handleInteractionEnd = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    if (!isMobile) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isMobile]);

  const handleClick = useCallback(() => onClick(video), [onClick, video]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Memoized fallback thumbnail
  const getFallbackThumbnail = useMemo(() => {
    if (thumbnailUrl) return thumbnailUrl;
    if (video.thumbnail) return video.thumbnail;
    return `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="#1a1a1a"/>
<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial" font-size="16">Video Thumbnail</text>
</svg>`)}`;
  }, [thumbnailUrl, video.thumbnail]);

  const cardStyle = useMemo(() => ({
    transform: "perspective(1000px) rotateY(-15deg)"
  }), []);

  return (
    <div
      className="w-[280px] sm:w-[320px] lg:w-[380px] h-[400px] sm:h-[480px] lg:h-[540px] mx-2 sm:mx-4 flex-shrink-0 perspective-1000 cursor-pointer transform transition-all duration-500 hover:scale-105"
      style={cardStyle}
      onMouseEnter={!isMobile ? handleInteractionStart : undefined}
      onMouseLeave={!isMobile ? handleInteractionEnd : undefined}
      onTouchStart={isMobile ? handleInteractionStart : undefined}
      onTouchEnd={isMobile ? handleInteractionEnd : undefined}
      onClick={handleClick}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
        {/* Thumbnail overlay */}
        <div
          className={`absolute inset-0 z-10 bg-cover bg-center transition-opacity duration-500 ${
            (isPlaying && isLoaded && !isMobile) ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${getFallbackThumbnail})`,
            backgroundColor: '#1a1a1a'
          }}
        />

        {/* Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            (isPlaying && isLoaded && !isMobile) ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload={isMobile ? "metadata" : "auto"}
          src={video.video}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent pointer-events-none" />

        {/* Play button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          (!isPlaying || isMobile) ? "opacity-100" : "opacity-0"
        }`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm transform transition-transform group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/10 backdrop-blur-sm px-3 py-2 sm:px-4 rounded-full text-white font-medium font-body text-sm">
            {isMobile ? 'Tap to View' : 'Click to View'}
          </span>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Optimized HorizontalVideoShowcase
const HorizontalVideoShowcase = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const showcaseRef = useRef(null);
  const isMobile = useMobileDetection();

  // Memoized videos array
  const videos = useMemo(() => [
    { id: 1, thumbnail: "img/thumbnail-1.png", video: "videos/hero-4.mp4" },
    { id: 2, thumbnail: "img/thumbnail-2.png", video: "videos/hero-5.mp4" },
    { id: 3, thumbnail: "img/thumbnail-3.png", video: "videos/hero-6.mp4" },
    { id: 4, thumbnail: "img/thumbnail-4.png", video: "videos/hero-7.mp4" },
    { id: 5, thumbnail: "img/thumbnail-5.png", video: "videos/hero-8.mp4" },
  ], []);

  // Memoized infinite videos array
  const infiniteVideos = useMemo(() => [...videos, ...videos, ...videos], [videos]);

  const handleVideoClick = useCallback((video) => {
    setSelectedVideo(video);
    setIsPaused(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedVideo(null);
    setIsPaused(false);
  }, []);

  const pauseAnimation = useCallback(() => setIsPaused(true), []);
  const resumeAnimation = useCallback(() => {
    if (!selectedVideo) setIsPaused(false);
  }, [selectedVideo]);

  const scrollContainerStyle = useMemo(() => ({
    width: `${infiniteVideos.length * (isMobile ? 304 : 384)}px`,
    paddingLeft: isMobile ? "8px" : "12px",
    paddingRight: isMobile ? "8px" : "12px",
  }), [infiniteVideos.length, isMobile]);

  return (
    <div ref={showcaseRef} className="w-full relative overflow-hidden py-4 sm:py-8">
      <div className="flex justify-start items-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">OUR WORKS</h2>
      </div>

      <div className="relative h-[500px] sm:h-[580px] lg:h-[650px] perspective-1000">
        <div className="overflow-hidden" style={{ width: '100%' }}>
          <div
            className={`flex items-center py-4 infinite-scroll ${isPaused ? 'paused' : ''}`}
            onMouseEnter={!isMobile ? pauseAnimation : undefined}
            onMouseLeave={!isMobile ? resumeAnimation : undefined}
            onTouchStart={isMobile ? pauseAnimation : undefined}
            onTouchEnd={isMobile ? resumeAnimation : undefined}
            style={scrollContainerStyle}
          >
            {infiniteVideos.map((video, index) => (
              <VideoCard
                key={`${video.id}-${Math.floor(index / videos.length)}-${index % videos.length}`}
                video={video}
                onClick={handleVideoClick}
              />
            ))}
          </div>
        </div>

        {/* Control overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            {isMobile ? 'Touch to pause • Tap to view' : 'Hover to pause • Click to view'}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <VideoLightbox video={selectedVideo} onClose={closeLightbox} />
      )}
    </div>
  );
};

// Optimized ConsultationSection
const ConsultationSection = () => {
  const consultationRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: consultationRef.current,
        start: "top 85%",
        end: "top 15%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(consultationRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(consultationRef.current.querySelector('.consultation-icon'),
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.5, ease: "back.out(1.7)" },
      "-=0.8"
    );
  }, []);

  return (
    <div ref={consultationRef} className="relative mb-8 sm:mb-16 group">
      <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="consultation-icon animate-float-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display group-hover:text-purple-300 transition-colors duration-300" id="works">
              CONSULTATION
            </h2>
          </div>
          <p className="font-body text-gray-200 text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed group-hover:text-white transition-colors duration-300">
            We begin with an in-depth consultation to understand your brand's needs, goals, and vision. Whether you need motion graphics, animation, or a full-scale video production, our team is ready to help transform your ideas into stunning visual content.
          </p>
          <div>
            <ModernButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              label="SCHEDULE CONSULTATION"
              className="text-sm sm:text-base py-3 px-6 sm:py-4 sm:px-8"
              href="#contact"
            />
          </div>
        </div>
        <div className="flex-shrink-0 flex justify-center relative">
          <div className="relative">
            <div className="animate-pulse-subtle consultation-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 sm:h-32 sm:w-32 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute inset-0 border border-purple-400 rounded-full animate-ping-slow opacity-20"></div>
              <div className="absolute inset-2 border border-purple-300 rounded-full animate-ping-slower opacity-30 delay-300"></div>
              <div className="absolute inset-4 border border-purple-200 rounded-full animate-ping-slowest opacity-10 delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef(null);
  const showcaseBoxRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });

    gsap.fromTo(showcaseBoxRef.current,
      { opacity: 0, y: 80, scale: 0.8 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out",
        scrollTrigger: {
          trigger: showcaseBoxRef.current,
          start: "top 90%",
          end: "top 10%",
          toggleActions: "play none none reverse"
        }
      });
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-20 min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="grid grid-cols-1 gap-8">
          <ConsultationSection />
          <div ref={showcaseBoxRef}>
            <BentoBox className="overflow-hidden p-6" height="auto">
              <HorizontalVideoShowcase />
            </BentoBox>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;