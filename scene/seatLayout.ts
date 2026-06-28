import type { SeatSlot, SeatedPlayer } from "./types";

/** Hero sits at the bottom; seats distribute clockwise on an oval ring. */
const HERO_RADIANS = Math.PI / 2;

export function buildSeatRing(total: number, heroRelativeIndex = 0): SeatSlot[] {
  if (total <= 0) return [];

  return Array.from({ length: total }, (_, i) => {
    const relative = (i - heroRelativeIndex + total) % total;
    const angle = HERO_RADIANS + (relative * Math.PI * 2) / total;

    const seatRx = 44;
    const seatRy = 40;
    const betRx = 26;
    const betRy = 20;

    const seatX = 50 + seatRx * Math.cos(angle);
    const seatY = 50 + seatRy * Math.sin(angle);
    const betX = 50 + betRx * Math.cos(angle);
    const betY = 50 + betRy * Math.sin(angle);

    const tilt = (angle * 180) / Math.PI + 90;

    return {
      seatX,
      seatY,
      betX,
      betY,
      zIndex: Math.round(seatY * 10),
      tilt,
    };
  });
}

export function mapPlayersToSeats<T extends { originalIndex: number }>(
  players: T[],
  heroIndex: number,
): (T & SeatSlot)[] {
  const ring = buildSeatRing(players.length, heroIndex >= 0 ? heroIndex : 0);
  return players.map((player, i) => ({
    ...player,
    ...ring[i],
  }));
}
