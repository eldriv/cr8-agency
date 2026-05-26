import { useState } from "react";
import ServiceScene from "./ServiceScene";

const ServiceCard = ({ step, title, desc, id, compact = false }) => {
  const [hovered, setHovered] = useState(false);
  const padding = compact ? "p-5" : "p-6";

  return (
    <article
      tabIndex={0}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08080c] outline-none transition duration-500 hover:border-[#d4a853]/25 hover:shadow-[0_24px_70px_-30px_rgba(212,168,83,0.25)] focus-visible:ring-2 focus-visible:ring-[#d4a853]/30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className={`flex flex-1 flex-col ${padding}`}>
        <div
          className={`relative mb-5 w-full overflow-hidden ${
            compact ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[16/11]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,168,83,0.08),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />
          <ServiceScene id={id} active={hovered} />
        </div>

        <span className="mb-3 inline-flex w-fit rounded-full border border-[#d4a853]/25 bg-[#d4a853]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d4a853]">
          Service {step}
        </span>

        <h3
          className={`font-display font-semibold uppercase tracking-[0.04em] text-white ${
            compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/50">{desc}</p>
      </div>
    </article>
  );
};

export default ServiceCard;
