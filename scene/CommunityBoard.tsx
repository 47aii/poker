import { PlayingCard, type CardType } from "../Cards";

type CommunityBoardProps = {
  cards: CardType[];
  isShowdown: boolean;
  isDealing: boolean;
};

export function CommunityBoard({ cards, isShowdown, isDealing }: CommunityBoardProps) {
  const slots = 5;
  const revealed = cards.length;

  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: "clamp(10px, 2.1vw, 28px)" }}
    >
      {cards.map((card, i) => (
        <div
          key={`board-${i}`}
          style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.88))" }}
        >
          <PlayingCard
            card={card}
            idx={i}
            size="lg"
            isWinner={isShowdown}
            animateFromDealer={isDealing || revealed > i}
          />
        </div>
      ))}

      {Array.from({ length: slots - revealed }).map((_, i) => (
        <div
          key={`slot-${i}`}
          className="relative overflow-hidden rounded-xl"
          style={{
            width: "clamp(44px, 6.8vw, 88px)",
            aspectRatio: "2.5/3.5",
            background: "rgba(0,0,0,0.45)",
            border: "1.5px solid rgba(212,175,55,0.07)",
            boxShadow: "inset 0 4px 18px rgba(0,0,0,0.90)",
          }}
        >
          <div
            className="absolute inset-[16%] rounded-lg"
            style={{ border: "1px solid rgba(212,175,55,0.05)" }}
          />
        </div>
      ))}
    </div>
  );
}
