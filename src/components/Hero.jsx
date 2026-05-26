import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowDown,
  ArrowRight,
  MapPin,
  Play,
  PenTool,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Play,
    text: "Cinematic brand films and reels built to stop the scroll.",
  },
  {
    icon: PenTool,
    text: "Design, motion, and strategy — polished from concept to delivery.",
  },
  {
    icon: Users,
    text: "For ambitious brands, startups, and creative teams worldwide.",
  },
];

const Hero = () => {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-bg", { opacity: 0, scale: 1.04, duration: 1.2 })
        .from(".hero-badge", { opacity: 0, y: 16, duration: 0.6 }, "-=0.85")
        .from(".hero-line", { opacity: 0, y: 36, duration: 0.8, stagger: 0.1 }, "-=0.5")
        .from(".hero-bullet", { opacity: 0, x: -16, duration: 0.55, stagger: 0.1 }, "-=0.45")
        .from(".hero-cta", { opacity: 0, y: 18, duration: 0.55, stagger: 0.08 }, "-=0.35")
        .from(".hero-scroll", { opacity: 0, y: 10, duration: 0.5 }, "-=0.25");
    },
    { scope: heroRef }
  );

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-black"
    >
      {/* Full-bleed background */}
      <div className="hero-bg absolute inset-0">
        <video
          className="h-full w-full object-cover"
          src="videos/hero-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Content — left-aligned stack */}
      <div className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-sm sm:mb-8">
            <MapPin className="accent-icon h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 sm:text-xs">
              Creative studio · Available worldwide
            </span>
          </div>

          <h1 className="font-display text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold uppercase leading-[1.06] tracking-tight">
            <span className="hero-line text-gradient block">Creative content</span>
            <span className="hero-line block text-white">that wins attention</span>
            <span className="hero-line block text-white">and builds brands.</span>
          </h1>

          <ul className="mt-8 space-y-4 sm:mt-10">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="hero-bullet flex gap-3 sm:gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--brand-violet-soft)/0.35)] bg-black/40 backdrop-blur-sm sm:h-11 sm:w-11">
                  <Icon className="h-4 w-4 text-[rgb(var(--brand-violet-light))]" strokeWidth={1.75} />
                </span>
                <span className="pt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <a
              href="#services"
              className="hero-cta group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Our services
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#works"
              className="hero-cta inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-black/30 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/45"
            >
              <Play className="h-4 w-4 fill-white/80 text-white/80" />
              Watch the reel
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll relative z-[1] mx-auto flex w-full max-w-7xl items-end justify-between px-4 pb-8 sm:px-6 lg:px-8">
        <a
          href="#about"
          className="group hidden items-center gap-3 text-sm text-white/45 transition hover:text-white/70 sm:inline-flex"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm transition group-hover:border-white/30">
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </span>
          Scroll to explore
        </a>

        <div className="ml-auto flex items-center gap-3 text-xs text-white/40">
          <span className="hidden sm:inline">Design · Motion · Web</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
