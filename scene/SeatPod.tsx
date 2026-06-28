import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { PlayingCard } from "../Cards";
import type { SeatedPlayer } from "./types";

type SeatPodProps = {
  player: SeatedPlayer;
  isActive: boolean;
  isDealer: boolean;
  isSB: boolean;
  isBB: boolean;
  isHero: boolean;
  timer: number;
  isShowdown: boolean;
};

/* Card back — deep red w/ gold lattice (Royal Poker pattern) */
function CardBack({
  rotate = 0,
  translateX = 0,
  translateY = 0,
}: {
  rotate?: number;
  translateX?: number;
  translateY?: number;
}) {
  return (
    <div
      className="relative rounded-[6px] flex-shrink-0 overflow-hidden"
      style={{
        width: "clamp(28px,4.5vw,52px)",
        aspectRatio: "2.5/3.5",
        transform: `rotate(${rotate}deg) translateX(${translateX}px) translateY(${translateY}px)`,
        background:
          "linear-gradient(145deg, #6b0f0f 0%, #8b1a1a 40%, #5a0808 100%)",
        border: "1.5px solid rgba(212,175,55,0.6)",
        boxShadow:
          "0 6px 18px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,220,140,0.14)",
        transformOrigin: "bottom center",
      }}
    >
      {/* Diagonal lattice */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,transparent,transparent 5px,rgba(212,175,55,0.45) 5px,rgba(212,175,55,0.45) 6px),repeating-linear-gradient(-45deg,transparent,transparent 5px,rgba(212,175,55,0.45) 5px,rgba(212,175,55,0.45) 6px)",
        }}
      />
      {/* Inner border */}
      <div
        className="absolute inset-[8%] rounded-[4px]"
        style={{ border: "1px solid rgba(212,175,55,0.4)" }}
      />
      {/* Center RP emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "38%",
            height: "38%",
            background: "rgba(212,175,55,0.14)",
            border: "1px solid rgba(212,175,55,0.45)",
          }}
        >
          <span
            className="font-black"
            style={{
              fontSize: "clamp(6px,1vw,10px)",
              color: "rgba(245,200,66,0.85)",
            }}
          >
            RP
          </span>
        </div>
      </div>
      {/* Sheen */}
      <div
        className="absolute inset-0 rounded-[6px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,220,140,0.10) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

