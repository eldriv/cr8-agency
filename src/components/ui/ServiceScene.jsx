const frame =
  "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#d4a853]/20 bg-[#0c0c12]";

const panel =
  "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#111118] p-3";

const gold = "text-[#d4a853]";
const goldBg = "bg-[#d4a853]";
const label = "text-[10px] uppercase tracking-[0.18em] text-white/40";

/** Graphic Design — brand canvas, swatches, typography */
const GraphicDesignScene = ({ active }) => (
  <div className={frame}>
    <div className={panel}>
      <div className="mb-2 flex items-center justify-between">
        <span className={label}>Brand canvas</span>
        <span className={`text-[10px] ${gold}`}>Logo · Type · Color</span>
      </div>
      <div className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-[#0a0a10]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:14px_14px]" />
        <div
          className={`relative z-[1] flex h-12 w-12 items-center justify-center rounded-xl border-2 transition duration-700 ${
            active ? "rotate-3 border-[#d4a853]/50 bg-[#d4a853]/10" : "border-violet-400/30 bg-violet-500/10"
          }`}
        >
          <span className={`text-xs font-bold ${gold}`}>CR8</span>
        </div>
      </div>
      <div className="mb-2 flex gap-1.5">
        {["#8b5cf6", "#67e8f9", "#d4a853", "#f472b6", "#fff"].map((color, i) => (
          <div
            key={color}
            className={`h-5 flex-1 rounded-md border transition duration-500 ${
              active && i === 2 ? "scale-105 border-white/40" : "border-white/[0.08]"
            }`}
            style={{ backgroundColor: color === "#fff" ? "rgba(255,255,255,0.15)" : color }}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        <div className={`h-2 rounded transition duration-500 ${active ? "w-full bg-white/25" : "w-4/5 bg-white/15"}`} />
        <div className={`h-1.5 rounded transition duration-700 ${active ? "w-3/5 bg-[#d4a853]/40" : "w-1/2 bg-white/10"}`} />
      </div>
    </div>
  </div>
);

/** Video Editing — NLE timeline with clips and playhead */
const VideoEditingScene = ({ active }) => (
  <div className={frame}>
    <div className={panel}>
      <div className="mb-2 flex items-center justify-between">
        <span className={label}>Timeline</span>
        <span className={`text-[10px] font-mono ${gold}`}>{active ? "00:01:24:08" : "00:00:00:00"}</span>
      </div>
      <div className="relative mb-2 h-14 overflow-hidden rounded-md border border-white/[0.06] bg-black/40">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border border-white/20 bg-white/5" />
        </div>
        <div
          className={`absolute bottom-0 left-0 top-0 w-0.5 ${goldBg} transition-all duration-1000 ease-out`}
          style={{ left: active ? "58%" : "18%" }}
        />
      </div>
      {["Video 1", "Audio", "Titles"].map((track, i) => (
        <div key={track} className="mb-1 flex items-center gap-2">
          <span className="w-10 shrink-0 text-[8px] text-white/30">{track}</span>
          <div className="relative h-4 flex-1 overflow-hidden rounded bg-white/[0.04]">
            <div
              className={`absolute inset-y-0 rounded transition-all duration-700 ${
                i === 0 ? `${goldBg} opacity-80` : i === 1 ? "bg-cyan-400/40" : "bg-violet-400/35"
              }`}
              style={{
                left: i === 0 ? "8%" : i === 1 ? "12%" : "20%",
                width: active ? (i === 0 ? "72%" : i === 1 ? "55%" : "40%") : "30%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Motion Graphics — keyframes + motion path */
const MotionGraphicsScene = ({ active }) => (
  <div className={frame}>
    <div className={panel}>
      <div className="mb-2 flex items-center justify-between">
        <span className={label}>Motion comp</span>
        <span className={`rounded border px-1.5 py-0.5 text-[8px] ${gold} border-[#d4a853]/30`}>
          60 fps
        </span>
      </div>
      <div className="relative mb-3 h-20 rounded-md border border-white/[0.06] bg-[#0a0a10]">
        <div className="absolute bottom-3 left-3 right-3 top-3 border-l border-b border-white/10" />
        {[
          [18, 75],
          [38, 45],
          [58, 55],
          [78, 28],
        ].map(([x, y], i) => (
          <div
            key={i}
            className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border transition duration-500 ${
              active ? "border-[#d4a853] bg-[#d4a853]/80" : "border-violet-400/50 bg-violet-400/60"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
        <div
          className={`absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)] transition-all duration-1000 ${
            active ? "left-[78%] top-[28%]" : "left-[18%] top-[75%]"
          }`}
        />
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-sm transition duration-300 ${
              active && (i === 3 || i === 7 || i === 10)
                ? "bg-[#d4a853]/70"
                : "bg-white/[0.06]"
            }`}
          />
        ))}
      </div>
      <p className={`mt-1.5 text-[9px] ${gold}`}>Position · Scale · Opacity keyframes</p>
    </div>
  </div>
);

/** 2D/3D Animation — rig layers + viewport */
const AnimationScene = ({ active }) => (
  <div className={frame}>
    <div className={`${panel} flex gap-2`}>
      <div className="flex w-[38%] flex-col gap-1.5">
        {[
          { label: "Background", on: false },
          { label: "Character rig", on: true },
          { label: "Camera", on: false },
        ].map(({ label, on }, i) => (
          <div
            key={label}
            className={`rounded-md border px-2 py-1.5 transition duration-500 ${
              active && on
                ? "border-[#d4a853]/40 bg-[#d4a853]/10"
                : "border-white/[0.06] bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-sm border ${
                  on ? "border-[#d4a853]/60 bg-[#d4a853]/40" : "border-white/20"
                }`}
              />
              <p className="text-[8px] text-white/50">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-md border border-white/[0.06] bg-[#0a0a10]">
        <span className="absolute left-1.5 top-1.5 text-[7px] text-white/25">3D viewport</span>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 rounded-lg bg-[#14141c] transition-all duration-700"
            style={{
              top: `${18 + i * 14}%`,
              width: `${68 - i * 8}%`,
              height: "18%",
              transform: active
                ? `translateX(calc(-50% + ${(i - 1) * 5}px)) translateY(${i * 2}px)`
                : `translateX(-50%) translateY(${i * 2}px)`,
              zIndex: i + 1,
              opacity: i === 1 ? 1 : 0.7,
            }}
          />
        ))}
        <div
          className={`absolute bottom-2 left-1/2 h-6 w-4 -translate-x-1/2 rounded-full border transition duration-700 ${
            active ? "border-[#d4a853]/40 bg-[#d4a853]/15" : "border-white/15 bg-white/5"
          }`}
        />
      </div>
    </div>
  </div>
);

/** Logo Animation — intro timeline + mark reveal */
const LogoAnimationScene = ({ active }) => (
  <div className={frame}>
    <div className={panel}>
      <div className="mb-2 flex items-center justify-between">
        <span className={label}>Logo intro</span>
        <span className={`text-[9px] ${gold}`}>0:03 loop</span>
      </div>
      <div className="relative mb-3 flex h-20 items-center justify-center rounded-md border border-white/[0.06] bg-[#0a0a10]">
        <div
          className={`absolute rounded-full border transition duration-1000 ${
            active ? "h-20 w-20 border-[#d4a853]/25 opacity-100" : "h-14 w-14 border-white/10 opacity-60"
          }`}
        />
        <div
          className={`relative z-[1] flex h-11 w-11 items-center justify-center rounded-xl border-2 transition duration-700 ${
            active ? "scale-110 border-[#d4a853]/60 bg-[#d4a853]/15" : "scale-100 border-violet-400/30 bg-violet-500/10"
          }`}
        >
          <span className="text-[10px] font-bold text-white">CR8</span>
        </div>
      </div>
      <div className="relative flex h-5 items-end gap-0.5">
        {["Scale", "Opacity", "Rotate"].map((track, ti) => (
          <div key={track} className="relative h-full flex-1 rounded-sm bg-white/[0.04]">
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                className={`absolute bottom-1 h-2 w-2 rounded-sm transition duration-500 ${
                  active && k === 1 ? goldBg : "bg-white/20"
                }`}
                style={{ left: `${20 + k * 28 + ti * 4}%` }}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[9px] text-white/35">Intro · Outro · Sting variants</p>
    </div>
  </div>
);

/** Web Development — browser + code editor */
const WebDevelopmentScene = ({ active }) => (
  <div className={frame}>
    <div className={`${panel} !p-0 overflow-hidden`}>
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-black/30 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-green-400/70" />
        <div className="ml-1 h-4 flex-1 rounded bg-white/[0.05] px-2 text-[8px] leading-4 text-white/35">
          cr8.agency
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/[0.04] p-px">
        <div className="space-y-1.5 bg-[#111118] p-2.5">
          <p className="text-[8px] text-white/30">index.html</p>
          {[
            { text: "<section>", color: "text-violet-300/70" },
            { text: "  <h1>CR8</h1>", color: "text-white/50" },
            { text: "  <Hero />", color: "text-cyan-300/60" },
            { text: "</section>", color: "text-violet-300/70" },
          ].map(({ text, color }, i) => (
            <p
              key={i}
              className={`font-mono text-[8px] transition duration-500 ${color} ${
                active && i === 2 ? "opacity-100" : "opacity-80"
              }`}
            >
              {text}
            </p>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center bg-[#0d0d12] p-2">
          <div
            className={`w-full rounded border p-2 transition duration-500 ${
              active ? "border-[#d4a853]/30 bg-[#d4a853]/5" : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="mb-1 h-1.5 w-3/4 rounded bg-white/20" />
            <div className="mb-1 h-1 w-1/2 rounded bg-[#d4a853]/40" />
            <div className="h-6 rounded bg-white/[0.04]" />
          </div>
          <span className={`mt-1.5 text-[8px] ${gold}`}>Live preview</span>
        </div>
      </div>
    </div>
  </div>
);

const scenes = {
  "graphic-design": GraphicDesignScene,
  "video-editing": VideoEditingScene,
  "motion-graphics": MotionGraphicsScene,
  animation: AnimationScene,
  "logo-animation": LogoAnimationScene,
  "web-development": WebDevelopmentScene,
};

const ServiceScene = ({ id, active }) => {
  const Scene = scenes[id];
  if (!Scene) return null;
  return <Scene active={active} />;
};

export default ServiceScene;
