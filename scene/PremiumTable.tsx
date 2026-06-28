import type { ReactNode } from "react";

/**
 * SVG poker table — correct layer order, no filter bleed.
 *
 * WHY the previous version showed white:
 *   feDiffuseLighting produces alpha=1 everywhere in the filter region.
 *   feComposite operator="multiply" in SVG is NOT a simple per-channel multiply;
 *   its alpha formula propagates the opaque lighting result *outside* the source
 *   shape → white rectangle covers the table.
 *
 * FIX: textures use a two-step pipeline:
 *   1. feTurbulence  →  feColorMatrix (produce a dark, low-alpha noise)
 *   2. feComposite in2="SourceGraphic" operator="in"  (clip to source shape)
 *   3. feBlend mode="overlay"  (blend onto source — shape-safe)
 *
 * ViewBox "0 0 1000 470"  matches CSS 78vw × (78vw × 0.47) = 2.128:1
 *
 * Layers (back → front):
 *   clip/leather  rx=460 ry=195  cx=500 cy=235   margins ≥40 px from SVG edge
 *   gold ring     rx=384 ry=161
 *   bevel         rx=367 ry=146
 *   felt          rx=358 ry=137
 *
 * feltContent inset  left/right 14%   top/bottom 21%
 */

type PremiumTableProps = {
  children?: ReactNode;
  feltContent?: ReactNode;
};

