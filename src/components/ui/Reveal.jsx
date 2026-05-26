import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export const Reveal = ({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  immediate = false,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={clsx("reveal", visible && "reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export const SectionLabel = ({ children }) => (
  <div className="mb-4 flex items-center gap-3">
    <span className="accent-line h-px w-8" />
    <p className="accent-text text-xs font-medium uppercase tracking-[0.25em]">{children}</p>
  </div>
);

export const SectionBackdrop = ({ className = "" }) => (
  <div
    className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}
    aria-hidden
  >
    <div className="absolute inset-0 bg-grid opacity-[0.35]" />
    <div className="accent-glow-violet absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full blur-[120px] animate-glow-drift" />
    <div className="accent-glow-cyan absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full blur-[100px] animate-glow-drift-reverse" />
  </div>
);
