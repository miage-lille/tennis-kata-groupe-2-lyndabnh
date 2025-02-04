export type Player = 'PLAYER_ONE' | 'PLAYER_TWO';
export const isSamePlayer = (p1: Player, p2: Player) => p1 === p2;
export const otherPlayer = (player: Player): Player =>
    player === 'PLAYER_ONE' ? 'PLAYER_TWO' : 'PLAYER_ONE';