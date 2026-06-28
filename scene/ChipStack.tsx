import { motion, AnimatePresence } from "framer-motion";

export type ChipDenom = {
  value: number;
  color: string;
  edge: string;
  highlight: string;
  label: string;
  textColor: string;
};

/* Casino-realistic palette — no bright blue/green/purple */
const DENOMINATIONS: ChipDenom[] = [
  { value: 100, color: "#1a1a1a", edge: "#050505", highlight: "#3a3a3a", label: "100", textColor: "#f5c842" },
  { value: 50,  color: "#6e1414", edge: "#3a0606", highlight: "#9a2424", label: "50",  textColor: "#f5ecd6" },
  { value: 25,  color: "#2a4a30", edge: "#0f2418", highlight: "#3e6a48", label: "25",  textColor: "#f5ecd6" },
  { value: 10,  color: "#1f2a44", edge: "#0a1020", highlight: "#324166", label: "10",  textColor: "#f5ecd6" },
  { value: 5,   color: "#8b1a1a", edge: "#4a0808", highlight: "#b53030", label: "5",   textColor: "#f5ecd6" },
];

/** Break amount into realistic chip counts per denomination. */
export function breakIntoChips(amount: number): { denom: ChipDenom; count: number }[] {
  if (amount <= 0) return [];
  let remaining = amount;
  const result: { denom: ChipDenom; count: number }[] = [];

  for (const denom of DENOMINATIONS) {
    const count = Math.min(4, Math.floor(remaining / denom.value));
    if (count > 0) {
      result.push({ denom, count });
      remaining -= count * denom.value;
    }
  }

  if (remaining > 0 && result.length === 0) {
    result.push({ denom: DENOMINATIONS[DENOMINATIONS.length - 1], count: 1 });
  }

  return result.slice(0, 3);
}

type SingleChipProps = {
  denom: ChipDenom;
  stackIndex: number;
  pileOffset: number;
  size?: "sm" | "md";
};

function SingleChip({ denom, stackIndex, pileOffset, size = "md" }: SingleChipProps) {
  const chipSize = size === "sm" ? "clamp(14px, 2vw, 22px)" : "clamp(18px, 2.4vw, 30px)";

  return (
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.4, rotate: -25 }}
      animate={{
        y: -stackIndex * 3,
        x: pileOffset,
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      exit={{ y: 20, opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 380, damping: 26, delay: stackIndex * 0.03 }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
      style={{
        width: chipSize,
        height: chipSize,
        background: `radial-gradient(circle at 32% 28%, ${denom.highlight}, ${denom.color} 55%, ${denom.edge})`,
        border: "2px dashed rgba(245,235,210,0.42)",
        borderBottom: `3px solid ${denom.edge}`,
        boxShadow: `0 4px 10px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,240,200,0.35)`,
      }}
    >
      <div
        className="absolute inset-[3px] flex items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle at 38% 35%, ${denom.highlight}, ${denom.color} 65%, ${denom.edge})`,
          borderTop: "1px solid rgba(255,240,200,0.2)",
        }}
      >
        <span
          className="font-black"
          style={{ fontSize: "clamp(5px, 0.7vw, 8px)", color: denom.textColor, textShadow: "0 1px 2px rgba(0,0,0,0.85)" }}
        >
          {denom.label}
        </span>
      </div>
    </motion.div>
  );
}

type ChipStackProps = {
  amount: number;
  flat?: boolean;
  animateToPot?: boolean;
  size?: "sm" | "md";
};

export function ChipStack({ amount, flat = true, animateToPot = false, size = "md" }: ChipStackProps) {
  const piles = breakIntoChips(amount);
  if (amount <= 0) return null;

  const content = (
    <div
      className="relative flex items-end justify-center"
      style={{
        width: "clamp(36px, 5vw, 56px)",
        height: "clamp(28px, 4vw, 44px)",
        transform: flat ? "rotateX(0deg)" : undefined,
      }}
    >
      {piles.map(({ denom, count }, pileIdx) =>
        Array.from({ length: count }).map((_, stackIdx) => (
          <SingleChip
            key={`${denom.value}-${pileIdx}-${stackIdx}`}
            denom={denom}
            stackIndex={stackIdx}
            pileOffset={(pileIdx - (piles.length - 1) / 2) * 14}
            size={size}
          />
        )),
      )}
    </div>
  );

  if (animateToPot) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.3, x: 0, y: -40 }}
        transition={{ duration: 0.55, ease: "easeIn" }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div key={amount} layout>
        {content}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-0.5 text-center font-bold font-mono"
          style={{
            fontSize: "clamp(7px, 1vw, 10px)",
            color: "#f5c842",
            textShadow: "0 1px 4px rgba(0,0,0,0.95)",
          }}
        >
          ${amount.toLocaleString()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
