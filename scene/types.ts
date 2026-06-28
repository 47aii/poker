import type { CardType } from "../Cards";

export type ScenePlayer = {
  userId: number;
  displayName: string;
  avatarUrl?: string;
  chipStack: number;
  currentBet: number;
  cards: CardType[];
  action?: string;
  isFolded?: boolean;
  isAllIn?: boolean;
  originalIndex: number;
};

export type PokerSceneProps = {
  players: ScenePlayer[];
  communityCards: CardType[];
  pot: number;
  phase: string;
  isShowdown: boolean;
  isDealing: boolean;
  heroUserId?: number;
  heroCards?: CardType[];
  dealerIndex: number;
  currentPlayerIndex: number;
  timer: number;
  maxPlayers: number;
};

export type SeatSlot = {
  seatX: number;
  seatY: number;
  betX: number;
  betY: number;
  zIndex: number;
  tilt: number;
};

export type SeatedPlayer = ScenePlayer & SeatSlot;
