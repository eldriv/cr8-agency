import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Consolidated SVG Icons with shared props
const createIcon = (paths) => ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {paths}
  </svg>
);

const Send = createIcon([
  <line key="1" x1="22" y1="2" x2="11" y2="13" />,
  <polygon key="2" points="22,2 15,22 11,13 2,9" />
]);

const CheckCircle = createIcon([
  <path key="1" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />,
  <polyline key="2" points="9,11 12,14 22,4" />
]);

const Mail = createIcon([
  <path key="1" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />,
  <polyline key="2" points="22,6 12,13 2,6" />
]);

const User = createIcon([
  <path key="1" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />,
  <circle key="2" cx="12" cy="7" r="4" />
]);

const MessageSquare = createIcon([
  <path key="1" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
]);

const Hash = createIcon([
  <line key="1" x1="4" y1="9" x2="20" y2="9" />,
  <line key="2" x1="4" y1="15" x2="20" y2="15" />,
  <line key="3" x1="10" y1="3" x2="8" y2="21" />,
  <line key="4" x1="16" y1="3" x2="14" y2="21" />
]);

// Optimized ModernButton with memoization
const ModernButton = ({ icon, label, className = "", onClick, href, disabled }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const buttonRef = useRef(null);

  const handleMouseMove = useCallback((event) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHoverOpacity(1), []);
  const handleMouseLeave = useCallback(() => setHoverOpacity(0), []);

  const handleClick = useCallback((e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (href) {
      e.preventDefault();
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (onClick) onClick(e);
  }, [disabled, href, onClick]);

  const gradientStyle = useMemo(() => ({
    opacity: hoverOpacity,
    background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #ffffff33, #00000026)`,
  }), [hoverOpacity, cursorPosition.x, cursorPosition.y]);

  const baseClasses = "relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm uppercase text-white border border-gray-800 font-body transition-all duration-300 hover:border-white/30";
  const buttonClasses = `${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const ButtonContent = () => (
    <>
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={gradientStyle}
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
        className={`${buttonClasses} bg-black`}
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
      disabled={disabled}
      className={`${buttonClasses} bg-black/20`}
    >
      <ButtonContent />
    </button>
  );
};

// Memoized Luxury Card Component
const LuxuryCard = ({ children, className = "" }) => (
  <div className={`relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-300/20 rounded-2xl backdrop-blur-sm shadow-2xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-2xl opacity-50" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Optimized InputField with better error handling
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
  const hasValue = Boolean(value);
  const hasError = Boolean(error);

  const containerClasses = useMemo(() => 
    `relative ${isTextarea ? 'h-auto' : 'h-12 sm:h-14 lg:h-16'} transition-all duration-500 hover:shadow-xl hover:border-white/30 ${hasError ? 'border-red-400/50' : ''}`
  , [isTextarea, hasError]);

  const iconClasses = useMemo(() => 
    `absolute left-3 sm:left-4 lg:left-5 ${isTextarea ? 'top-3 sm:top-4 lg:top-5' : 'top-1/2 -translate-y-1/2'} z-10 transition-all duration-300 ${hasValue ? 'text-white scale-110' : 'text-gray-400'}`
  , [isTextarea, hasValue]);

  const inputClasses = "relative w-full bg-transparent border-0 outline-none text-white placeholder-gray-500 pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 lg:pr-5 resize-none z-10 text-base sm:text-lg font-light tracking-wide";

  return (
    <div className="relative group">
      <LuxuryCard className={containerClasses}>
        <div className={iconClasses}>
          <Icon size={16} className="sm:w-5 sm:h-5" />
        </div>

        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`${inputClasses} pt-3 sm:pt-4 lg:pt-5 pb-3 sm:pb-4 lg:pb-5`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} py-3 sm:py-4 h-12 sm:h-14 lg:h-16`}
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
          {error}
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

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xovdzpnj";
  
  // Refs
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formContainerRef = useRef(null);
  const pulseRef = useRef(null);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.min(sectionHeight, windowHeight - rect.top);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    const progress = Math.min(Math.max(visibleHeight / windowHeight, 0), 1);
    setSectionProgress(progress);

    // Use requestAnimationFrame for smooth animations
    requestAnimationFrame(() => {
      const circleExpansionStart = 0.5;
      const circleExpansionEnd = 2;
      const formFadeStart = 0.7;

      if (progress >= circleExpansionStart && progress <= circleExpansionEnd) {
        const expansionProgress = (progress - circleExpansionStart) / (circleExpansionEnd - circleExpansionStart);
        const easeProgress = 1 - Math.pow(1 - expansionProgress, 4);

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const diagonal = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight);

        const startSize = 32;
        const maxScale = (diagonal * 1.5) / startSize;
        const currentScale = 1 + (maxScale * easeProgress);

        if (circleRef.current) {
          circleRef.current.style.transform = `scale(${currentScale})`;
          const fadeOutStart = 0.6;
          if (expansionProgress >= fadeOutStart) {
            const fadeProgress = (expansionProgress - fadeOutStart) / (1 - fadeOutStart);
            circleRef.current.style.opacity = Math.max(0, 1 - fadeProgress);
          } else {
            circleRef.current.style.opacity = '1';
          }
        }

        if (pulseRef.current) {
          pulseRef.current.style.opacity = Math.max(0, 1 - expansionProgress * 1.5);
        }
      } else if (progress < circleExpansionStart) {
        if (circleRef.current) {
          circleRef.current.style.transform = 'scale(1)';
          circleRef.current.style.opacity = '1';
        }
        if (pulseRef.current) {
          pulseRef.current.style.opacity = '1';
        }
      }

      // Optimize DOM updates
      if (titleRef.current) {
        const titleFadeStart = 0.2;
        const titleOpacity = progress <= titleFadeStart ? 1 : Math.max(0, 1 - ((progress - titleFadeStart) / 0.4));
        const titleScale = Math.max(0.9, 1 - progress * 0.2);
        titleRef.current.style.cssText = `opacity: ${titleOpacity}; transform: scale(${titleScale})`;
      }

      if (subtitleRef.current) {
        const subtitleFadeStart = 0.3;
        const subtitleOpacity = progress <= subtitleFadeStart ? 1 : Math.max(0, 1 - ((progress - subtitleFadeStart) / 0.3));
        subtitleRef.current.style.cssText = `opacity: ${subtitleOpacity}; transform: translateY(${progress * 20}px)`;
      }

      if (progress >= formFadeStart) {
        setShowForm(true);
        const formProgress = (progress - formFadeStart) / (1 - formFadeStart);
        const formOpacity = Math.min(1, formProgress * 1.5);
        const formTranslateY = Math.max(0, 50 - formProgress * 50);

        if (formContainerRef.current) {
          formContainerRef.current.style.cssText = `opacity: ${formOpacity}; transform: translateY(${formTranslateY}px); transition: opacity 1s ease-out, transform 1s ease-out; pointer-events: auto`;
        }
      } else {
        setShowForm(false);
        if (formContainerRef.current) {
          formContainerRef.current.style.cssText = 'opacity: 0; transform: translateY(50px); transition: opacity 1s ease-out, transform 1s ease-out; pointer-events: none';
        }
      }
    });
  }, []);

  // Throttled scroll event
  useEffect(() => {
    let ticking = false;
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [handleScroll]);

  const handleInputChange = useCallback((e) => {
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
  }, [errors]);

  const validateForm = useCallback(() => {
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
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

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
  }, [FORMSPREE_ENDPOINT, validateForm, formData]);

  const inlineStyles = useMemo(() => `
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
  `, []);

  return (
    <div>
      <style>{inlineStyles}</style>

      <section
        className="bg-black relative overflow-hidden min-h-screen py-8 sm:py-16 lg:py-20"
        ref={sectionRef}
      >
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4" id="contact">
          <div className="text-center relative">
            <div className="relative mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center">
              <div
                ref={pulseRef}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full z-20 transition-opacity duration-700"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              <div
                ref={circleRef}
                className="w-6 h-6 sm:w-8 sm:h-8 border border-white/60 rounded-full transition-all duration-1000 ease-out origin-center"
                style={{
                  willChange: 'transform, opacity'
                }}
              />
            </div>

            <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-thin tracking-widest text-white/90 transition-all duration-1000">
              CONTACT
            </h1>
            <p
              ref={subtitleRef}
              className="text-xs sm:text-sm tracking-wider mt-2 sm:mt-3 lg:mt-4 text-white/60 transition-all duration-1000 px-4"
            >
              Scroll to begin your journey
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div
          ref={formContainerRef}
          className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6 lg:px-8"
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            pointerEvents: showForm ? 'auto' : 'none'
          }}
        >
          <div className="w-full max-w-[1200px] pb-8 sm:pb-16 lg:pb-20">
            <div className="text-center mb-8 sm:mb-10 lg:mb-16 px-2 sm:px-4 mt-8 sm:mt-16 lg:mt-[15vh]">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[60px] font-bold text-white leading-tight">
                Let's Collaborate
              </h1>
              <p className="mt-4 sm:mt-6 lg:mt-10 font-body text-sm sm:text-base lg:text-[24px] text-white opacity-80 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-2">
                Exceptional projects begin with meaningful conversations. Share your vision, and let's create something extraordinary together.
              </p>
            </div>

            <LuxuryCard className="p-4 sm:p-6 md:p-8 lg:p-16 shadow-2xl mx-2 sm:mx-4 lg:mx-0 lg:mt-40">
              {isSubmitted ? (
                <div className="text-center py-8 sm:py-12 lg:py-20">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-10"
                    style={{
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-thin text-white mb-4 sm:mb-6 lg:mb-8 tracking-tight px-4">Message Delivered</h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xs sm:max-w-md mx-auto font-light px-4">
                    Your message has been received with care. Expect a thoughtful response within 24 hours.
                  </p>
                  <div className="mt-6 sm:mt-8 lg:mt-12 flex justify-center">
                    <LuxuryCard className="px-3 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4">
                      <span className="text-white/60 text-xs sm:text-sm font-light tracking-wide">Form will reset shortly...</span>
                    </LuxuryCard>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 lg:space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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

                  {errors.submit && (
                    <LuxuryCard className="p-3 sm:p-4 lg:p-6 border-red-400/30 bg-red-500/5">
                      <p className="text-red-300 text-xs sm:text-sm flex items-center font-light">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3" />
                        {errors.submit}
                      </p>
                    </LuxuryCard>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6">
                    <div className="flex items-center text-gray-400 text-xs sm:text-sm space-x-2 sm:space-x-3 font-light order-2 sm:order-1">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="tracking-wide">Response within 24 hours</span>
                    </div>

                    <div className="order-1 sm:order-2 w-full sm:w-auto">
                      <ModernButton
                        icon={isLoading ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        label={isLoading ? "Sending..." : "Send Message"}
                        onClick={handleSubmit}
                        disabled={isLoading || !FORMSPREE_ENDPOINT}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                      />
                    </div>
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