export function SeatPod({
  player,
  isActive,
  isDealer,
  isSB,
  isBB,
  isHero,
  timer,
  isShowdown,
}: SeatPodProps) {
  const folded = player.isFolded;
  const hasCards = player.cards.length > 0;
  const showFaceUp = !isHero && hasCards && !folded && isShowdown;
  const showHidden = !isHero && hasCards && !folded && !isShowdown;

  const ringColor = isActive
    ? "rgba(245,200,66,0.85)"
    : isHero
      ? "rgba(212,175,55,0.6)"
      : "rgba(212,175,55,0.32)";

  const avatarBorder = isActive
    ? "#f5c842"
    : isHero
      ? "#d4af37"
      : "rgba(212,175,55,0.5)";

  return (
    <div
      className={`absolute transition-all duration-500 ${folded ? "opacity-30 grayscale pointer-events-none" : ""}`}
      style={{
        left: `${player.seatX}%`,
        top: `${player.seatY}%`,
        transform: "translate(-50%, -50%)",
        zIndex: player.zIndex,
      }}
    >
      {/* Action label */}
      <AnimatePresence>
        {player.action && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-2.5 py-0.5 font-bold uppercase whitespace-nowrap"
            style={{
              fontSize: "clamp(7px,1vw,10px)",
              background: "rgba(10,5,0,0.95)",
              border: "1px solid rgba(212,175,55,0.35)",
              color: player.action === "fold" ? "#d97373" : "#f5c842",
              boxShadow: "0 4px 14px rgba(0,0,0,0.85)",
            }}
          >
            {player.action}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pod row: avatar (left) + horizontal capsule (name/stack), with cards floating above-right */}
      <div
        className="relative flex items-center"
        style={{ gap: "clamp(6px,0.8vw,10px)" }}
      >
        {/* Avatar with gold ring */}
        <div className="relative flex-shrink-0">
          {/* Hero & active outer gold halo (ring around avatar only) */}
          {(isActive || isHero) && (
            <div
              className={isActive ? "" : "scene-hero-glow"}
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "9999px",
                border: `2px solid ${isActive ? "#f5c842" : "rgba(212,175,55,0.7)"}`,
                boxShadow: isActive
                  ? "0 0 22px rgba(245,200,66,0.85), 0 0 44px rgba(212,175,55,0.35)"
                  : "0 0 14px rgba(212,175,55,0.55), 0 0 28px rgba(212,175,55,0.22)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Avatar circle */}
          <div
            className="overflow-hidden rounded-full relative"
            style={{
              width: "clamp(44px,5.8vw,68px)",
              height: "clamp(44px,5.8vw,68px)",
              border: `2px solid ${avatarBorder}`,
              boxShadow: isActive
                ? "0 0 18px rgba(212,175,55,0.9), 0 6px 18px rgba(0,0,0,0.85)"
                : "0 6px 18px rgba(0,0,0,0.9)",
              background: "#0a0604",
            }}
          >
            <img
              src={
                player.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(player.displayName)}`
              }
              alt={player.displayName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Dealer badge — gold disc, bottom-right of avatar */}
          {isDealer && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-30 flex items-center justify-center rounded-full font-black"
              style={{
                bottom: "-4px",
                right: "-4px",
                width: "clamp(16px,2.1vw,22px)",
                height: "clamp(16px,2.1vw,22px)",
                background:
                  "radial-gradient(circle at 32% 28%, #ffe28a, #c9a227 60%, #8b6914)",
                border: "1.5px solid #2a1d08",
                fontSize: "clamp(7px,0.9vw,10px)",
                color: "#1a1006",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,240,180,0.6)",
              }}
            >
              D
            </motion.div>
          )}

          {/* SB / BB — small badge bottom-left of avatar (reference shows these as small gold discs near avatar) */}
          {isSB && !isDealer && (
            <div
              className="absolute z-30 flex items-center justify-center rounded-full font-black"
              style={{
                bottom: "-4px",
                left: "-4px",
                width: "clamp(15px,2vw,20px)",
                height: "clamp(15px,2vw,20px)",
                background:
                  "radial-gradient(circle at 32% 28%, #c9a227, #6b4e1b 65%, #3e2c0c)",
                border: "1.5px solid #2a1d08",
                fontSize: "clamp(5px,0.7vw,7px)",
                color: "#fff8d8",
                boxShadow: "0 3px 8px rgba(0,0,0,0.85)",
              }}
            >
              SB
            </div>
          )}
          {isBB && !isDealer && (
            <div
              className="absolute z-30 flex items-center justify-center rounded-full font-black"
              style={{
                bottom: "-4px",
                left: "-4px",
                width: "clamp(15px,2vw,20px)",
                height: "clamp(15px,2vw,20px)",
                background:
                  "radial-gradient(circle at 32% 28%, #ffe28a, #d4af37 60%, #8b6914)",
                border: "1.5px solid #2a1d08",
                fontSize: "clamp(5px,0.7vw,7px)",
                color: "#1a1006",
                boxShadow: "0 3px 8px rgba(0,0,0,0.85)",
              }}
            >
              BB
            </div>
          )}

          {/* Online dot */}
          <div
            className="absolute rounded-full"
            style={{
              top: "4%",
              right: "4%",
              width: "clamp(7px,1vw,10px)",
              height: "clamp(7px,1vw,10px)",
              background: "#4a8a3e",
              border: "2px solid #050302",
              boxShadow: "0 0 6px rgba(74,138,62,0.8)",
            }}
          />
        </div>

        {/* Name / Stack capsule */}
        <div
          className="relative rounded-full"
          style={{
            padding:
              "clamp(4px,0.55vw,7px) clamp(12px,1.7vw,20px) clamp(4px,0.55vw,7px) clamp(10px,1.4vw,16px)",
            background:
              "linear-gradient(to bottom, rgba(22,14,6,0.97) 0%, rgba(8,4,1,0.99) 100%)",
            border: `1px solid ${isActive ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.32)"}`,
            boxShadow:
              "0 8px 22px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,220,140,0.06)",
            minWidth: "clamp(86px,11vw,140px)",
            lineHeight: 1.05,
          }}
        >
          <div
            className="truncate font-bold tracking-wide"
            style={{ fontSize: "clamp(9px,1.15vw,13px)", color: "#f5ecd6" }}
          >
            {player.displayName}
          </div>
          <div
            className="font-black font-mono"
            style={{
              fontSize: "clamp(10px,1.35vw,15px)",
              color: "#f5c842",
              marginTop: 2,
            }}
          >
            ${player.chipStack.toLocaleString()}
          </div>
        </div>

        {/* Cards floating ABOVE-RIGHT, overlapping the capsule top */}
        {(showHidden || showFaceUp || (!hasCards && !isHero)) && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: "55%",
              top: "-58%",
              width: "clamp(60px,8vw,92px)",
              height: "clamp(54px,7.2vw,82px)",
            }}
          >
            {!hasCards && !isHero && (
              <>
                <div
                  className="absolute rounded-[6px]"
                  style={{
                    width: "clamp(26px,3.6vw,44px)",
                    aspectRatio: "2.5/3.5",
                    background: "rgba(255,220,140,0.025)",
                    border: "1.5px dashed rgba(212,175,55,0.18)",
                    left: 0,
                    top: "10%",
                    transform: "rotate(-10deg)",
                  }}
                />
                <div
                  className="absolute rounded-[6px]"
                  style={{
                    width: "clamp(26px,3.6vw,44px)",
                    aspectRatio: "2.5/3.5",
                    background: "rgba(255,220,140,0.025)",
                    border: "1.5px dashed rgba(212,175,55,0.18)",
                    left: "32%",
                    top: 0,
                    transform: "rotate(8deg)",
                  }}
                />
              </>
            )}
            {showHidden && (
              <>
                <div
                  className="absolute"
                  style={{ left: 0, top: "10%", zIndex: 1 }}
                >
                  <CardBack rotate={-10} />
                </div>
                <div
                  className="absolute"
                  style={{ left: "32%", top: 0, zIndex: 2 }}
                >
                  <CardBack rotate={8} />
                </div>
              </>
            )}
            {showFaceUp &&
              player.cards.map((c, ci) => (
                <div
                  key={ci}
                  className="absolute"
                  style={{
                    left: ci === 0 ? 0 : "32%",
                    top: ci === 0 ? "10%" : 0,
                    zIndex: ci + 1,
                    transform: `rotate(${ci === 0 ? -10 : 8}deg)`,
                  }}
                >
                  <PlayingCard
                    card={c}
                    idx={ci}
                    size="xs"
                    isWinner={isShowdown}
                    animateFromDealer
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Turn timer — below pod, centered */}
      {isActive && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="absolute left-1/2 -translate-x-1/2 mt-1 flex items-center gap-1 rounded-full px-2.5 py-0.5"
          style={{
            top: "100%",
            background: "linear-gradient(to bottom,#1a1208,#080503)",
            border: `1px solid ${timer <= 5 ? "#9a2020" : "#d4af37"}`,
            fontSize: "clamp(8px,1vw,11px)",
            color: timer <= 5 ? "#d97373" : "#f5ecd6",
            boxShadow: "0 4px 12px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
          }}
        >
          <Clock
            className="h-2.5 w-2.5"
            style={{ color: timer <= 5 ? "#d97373" : "#f5c842" }}
          />
          {timer}s
        </motion.div>
      )}
    </div>
  );
}
