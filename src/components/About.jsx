import { CheckCircle2, Compass, Sparkles, Layers } from "lucide-react";
import { Reveal, SectionBackdrop, SectionLabel } from "./ui/Reveal";

const highlights = [
  "Strategy-led creative direction",
  "Fast turnaround without sacrificing quality",
  "Cross-platform design and motion expertise",
  "Dedicated partner from concept to delivery",
];

const pillars = [
  {
    icon: Compass,
    title: "Creative direction",
    desc: "Clear concepts and visual systems aligned with your brand goals.",
  },
  {
    icon: Sparkles,
    title: "Motion & production",
    desc: "Polished video, animation, and assets built for every platform.",
  },
  {
    icon: Layers,
    title: "End-to-end delivery",
    desc: "One team from brief to final files, ready to launch.",
  },
];

const About = () => {
  return (
    <section id="about" className="relative overflow-hidden border-t border-white/10 bg-neutral-950 py-20 sm:py-28">
      <SectionBackdrop />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionLabel>About CR8</SectionLabel>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A studio built for brands that want to{" "}
              <span className="text-gradient">stand out.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">
              We combine design, motion, and production into one streamlined workflow.
              Whether you need a campaign film, a refreshed identity, or a digital launch,
              our team delivers work that feels intentional, polished, and ready to publish.
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((item, i) => (
                <Reveal key={item} delay={i * 60} as="li" className="flex items-start gap-3 text-sm text-white/75 sm:text-base">
                  <CheckCircle2 className="accent-icon mt-0.5 h-5 w-5 shrink-0" />
                  {item}
                </Reveal>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black glow-ring">
                <video
                  className="block h-auto w-full"
                  src="videos/hero-2.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  poster="img/thumbnail.png"
                />
              </div>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {pillars.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={160 + i * 80}>
                  <div className="glass-panel hover-lift h-full rounded-2xl p-4 sm:p-5">
                    <div className="accent-bg-muted accent-border-muted mb-3 flex h-9 w-9 items-center justify-center rounded-lg border">
                      <Icon className="accent-icon h-4 w-4" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-white sm:text-base">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