export function PremiumTable({ children, feltContent }: PremiumTableProps) {
  return (
    <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>

      {/* SVG — NO overflow:visible, NO global bleed */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 470"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>

          {/* ── Clip: enforces oval boundary for every layer ── */}
          <clipPath id="pt-clip">
            <ellipse cx="500" cy="235" rx="463" ry="198"/>
          </clipPath>

          {/* ────────────────────────────────────────────────────
              LEATHER GRAIN FILTER
              Safe pipeline: noise → dark alpha-mask →
                clip to source ("in") → overlay blend.
              The "in" composite GUARANTEES output is zero
              wherever SourceGraphic alpha = 0.
          ──────────────────────────────────────────────────── */}
          <filter id="pt-lf" colorInterpolationFilters="sRGB"
            x="0%" y="0%" width="100%" height="100%">
            {/* Step 1: generate fractal noise */}
            <feTurbulence type="fractalNoise"
              baseFrequency="0.65 0.45" numOctaves="4"
              seed="7" stitchTiles="stitch" result="noise"/>
            {/* Step 2: make a dark semi-transparent noise layer
                A = 0.22·R + 0.22·G + 0.22·B (noise luminance → alpha)
                RGB stays zero so the blend adds dark variation only */}
            <feColorMatrix type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.22 0.22 0.22 0 0"
              in="noise" result="dark-noise"/>
            {/* Step 3: CLIP to source shape — nothing escapes the ellipse */}
            <feComposite in="dark-noise" in2="SourceGraphic"
              operator="in" result="clipped-noise"/>
            {/* Step 4: overlay blend — adds grain without blowing out */}
            <feBlend in="SourceGraphic" in2="clipped-noise"
              mode="overlay"/>
          </filter>

          {/* ────────────────────────────────────────────────────
              VELVET FELT FILTER
              Same safe pipeline, higher frequency for finer fiber.
          ──────────────────────────────────────────────────── */}
          <filter id="pt-ff" colorInterpolationFilters="sRGB"
            x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise"
              baseFrequency="0.95 1.1" numOctaves="3"
              seed="14" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.18 0.18 0.18 0 0"
              in="noise" result="dark-noise"/>
            <feComposite in="dark-noise" in2="SourceGraphic"
              operator="in" result="clipped-noise"/>
            <feBlend in="SourceGraphic" in2="clipped-noise"
              mode="overlay"/>
          </filter>

          {/* Small blur for the felt inner-rim shadow */}
          <filter id="pt-blur4"
            x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>

          {/* ── GRADIENTS ── */}

          {/* Leather: warm dark, lighter at top-centre (overhead light) */}
          <radialGradient id="pt-lrg" cx="50%" cy="18%" r="82%"
            gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#2e2318"/>
            <stop offset="25%"  stopColor="#1e1812"/>
            <stop offset="55%"  stopColor="#12100b"/>
            <stop offset="82%"  stopColor="#090706"/>
            <stop offset="100%" stopColor="#050403"/>
          </radialGradient>

          {/* Gold trim: brushed metal — no glow, no shine towards edges */}
          <linearGradient id="pt-glg" x1="0.02" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3600"/>
            <stop offset="10%"  stopColor="#866004"/>
            <stop offset="22%"  stopColor="#b07c0c"/>
            <stop offset="34%"  stopColor="#cc9818"/>
            <stop offset="46%"  stopColor="#e0aa20"/>
            <stop offset="56%"  stopColor="#cc9412"/>
            <stop offset="68%"  stopColor="#9e7606"/>
            <stop offset="80%"  stopColor="#745400"/>
            <stop offset="91%"  stopColor="#a47a0a"/>
            <stop offset="100%" stopColor="#5e4600"/>
          </linearGradient>

          {/* Inner bevel: dark transition gold→felt */}
          <radialGradient id="pt-brg" cx="50%" cy="28%" r="72%">
            <stop offset="0%"   stopColor="#1e1600"/>
            <stop offset="55%"  stopColor="#0e0a00"/>
            <stop offset="100%" stopColor="#030200"/>
          </radialGradient>

          {/* Felt: deep casino crimson — centre brighter, edges very dark */}
          <radialGradient id="pt-frg" cx="50%" cy="38%" r="62%"
            gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7e0808"/>
            <stop offset="22%"  stopColor="#640404"/>
            <stop offset="50%"  stopColor="#400202"/>
            <stop offset="74%"  stopColor="#240101"/>
            <stop offset="100%" stopColor="#110000"/>
          </radialGradient>

          {/* Felt vignette: transparent centre → very dark edges */}
          <radialGradient id="pt-fvg" cx="50%" cy="40%" r="58%"
            gradientUnits="objectBoundingBox">
            <stop offset="45%"  stopColor="rgba(0,0,0,0)"/>
            <stop offset="68%"  stopColor="rgba(0,0,0,0.28)"/>
            <stop offset="84%"  stopColor="rgba(0,0,0,0.60)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.80)"/>
          </radialGradient>

          {/* Felt warm lamp: barely perceptible centre highlight */}
          <radialGradient id="pt-flg" cx="50%" cy="40%" r="38%"
            gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="rgba(255,180,75,0.06)"/>
            <stop offset="100%" stopColor="rgba(255,180,75,0)"/>
          </radialGradient>

          {/* Rail specular stroke: bright top only */}
          <linearGradient id="pt-rsg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,215,130,0.24)"/>
            <stop offset="14%"  stopColor="rgba(255,215,130,0.09)"/>
            <stop offset="38%"  stopColor="rgba(255,215,130,0.02)"/>
            <stop offset="100%" stopColor="rgba(255,215,130,0)"/>
          </linearGradient>

          {/* Gold glint stroke: bright top only */}
          <linearGradient id="pt-gsg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,248,175,0.65)"/>
            <stop offset="15%"  stopColor="rgba(255,248,175,0.22)"/>
            <stop offset="40%"  stopColor="rgba(255,248,175,0.04)"/>
            <stop offset="100%" stopColor="rgba(255,248,175,0)"/>
          </linearGradient>

        </defs>

        {/* ══════════════════════════════════════════════════
            All layers inside the oval clip path.
            ClipPath id="pt-clip" prevents ANYTHING from
            painting outside the leather/table boundary.
        ══════════════════════════════════════════════════ */}
        <g clipPath="url(#pt-clip)">

          {/* ── Layer 1: BLACK LEATHER RAIL ── */}
          {/* This fills the entire clip area (rx=460).
              Gold and felt layers stack on top — they're
              smaller ellipses, so leather is only visible
              as the outer ring (the rail). */}
          <ellipse cx="500" cy="235" rx="460" ry="195"
            fill="url(#pt-lrg)"
            filter="url(#pt-lf)"/>

          {/* ── Layer 2: METALLIC GOLD TRIM ── */}
          {/* Leather ring visible = 460-384 = 76px wide */}
          <ellipse cx="500" cy="235" rx="384" ry="161"
            fill="url(#pt-glg)"/>

          {/* ── Layer 3: DARK INNER BEVEL ── */}
          {/* Gold ring visible = 384-367 = 17px wide */}
          <ellipse cx="500" cy="235" rx="367" ry="146"
            fill="url(#pt-brg)"/>

          {/* ── Layer 4: RED VELVET FELT ── */}
          {/* Bevel visible = 367-358 = 9px wide */}
          <ellipse cx="500" cy="235" rx="358" ry="137"
            fill="url(#pt-frg)"
            filter="url(#pt-ff)"/>

          {/* Felt vignette: darkens felt edges against the rail */}
          <ellipse cx="500" cy="235" rx="358" ry="137"
            fill="url(#pt-fvg)"/>

          {/* Felt centre lamp warmth */}
          <ellipse cx="500" cy="235" rx="358" ry="137"
            fill="url(#pt-flg)"/>

          {/* Felt inner-rim shadow — felt recesses below gold */}
          <ellipse cx="500" cy="235" rx="358" ry="137"
            fill="none"
            stroke="rgba(0,0,0,0.80)"
            strokeWidth="18"
            filter="url(#pt-blur4)"/>

          {/* ── Layer 5: LEATHER STITCHING ── */}
          {/* At midpoint of leather ring: rx≈422, ry≈178 */}

          {/* Shadow stitch */}
          <ellipse cx="500" cy="236" rx="422" ry="178"
            fill="none"
            stroke="rgba(0,0,0,0.58)"
            strokeWidth="2.5"
            strokeDasharray="10 13"
            strokeLinecap="round"/>
          {/* Thread highlight */}
          <ellipse cx="500" cy="234.5" rx="422" ry="178"
            fill="none"
            stroke="rgba(170,118,48,0.26)"
            strokeWidth="1.8"
            strokeDasharray="10 13"
            strokeDashoffset="2"
            strokeLinecap="round"/>

          {/* Inner stitch row */}
          <ellipse cx="500" cy="236" rx="415" ry="171"
            fill="none"
            stroke="rgba(0,0,0,0.36)"
            strokeWidth="1.6"
            strokeDasharray="7 16"
            strokeDashoffset="6"
            strokeLinecap="round"/>
          <ellipse cx="500" cy="234.5" rx="415" ry="171"
            fill="none"
            stroke="rgba(148,100,34,0.18)"
            strokeWidth="1.1"
            strokeDasharray="7 16"
            strokeDashoffset="7.5"
            strokeLinecap="round"/>

          {/* ── Layer 6: RAIL SPECULAR (catches overhead light) ── */}
          <ellipse cx="500" cy="235" rx="460" ry="195"
            fill="none"
            stroke="url(#pt-rsg)"
            strokeWidth="5"/>

          {/* ── Layer 7: GOLD GLINT (top edge only) ── */}
          <ellipse cx="500" cy="235" rx="384" ry="161"
            fill="none"
            stroke="url(#pt-gsg)"
            strokeWidth="2.5"/>

        </g>{/* end clipPath group */}

      </svg>

      {/* ── Felt content (pot / community cards / bet chips) ──
          Mathematically derived from the felt ellipse:
            horizontal : (500 – 358) / 1000 = 14.2%  → 14%
            vertical   : (235 – 137) / 470  = 20.9%  → 21%
      */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "21%",
          left: "14%",
          right: "14%",
          bottom: "21%",
          transformStyle: "preserve-3d",
        }}
      >
        {feltContent}
      </div>

      {children}
    </div>
  );
}
