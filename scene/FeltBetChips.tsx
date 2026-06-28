import { AnimatePresence } from "framer-motion";
import { ChipStack } from "./ChipStack";
import type { SeatedPlayer } from "./types";

type FeltBetChipsProps = {
  players: SeatedPlayer[];
};

/** Bet chips rendered flat on the felt, adjacent to each player's seat arc. */
export function FeltBetChips({ players }: FeltBetChipsProps) {
  return (
    <>
      {players.map((player) => (
        <AnimatePresence key={player.userId}>
          {player.currentBet > 0 && !player.isFolded && (
            <div
              className="absolute"
              style={{
                left: `${player.betX}%`,
                top: `${player.betY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: Math.round(player.betY),
              }}
            >
              <ChipStack amount={player.currentBet} flat size="md" />
            </div>
          )}
        </AnimatePresence>
      ))}
    </>
  );
}
