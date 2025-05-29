import { useState, useEffect, useRef } from 'react';

// Custom SVG Icons
const Send = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22,2 15,22 11,13 2,9"></polygon>
  </svg>
);

const CheckCircle = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="9,11 12,14 22,4"></polyline>
  </svg>
);

const Mail = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const User = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MessageSquare = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Hash = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const AlertTriangle = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="m12 17 .01 0"></path>
  </svg>
);

// Luxury Card Component
const LuxuryCard = ({ children, className = "" }) => {
  return (
    <div className={`relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-300/20 rounded-2xl backdrop-blur-sm shadow-2xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-2xl opacity-50" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const InputField = ({ 
  icon: Icon, 
  label, 
  type = 'text', 
  name, 
  placeholder, 
  rows, 
  value, 
  onChange, 
  error 
}) => {
  const isTextarea = type === 'textarea';
  const hasValue = value;
  const hasError = error;

  return (
    <div className="relative group">
      <LuxuryCard className={`relative ${isTextarea ? 'h-auto' : 'h-12 sm:h-14 lg:h-16'} transition-all duration-500 hover:shadow-xl hover:border-white/30 ${
        hasError ? 'border-red-400/50' : ''
      }`}>
        <div className={`absolute left-3 sm:left-4 lg:left-5 ${isTextarea ? 'top-3 sm:top-4 lg:top-5' : 'top-1/2 -translate-y-1/2'} z-10 transition-all duration-300 ${
          hasValue ? 'text-white scale-110' : 'text-gray-400'
        }`}>
          <Icon size={16} className="sm:w-5 sm:h-5" />
        </div>

        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="relative w-full bg-transparent border-0 outline-none text-white placeholder-gray-500 pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 lg:pr-5 pt-3 sm:pt-4 lg:pt-5 pb-3 sm:pb-4 lg:pb-5 resize-none z-10 text-base sm:text-lg font-light tracking-wide"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="relative w-full bg-transparent border-0 outline-none text-white placeholder-gray-500 pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 lg:pr-5 py-3 sm:py-4 h-12 sm:h-14 lg:h-16 z-10 text-base sm:text-lg font-light tracking-wide"
          />
        )}

        {hasValue && (
          <label className="absolute left-10 sm:left-12 lg:left-14 top-1 sm:top-2 text-xs text-white/80 font-light tracking-wider z-5 transition-all duration-300">
            {label.toUpperCase()}
          </label>
        )}
      </LuxuryCard>

      {hasError && (
        <div className="mt-2 text-red-400 text-xs sm:text-sm flex items-center">
          <div className="w-1 h-1 bg-red-400 rounded-full mr-2" />
          {hasError}
        </div>
      )}
    </div>
  );
};

function LuxuryContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  // For demo purposes - replace with your actual Formspree endpoint
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xovdzpnj"; // Your endpoint from env
  
  // Animation Refs
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formContainerRef = useRef(null);
  const pulseRef = useRef(null);

  // Intersection Observer for section-based animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.min(sectionHeight, windowHeight - rect.top);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // Progress through the section (0 to 1)
      const progress = Math.min(Math.max(visibleHeight / windowHeight, 0), 1);
      setSectionProgress(progress);
      
      // Circle expansion phases - made slower and more gradual
      const circleExpansionStart = 0.5;
      const circleExpansionEnd = 2; // Extended end point for slower expansion
      const formFadeStart = 0.7; // Start form fade later
      
      if (progress >= circleExpansionStart && progress <= circleExpansionEnd) {
        const expansionProgress = (progress - circleExpansionStart) / (circleExpansionEnd - circleExpansionStart);
        // Use a more gradual easing function
        const easeProgress = 1 - Math.pow(1 - expansionProgress, 4); // Slower ease out
        
        // Calculate scale to cover full viewport
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const diagonal = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight);
        // Start with small circle (32px diameter) and scale to cover diagonal + extra
        const startSize = 32; // 8 * 4 (w-8 h-8)
        const maxScale = (diagonal * 1.5) / startSize; // 1.5x for safety margin
        
        const currentScale = 1 + (maxScale * easeProgress);
        
        if (circleRef.current) {
          circleRef.current.style.transform = `scale(${currentScale})`;
          // Fade out circle more gradually
          const fadeOutStart = 0.6;
          if (expansionProgress >= fadeOutStart) {
            const fadeProgress = (expansionProgress - fadeOutStart) / (1 - fadeOutStart);
            circleRef.current.style.opacity = Math.max(0, 1 - fadeProgress);
          } else {
            circleRef.current.style.opacity = '1';
          }
        }
        
        // Fade out pulse as circle expands
        if (pulseRef.current) {
          pulseRef.current.style.opacity = Math.max(0, 1 - expansionProgress * 1.5);
        }
      } else if (progress < circleExpansionStart) {
        // Reset circle to initial state
        if (circleRef.current) {
          circleRef.current.style.transform = 'scale(1)';
          circleRef.current.style.opacity = '1';
        }
        if (pulseRef.current) {
          pulseRef.current.style.opacity = '1';
        }
      }
      
      // Title and subtitle fade out - made more gradual
      if (titleRef.current) {
        const titleFadeStart = 0.2;
        const titleOpacity = progress <= titleFadeStart ? 1 : Math.max(0, 1 - ((progress - titleFadeStart) / 0.4));
        const titleScale = Math.max(0.9, 1 - progress * 0.2);
        titleRef.current.style.opacity = titleOpacity;
        titleRef.current.style.transform = `scale(${titleScale})`;
      }

      if (subtitleRef.current) {
        const subtitleFadeStart = 0.3;
        const subtitleOpacity = progress <= subtitleFadeStart ? 1 : Math.max(0, 1 - ((progress - subtitleFadeStart) / 0.3));
        subtitleRef.current.style.opacity = subtitleOpacity;
        subtitleRef.current.style.transform = `translateY(${progress * 20}px)`;
      }
      
      // Form fade in - more gradual
      if (progress >= formFadeStart) {
        setShowForm(true);
        const formProgress = (progress - formFadeStart) / (1 - formFadeStart);
        const formOpacity = Math.min(1, formProgress * 1.5);
        const formTranslateY = Math.max(0, 50 - formProgress * 50);
        
        if (formContainerRef.current) {
          formContainerRef.current.style.opacity = formOpacity;
          formContainerRef.current.style.transform = `translateY(${formTranslateY}px)`;
        }
      } else {
        setShowForm(false);
        if (formContainerRef.current) {
          formContainerRef.current.style.opacity = '0';
          formContainerRef.current.style.transform = 'translateY(50px)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if Formspree endpoint is configured
    if (!FORMSPREE_ENDPOINT) {
      setErrors({ submit: 'Contact form is not configured. Please check environment variables.' });
      return;
    }
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _replyto: formData.email,
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: ''
            });
          }, 5000);
        } else {
          const errorData = await response.json();
          setErrors({ submit: errorData.error || 'Failed to send message. Please try again.' });
        }
      } catch (error) {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
        console.error('Contact form error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }

        code {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
        }
      `}</style>
      
      <section 
        className="bg-black relative overflow-hidden min-h-screen py-20 sm:py-16 lg:py-20" 
        ref={sectionRef}
      >
        {/* Hero Content - Always visible initially */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px" id="contact">
          <div className="text-center relative">
            {/* Expanding Circle with Pulse */}
            <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
              {/* Pulsing dot */}
              <div 
                ref={pulseRef}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full z-20 transition-opacity duration-700"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              
              {/* Expanding circle */}
              <div 
                ref={circleRef}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-white/60 rounded-full transition-all duration-1000 ease-out origin-center"
                style={{
                  willChange: 'transform, opacity'
                }}
              />
            </div>
            
            <h1 ref={titleRef} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-thin tracking-widest text-white/90 transition-all duration-1000">
              CONTACT
            </h1>
            <p 
              ref={subtitleRef}
              className="text-xs sm:text-sm tracking-wider mt-3 sm:mt-4 text-white/60 transition-all duration-1000 px-4"
            >
              Scroll to begin your journey
            </p>
          </div>
        </div>

        {/* Form Container - Appears when circle expands */}
        <div 
          ref={formContainerRef}
          className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6 lg:px-8 pb-36"
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            pointerEvents: showForm ? 'auto' : 'none'
          }}
        >
          <div className="w-full max-w-[1200px]">
            {/* Status indicator */}
            <div className="flex items-center justify-center mb-6 sm:mb-8 mt-40">
              <LuxuryCard className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-white/20">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs sm:text-sm font-light tracking-widest uppercase">Available for Projects</span>
                </div>
              </LuxuryCard>
            </div>

            {/* Header */}
            <div className="text-center mb-10 sm:mb-12 lg:mb-16 px-4">
              <h1 className="font-display text-[36px] sm:text-[48px] md:text-[60px] font-bold text-white leading-tight">
                Let's Collaborate
              </h1>
              <p className="mt-10 font-body sm:text-[24px] text-white opacity-80 max-w-md sm:max-w-2xl md:max-w-4xl mx-auto leading-relaxed">
                Exceptional projects begin with meaningful conversations. Share your vision, and let's create something extraordinary together.
              </p>
            </div>

            {/* Form Container */}
            <LuxuryCard className="p-4 sm:p-6 md:p-8 lg:p-16 shadow-2xl mx-2 sm:mx-0">
              {isSubmitted ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10"
                    style={{
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-white mb-6 sm:mb-8 tracking-tight px-4">Message Delivered</h2>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-md mx-auto font-light px-4">
                    Your message has been received with care. Expect a thoughtful response within 24 hours.
                  </p>
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <LuxuryCard className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                      <span className="text-white/60 text-xs sm:text-sm font-light tracking-wide">Form will reset shortly...</span>
                    </LuxuryCard>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <InputField
                      icon={User}
                      label="Your Name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    <InputField
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                  </div>

                  <InputField
                    icon={Hash}
                    label="Subject"
                    name="subject"
                    placeholder="Project inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    error={errors.subject}
                  />

                  <InputField
                    icon={MessageSquare}
                    label="Your Message"
                    type="textarea"
                    name="message"
                    rows={6}
                    placeholder="Share your vision, project details, timeline, or simply introduce yourself..."
                    value={formData.message}
                    onChange={handleInputChange}
                    error={errors.message}
                  />

                  {/* Submit Error */}
                  {errors.submit && (
                    <LuxuryCard className="p-4 sm:p-6 border-red-400/30 bg-red-500/5">
                      <p className="text-red-300 text-sm flex items-center font-light">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3" />
                        {errors.submit}
                      </p>
                    </LuxuryCard>
                  )}     

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center text-gray-400 text-xs sm:text-sm space-x-2 sm:space-x-3 font-light order-2 sm:order-1">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="tracking-wide">Response within 24 hours</span>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !FORMSPREE_ENDPOINT}
                      className="relative group overflow-hidden order-1 sm:order-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-xl transition-all duration-500 group-hover:shadow-lg group-hover:shadow-white/20" />
                      <div className="relative bg-white text-black font-light py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 group-hover:bg-gray-100 tracking-wide text-sm sm:text-base">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            <span>Send Message</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </LuxuryCard>  
          </div>
        </div>
      </section>
    </div>
  );
}


export default LuxuryContactSection;