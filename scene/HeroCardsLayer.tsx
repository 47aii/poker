import { motion, AnimatePresence } from "framer-motion";
import { PlayingCard, type CardType } from "../Cards";

type HeroCardsLayerProps = {
  cards: CardType[];
  isShowdown: boolean;
  isDealing: boolean;
  visible: boolean;
};

export function HeroCardsLayer({ cards, isShowdown, isDealing, visible }: HeroCardsLayerProps) {
  if (!visible || cards.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="poker-scene__hero flex items-end justify-center"
        style={{ gap: 0 }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={`hero-${i}`}
            initial={{ rotate: i === 0 ? -8 : 8, y: 20 }}
            animate={{ rotate: i === 0 ? -4 : 4, y: 0 }}
            whileHover={{
              y: -14,
              rotate: i === 0 ? -2 : 2,
              scale: 1.06,
              zIndex: 10,
            }}
            style={{
              marginLeft: i > 0 ? "clamp(-14px, -1.8vw, -6px)" : 0,
              zIndex: i,
              filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.85))",
            }}
          >
            <PlayingCard
              card={card}
              idx={i}
              size="md"
              isWinner={isShowdown}
              hover
              animateFromDealer={isDealing}
            />
          </motion.div>
        ))}

      </motion.div>
    </AnimatePresence>
  );
}
