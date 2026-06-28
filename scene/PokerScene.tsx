import "./scene.css";
import { CasinoEnvironment } from "./CasinoEnvironment";
import { PremiumTable } from "./PremiumTable";
import { SceneDealer } from "./SceneDealer";
import { PotDisplay } from "./PotDisplay";
import { CommunityBoard } from "./CommunityBoard";
import { FeltBetChips } from "./FeltBetChips";
import { SeatPod } from "./SeatPod";
import { HeroCardsLayer } from "./HeroCardsLayer";
import { mapPlayersToSeats } from "./seatLayout";
import type { PokerSceneProps } from "./types";

export function PokerScene({
  players,
  communityCards,
  pot,
  phase,
  isShowdown,
  isDealing,
  heroUserId,
  heroCards = [],
  dealerIndex,
  currentPlayerIndex,
  timer,
}: PokerSceneProps) {
  const heroIndex = players.findIndex((p) => p.userId === heroUserId);
  const seated = mapPlayersToSeats(players, heroIndex);
  const playerCount = players.length;

  const feltCenter = (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
      <PotDisplay pot={pot} />
      <CommunityBoard cards={communityCards} isShowdown={isShowdown} isDealing={isDealing} />
      <FeltBetChips players={seated} />
    </div>
  );

  return (
    <div className="poker-scene">
      <CasinoEnvironment />

      {/* 3D world — table only */}
      <div className="poker-scene__camera">
        <div className="poker-scene__world">
          <PremiumTable feltContent={feltCenter} />
        </div>
      </div>

      {/* Dealer — screen-space so she stands upright and realistic */}
      <SceneDealer isDealing={isDealing} />

      {/* Screen-space seat ring */}
      <div className="poker-scene__seats">
        {seated.map((player) => {
          const isActive =
            currentPlayerIndex === player.originalIndex &&
            phase !== "waiting" &&
            phase !== "showdown";
          const sbIdx = playerCount > 0 ? (dealerIndex + 1) % playerCount : -1;
          const bbIdx = playerCount > 0 ? (dealerIndex + 2) % playerCount : -1;

          return (
            <SeatPod
              key={player.userId}
              player={player}
              isActive={isActive}
              isDealer={dealerIndex === player.originalIndex}
              isSB={player.originalIndex === sbIdx}
              isBB={player.originalIndex === bbIdx}
              isHero={player.userId === heroUserId}
              timer={timer}
              isShowdown={isShowdown}
            />
          );
        })}
      </div>

      {/* Hero hole cards — foreground, never overlapping board */}
      <HeroCardsLayer
        cards={heroCards}
        isShowdown={isShowdown}
        isDealing={isDealing}
        visible={!!heroCards.length && !players.find((p) => p.userId === heroUserId)?.isFolded}
      />
    </div>
  );
}

export type { PokerSceneProps, ScenePlayer } from "./types";
