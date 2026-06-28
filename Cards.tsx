import { motion } from "framer-motion";

// ───────── Types ─────────
export type CardType = { rank: string; suit: string };

export type CardProps = {
  card: CardType;
  idx?: number;
  size?: "xs" | "sm" | "md" | "lg";
  isWinner?: boolean;
  hover?: boolean;
  animateFromDealer?: boolean;
};

// ───────── Suit Config ─────────
const SUIT_CONFIG: Record<
  string,
  { char: string; color: string; shadow: string }
> = {
  h: { char: "♥", color: "#c41e1e", shadow: "rgba(196,30,30,0.28)" },
  d: { char: "♦", color: "#c41e1e", shadow: "rgba(196,30,30,0.28)" },
  c: { char: "♣", color: "#0a0a0a", shadow: "rgba(0,0,0,0.55)" },
  s: { char: "♠", color: "#0a0a0a", shadow: "rgba(0,0,0,0.55)" },
};

// ───────── Size Maps ─────────
const DIMS = {
  xs: "w-[clamp(16px,2.5vw,30px)] aspect-[2.5/3.5]",
  sm: "w-[clamp(22px,3.5vw,42px)] aspect-[2.5/3.5]",
  md: "w-[clamp(36px,5.4vw,68px)] aspect-[2.5/3.5]",
  lg: "w-[clamp(50px,7.2vw,92px)] aspect-[2.5/3.5]",
};

const RANK_SZ = {
  xs: "text-[clamp(7px,1vw,10px)]",
  sm: "text-[clamp(8px,1.2vw,13px)]",
  md: "text-[clamp(12px,2vw,22px)]",
  lg: "text-[clamp(16px,2.7vw,28px)]",
};

const SUIT_SZ = {
  xs: "text-[clamp(8px,1.2vw,12px)]",
  sm: "text-[clamp(9px,1.5vw,15px)]",
  md: "text-[clamp(15px,2.4vw,24px)]",
  lg: "text-[clamp(20px,3.2vw,34px)]",
};

export function PlayingCard({
  card,
  idx = 0,
  size = "md",
  isWinner = false,
  hover = false,
  animateFromDealer = false,
}: CardProps) {
  const isHidden = card.rank === "?" || card.suit === "?";
  const suit = SUIT_CONFIG[card.suit] ?? {
    char: "?",
    color: "#888",
    shadow: "transparent",
  };
  const rank = card.rank === "T" ? "10" : card.rank;

  const initial = animateFromDealer
    ? { x: 0, y: -600, opacity: 0, scale: 0.1, rotateZ: -180, rotateY: 180 }
    : {
        rotateY: 90,
        y: -40,
        opacity: 0,
        scale: 0.6,
        rotateZ: idx % 2 === 0 ? -10 : 10,
      };

  const winnerStyle = isWinner
    ? "ring-2 ring-yellow-400 shadow-[0_0_30px_rgba(212,175,55,0.9),0_0_60px_rgba(212,175,55,0.4)]"
    : "";

  const cardStyle: React.CSSProperties = {
    boxShadow: isHidden
      ? "inset 0 0 20px rgba(0,0,0,0.85), 0 10px 25px rgba(0,0,0,0.9)"
      : `0 14px 38px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(212,175,55,0.3), inset 0 1px 2px rgba(255,255,255,0.55), ${suit.shadow} 0 0 18px`,
  };

  return (
    <motion.div
      key={`${card.rank}-${card.suit}-${idx}`}
      initial={initial}
      animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotateZ: 0, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20, transition: { duration: 0.2 } }}
      transition={{
        delay: idx * 0.09,
        type: "spring",
        stiffness: 200,
        damping: 22,
        mass: 0.7,
      }}
      className={`${DIMS[size]} rounded-[8px] flex-shrink-0 relative select-none transform-gpu will-change-transform
        ${hover ? "hover:-translate-y-5 hover:scale-110 cursor-pointer" : ""}
        transition-all duration-300 ${winnerStyle}`}
      style={{ ...cardStyle, transformStyle: "preserve-3d" }}
    >
      {isHidden ? (
        // Card back — deep red w/ gold lattice (matches SeatPod CardBack)
        <div
          className="absolute inset-0 rounded-[8px] overflow-hidden flex items-center justify-center"
          style={{
            background:
              "linear-gradient(145deg, #6b0f0f 0%, #8b1a1a 40%, #5a0808 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212,175,55,0.4) 8px, rgba(212,175,55,0.4) 9px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(212,175,55,0.4) 8px, rgba(212,175,55,0.4) 9px)",
            }}
          />
          <div
            className="absolute inset-[6%] rounded-[5px]"
            style={{ border: "1px solid rgba(212,175,55,0.4)" }}
          />
          <div
            className="relative flex items-center justify-center w-[35%] h-[35%] rounded-full"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.5)",
            }}
          >
            <span
              className="font-black"
              style={{
                fontSize: "clamp(8px,1.8cqw,14px)",
                letterSpacing: "0.05em",
                color: "rgba(245,200,66,0.85)",
              }}
            >
              RP
            </span>
          </div>
          <div
            className="absolute inset-0 rounded-[8px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,220,140,0.08) 0%, transparent 50%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </div>
      ) : (
        // Card face — premium white w/ subtle gold inner border
        <div
          className="absolute inset-0 rounded-[8px] overflow-hidden flex flex-col"
          style={{
            background:
              "linear-gradient(145deg, #ffffff 0%, #f6f4ef 60%, #ebe7df 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23000'/%3E%3C/svg%3E\")",
            }}
          />
          <div
            className="absolute inset-[2px] rounded-[6px] pointer-events-none"
            style={{ border: "1px solid rgba(212,175,55,0.18)" }}
          />
          <div
            className="absolute inset-0 rounded-[8px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, transparent 60%)",
            }}
          />
          {/* Top left rank+suit */}
          <div className="absolute top-[6%] left-[8%] flex flex-col items-start leading-none">
            <span
              className={`${RANK_SZ[size]} font-black leading-none tracking-tighter`}
              style={{ color: suit.color, fontFamily: "Georgia, serif" }}
            >
              {rank}
            </span>
            <span
              className={`${SUIT_SZ[size]} leading-none mt-[-10%]`}
              style={{ color: suit.color }}
            >
              {suit.char}
            </span>
          </div>
          {/* Center suit watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              color: suit.color,
              opacity: 0.085,
              fontSize: "clamp(28px,7cqw,68px)",
            }}
          >
            {suit.char}
          </div>
          {/* Bottom right (rotated 180°) */}
          <div className="absolute bottom-[6%] right-[8%] flex flex-col items-end leading-none rotate-180">
            <span
              className={`${RANK_SZ[size]} font-black leading-none tracking-tighter`}
              style={{ color: suit.color, fontFamily: "Georgia, serif" }}
            >
              {rank}
            </span>
            <span
              className={`${SUIT_SZ[size]} leading-none mt-[-10%]`}
              style={{ color: suit.color }}
            >
              {suit.char}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
