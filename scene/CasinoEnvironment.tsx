export function CasinoEnvironment() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: "#050302" }}>
      <img
        src="/assets/bg.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        style={{ filter: "brightness(0.34) saturate(0.78) contrast(1.1)" }}
      />

      {/* Warm chandelier wash from above */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 88% 50% at 50% 6%, rgba(255,180,70,0.18) 0%, transparent 55%)",
        }}
      />

      {/* Very subtle side warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 30% 55% at 8% 50%, rgba(140,40,15,0.06) 0%, transparent 70%), radial-gradient(ellipse 30% 55% at 92% 50%, rgba(140,40,15,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Strong cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 68% at 50% 45%, transparent 22%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Floor reflection / fade to black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[42%]"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.98) 0%, transparent 100%)",
        }}
      />

      {/* Subtle film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
