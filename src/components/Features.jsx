import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { services } from "../data/services";
import ServiceCard from "./ui/ServiceCard";
import { Reveal, SectionBackdrop, SectionLabel } from "./ui/Reveal";

const works = [
  { id: 1, label: "Brand Film", video: "videos/hero-4.mp4", thumbnail: "img/thumbnail-1.png" },
  { id: 2, label: "Product Launch", video: "videos/hero-5.mp4", thumbnail: "img/thumbnail-2.png" },
  { id: 3, label: "Social Campaign", video: "videos/hero-6.mp4", thumbnail: "img/thumbnail-3.png" },
  { id: 4, label: "Event Highlight", video: "videos/hero-7.mp4", thumbnail: "img/thumbnail-4.png" },
  { id: 5, label: "Brand Identity", video: "videos/hero-8.mp4", thumbnail: "img/thumbnail-5.png" },
];

const WorkCard = ({ work, index, total, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(work)}
    className="group relative w-full shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-black transition duration-500 hover:accent-border hover:shadow-[0_0_50px_-20px_rgb(var(--brand-violet)/0.35)]"
  >
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full min-h-full min-w-full scale-[1.2] object-cover object-center transition duration-700 group-hover:scale-[1.28]"
        src={work.video}
        muted
        loop
        playsInline
        preload="metadata"
        poster={work.thumbnail}
        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
        onMouseLeave={(e) => {
          e.currentTarget.pause();
          e.currentTarget.currentTime = 0;
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  </button>
);

const WorksCarousel = ({ items, onSelect }) => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll("[data-reel-card]");
    if (!cards.length) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });

    setActiveIndex(closest);
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    track.addEventListener("scrollend", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      track.removeEventListener("scrollend", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, items.length]);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll("[data-reel-card]");
    const target = cards[index];
    if (!target) return;

    setActiveIndex(index);
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const scrollByOne = (direction) => {
    const next = Math.min(Math.max(activeIndex + direction, 0), items.length - 1);
    scrollToIndex(next);
  };

  return (
    <div className="relative">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="accent-bg-muted accent-border accent-text rounded-full border px-3 py-1 text-xs font-medium">
            {items.length} reels
          </span>
          <span className="text-sm text-white/45">Swipe or use arrows to explore</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByOne(-1)}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous reel"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByOne(1)}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next reel"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 pt-1 snap-x snap-mandatory scrollbar-thin sm:-mx-6 sm:gap-5 sm:px-6 lg:gap-6"
      >
          {items.map((work, i) => (
            <div
              key={work.id}
              data-reel-card
              className={`w-[min(260px,72vw)] shrink-0 snap-center transition duration-300 sm:w-[280px] md:w-[300px] ${
                i === activeIndex ? "scale-100 opacity-100" : "scale-[0.97] opacity-80"
              }`}
            >
              <WorkCard work={work} index={i} total={items.length} onSelect={onSelect} />
            </div>
          ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((work, i) => (
          <button
            key={work.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to reel ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
            className={`h-2 shrink-0 rounded-full outline-none transition-all duration-300 focus:outline-none focus-visible:outline-none ${
              i === activeIndex
                ? "accent-dot-active w-8"
                : "w-2 bg-white/25 hover:bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const VideoModal = ({ work, onClose }) => {
  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[min(420px,92vw)] overflow-hidden rounded-3xl border border-white/15 bg-black glow-ring"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          Close
        </button>
        <div className="relative aspect-[9/16] max-h-[85vh] w-full overflow-hidden bg-black">
          <video
            className="absolute inset-0 h-full w-full min-h-full min-w-full scale-[1.1] object-cover object-center"
            src={work.video}
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const [selectedWork, setSelectedWork] = useState(null);
  const workItems = useMemo(() => works, []);

  return (
    <>
      <section id="services" className="relative overflow-hidden border-t border-white/10 bg-black py-20 sm:py-28">
        <SectionBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <SectionLabel>Services</SectionLabel>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Clear offerings. <span className="text-gradient">Premium execution.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              Pick a single service or bring us in as your full creative partner. Every engagement
              is scoped with clarity and delivered with studio-level attention to detail.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 70}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="relative overflow-hidden border-t border-white/10 bg-neutral-950 py-20 sm:py-28">
        <SectionBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Selected Work</SectionLabel>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Recent <span className="text-gradient">projects</span>
              </h2>
            </div>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 transition accent-text-hover"
            >
              Start your project
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={80}>
            <WorksCarousel items={workItems} onSelect={setSelectedWork} />
          </Reveal>
        </div>
      </section>

      <VideoModal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </>
  );
};

export default Features;
