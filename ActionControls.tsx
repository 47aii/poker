import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";

type ActionControlsProps = {
  onAction: (action: string, amount?: number) => void;
  canCheck: boolean;
  callAmount: number;
  minRaise: number;
  maxRaise: number;
  raiseValue: number[];
  setRaiseValue: (val: number[]) => void;
};

/* Labels swapped to reference; factors map to maxRaise (no prop change). */
const QUICK_BETS = [
  { label: "2.5× POT", factor: 0.4 },
  { label: "3× POT", factor: 0.6 },
  { label: "4× POT", factor: 0.8 },
  { label: "ALL IN", factor: 1.0 },
];

const GOLD_GRAD =
  "linear-gradient(to bottom, #e6c052 0%, #c9a227 45%, #8b6914 100%)";
const GOLD_GRAD_HOVER =
  "linear-gradient(to bottom, #f2d06a 0%, #d4af37 45%, #9a7618 100%)";

export function ActionControls({
  onAction,
  canCheck,
  callAmount,
  minRaise,
  maxRaise,
  raiseValue,
  setRaiseValue,
}: ActionControlsProps) {
  const clamp = (v: number) =>
    Math.max(minRaise, Math.min(maxRaise, Math.round(v)));
  const isAllIn = raiseValue[0] >= maxRaise;

  const adjustRaise = (delta: number) =>
    setRaiseValue([clamp(raiseValue[0] + delta)]);

  return (
    <motion.div
      key="actions"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="w-full flex flex-col gap-3 px-3 py-2"
    >
      {/* ── 5 action buttons — FOLD / CHECK / CALL / RAISE / ALL IN ── */}
      <div className="grid grid-cols-5 gap-3">
        {/* FOLD — deep casino red */}
        <motion.button
          onClick={() => onAction("fold")}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          className="relative flex items-center justify-center rounded-xl font-black uppercase tracking-[0.18em] overflow-hidden group"
          style={{
            height: "clamp(54px,8.5vh,72px)",
            background:
              "linear-gradient(to bottom, #7a1212 0%, #4a0808 55%, #2a0404 100%)",
            border: "1px solid rgba(212,175,55,0.35)",
            borderBottom: "3px solid rgba(0,0,0,0.95)",
            color: "#f5ecd6",
            boxShadow:
              "0 10px 22px rgba(60,0,0,0.7), inset 0 1px 0 rgba(255,200,160,0.18)",
            fontSize: "clamp(11px,1.5vw,15px)",
            letterSpacing: "0.18em",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,220,180,0.1) 0%, transparent 60%)",
            }}
          />
          <span>FOLD</span>
        </motion.button>

        {/* CHECK — black glass */}
        <motion.button
          onClick={() => onAction("check")}
          disabled={!canCheck}
          whileHover={canCheck ? { scale: 1.03, y: -1 } : {}}
          whileTap={canCheck ? { scale: 0.97, y: 2 } : {}}
          className="relative flex items-center justify-center rounded-xl font-black uppercase tracking-[0.18em] overflow-hidden group backdrop-blur-md"
          style={{
            height: "clamp(54px,8.5vh,72px)",
            background: canCheck
              ? "linear-gradient(to bottom, rgba(28,22,14,0.95) 0%, rgba(10,7,4,0.98) 100%)"
              : "linear-gradient(to bottom, rgba(18,14,10,0.5) 0%, rgba(6,4,2,0.6) 100%)",
            border: `1px solid ${canCheck ? "rgba(212,175,55,0.45)" : "rgba(212,175,55,0.12)"}`,
            borderBottom: `3px solid rgba(0,0,0,0.95)`,
            color: canCheck ? "#f5ecd6" : "rgba(245,236,214,0.25)",
            boxShadow: canCheck
              ? "0 10px 22px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,220,140,0.08)"
              : "none",
            opacity: canCheck ? 1 : 0.45,
            cursor: canCheck ? "pointer" : "not-allowed",
            fontSize: "clamp(11px,1.5vw,15px)",
            letterSpacing: "0.18em",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,220,140,0.06) 0%, transparent 60%)",
            }}
          />
          <span>CHECK</span>
        </motion.button>

        {/* CALL — luxury gold */}
        <motion.button
          onClick={() => onAction("call")}
          whileHover={{ scale: 1.03, y: -1, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97, y: 2 }}
          className="relative flex items-center justify-center gap-1.5 rounded-xl font-black uppercase tracking-[0.18em] overflow-hidden group"
          style={{
            height: "clamp(54px,8.5vh,72px)",
            background: GOLD_GRAD,
            border: "1px solid rgba(255,240,180,0.55)",
            borderBottom: "3px solid rgba(40,28,8,0.95)",
            color: "#1a1006",
            boxShadow:
              "0 10px 22px rgba(140,100,15,0.5), 0 0 26px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,240,180,0.7)",
            fontSize: "clamp(11px,1.5vw,15px)",
            letterSpacing: "0.16em",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = GOLD_GRAD_HOVER)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = GOLD_GRAD)}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
            }}
          />
          <span>
            CALL{callAmount > 0 ? ` $${callAmount.toLocaleString()}` : ""}
          </span>
        </motion.button>

        {/* RAISE — luxury gold */}
        <motion.button
          onClick={() => !isAllIn && onAction("raise", raiseValue[0])}
          whileHover={!isAllIn ? { scale: 1.03, y: -1 } : {}}
          whileTap={!isAllIn ? { scale: 0.97, y: 2 } : {}}
          className="relative flex items-center justify-center rounded-xl font-black uppercase tracking-[0.18em] overflow-hidden group"
          style={{
            height: "clamp(54px,8.5vh,72px)",
            background: GOLD_GRAD,
            border: "1px solid rgba(255,240,180,0.55)",
            borderBottom: "3px solid rgba(40,28,8,0.95)",
            color: "#1a1006",
            boxShadow:
              "0 10px 22px rgba(140,100,15,0.5), 0 0 26px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,240,180,0.7)",
            fontSize: "clamp(11px,1.5vw,15px)",
            opacity: isAllIn ? 0.4 : 1,
            letterSpacing: "0.16em",
          }}
          onMouseEnter={(e) => {
            if (!isAllIn) e.currentTarget.style.background = GOLD_GRAD_HOVER;
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = GOLD_GRAD)}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
            }}
          />
          <span>RAISE</span>
        </motion.button>

        {/* ALL IN — dark red w/ gold border */}
        <motion.button
          onClick={() => onAction("allin", maxRaise)}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          className="relative flex items-center justify-center rounded-xl font-black uppercase tracking-[0.18em] overflow-hidden group"
          style={{
            height: "clamp(54px,8.5vh,72px)",
            background:
              "linear-gradient(to bottom, #6b1010 0%, #3e0606 55%, #1f0202 100%)",
            border: "1.5px solid rgba(212,175,55,0.75)",
            borderBottom: "3px solid rgba(0,0,0,0.95)",
            color: "#f5c842",
            boxShadow:
              "0 10px 22px rgba(60,0,0,0.7), 0 0 28px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,220,140,0.18)",
            fontSize: "clamp(11px,1.5vw,15px)",
            letterSpacing: "0.18em",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,220,140,0.14) 0%, transparent 60%)",
            }}
          />
          <span>ALL IN</span>
        </motion.button>
      </div>

      {/* ── Bet controls: two separate panels (input row + quick bets) ── */}
      <div className="flex items-stretch gap-3">
        {/* Left panel: minus / slider / amount / plus */}
        <div
          className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-md"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,10,6,0.92), rgba(6,4,2,0.96))",
            border: "1px solid rgba(212,175,55,0.32)",
            boxShadow:
              "0 10px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,220,140,0.06)",
          }}
        >
          {/* Minus */}
          <button
            onClick={() => adjustRaise(-Math.max(1, Math.floor(maxRaise / 20)))}
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:brightness-125 active:scale-90"
            style={{
              width: 32,
              height: 32,
              background:
                "linear-gradient(to bottom, rgba(40,28,10,0.9), rgba(12,8,3,0.95))",
              border: "1px solid rgba(212,175,55,0.45)",
              color: "#f5c842",
              boxShadow: "0 4px 10px rgba(0,0,0,0.65)",
            }}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Slider */}
          <Slider
            min={minRaise}
            max={maxRaise}
            step={Math.max(1, Math.floor(maxRaise / 100))}
            value={raiseValue}
            onValueChange={setRaiseValue}
            className="flex-1 cursor-pointer
              [&_[role=slider]]:h-5 [&_[role=slider]]:w-5
              [&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-yellow-200 [&_[role=slider]]:to-yellow-700
              [&_[role=slider]]:border-yellow-900
              [&_[role=slider]]:shadow-[0_0_14px_rgba(212,175,55,0.85)]
              [&_[data-orientation=horizontal]>span:first-child]:bg-gradient-to-r [&_[data-orientation=horizontal]>span:first-child]:from-yellow-700 [&_[data-orientation=horizontal]>span:first-child]:via-yellow-400 [&_[data-orientation=horizontal]>span:first-child]:to-yellow-700"
          />

          {/* Amount display */}
          <div className="flex-shrink-0 flex items-center gap-1 px-1.5">
            <input
              type="number"
              value={raiseValue[0]}
              onChange={(e) => setRaiseValue([clamp(Number(e.target.value))])}
              className="bg-transparent font-mono font-black outline-none text-right"
              style={{ color: "#f5c842", fontSize: 16, width: 96 }}
            />
          </div>

          {/* Plus */}
          <button
            onClick={() => adjustRaise(Math.max(1, Math.floor(maxRaise / 20)))}
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:brightness-125 active:scale-90"
            style={{
              width: 32,
              height: 32,
              background:
                "linear-gradient(to bottom, rgba(40,28,10,0.9), rgba(12,8,3,0.95))",
              border: "1px solid rgba(212,175,55,0.45)",
              color: "#f5c842",
              boxShadow: "0 4px 10px rgba(0,0,0,0.65)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right panel: quick bets, square segmented */}
        <div className="flex gap-1.5 flex-shrink-0">
          {QUICK_BETS.map((q) => (
            <button
              key={q.label}
              onClick={() => setRaiseValue([clamp(maxRaise * q.factor)])}
              className="px-3.5 rounded-lg font-black uppercase tracking-wider transition-all hover:brightness-125 active:scale-95"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(22,16,9,0.95), rgba(8,5,2,0.98))",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#f5c842",
                fontSize: "clamp(9px,1.1vw,11px)",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,220,140,0.05)",
                letterSpacing: "0.1em",
                minWidth: "clamp(58px,7vw,84px)",
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
