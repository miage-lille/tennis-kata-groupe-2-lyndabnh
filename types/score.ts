import { Player, isSamePlayer, otherPlayer } from './player';

export type Love = { kind: 'LOVE' };
export type Fifteen = { kind: 'FIFTEEN' };
export type Thirty = { kind: 'THIRTY' };


export type Point = Love | Fifteen | Thirty;


export const love = (): Love => ({ kind: 'LOVE' });
export const fifteen = (): Fifteen => ({ kind: 'FIFTEEN' });
export const thirty = (): Thirty => ({ kind: 'THIRTY' });


export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};


export type Points = { kind: 'POINTS'; pointsData: PointsData };


export const points = (playerOnePoints: Point, playerTwoPoints: Point): Points => ({
  kind: 'POINTS',
  pointsData: {
    PLAYER_ONE: playerOnePoints,
    PLAYER_TWO: playerTwoPoints,
  },
});


export type FortyData = {
  player: Player;
  otherPoint: Point;
};


export type Forty = { kind: 'FORTY'; fortyData: FortyData };


export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  fortyData: { player, otherPoint },
});


export type Deuce = { kind: 'DEUCE' };

export const deuce = (): Deuce => ({ kind: 'DEUCE' });


export type Advantage = { kind: 'ADVANTAGE'; player: Player };

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});


export type Game = { kind: 'GAME'; player: Player };


export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});


export const incrementPoint = (point: Point): Point | null => {
  switch (point.kind) {
    case 'LOVE': return fifteen();
    case 'FIFTEEN': return thirty();
    case 'THIRTY': return null; 
  }
};


export type Score = Points | Forty | Deuce | Advantage | Game;
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const updatedPoint = incrementPoint(current[winner]);


  if (updatedPoint === null) {
    return forty(winner, current[otherPlayer(winner)]);
  }

  return points(
    winner === 'PLAYER_ONE' ? updatedPoint : current.PLAYER_ONE,
    winner === 'PLAYER_TWO' ? updatedPoint : current.PLAYER_TWO
  );
};


export const scoreWhenAdvantage = (advantagedPlayer: Player, winner: Player): Score =>
  isSamePlayer(advantagedPlayer, winner) ? game(winner) : deuce();



export const scoreWhenForty = (currentForty: FortyData, winner: Player): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);

  const incrementedPoint = incrementPoint(currentForty.otherPoint);
  return incrementedPoint === null ? deuce() : forty(currentForty.player, incrementedPoint);
};


export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);


export const scoreWhenGame = (winner: Player): Score => game(winner);


export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS': return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY': return scoreWhenForty(currentScore.fortyData, winner);
    case 'ADVANTAGE': return scoreWhenAdvantage(currentScore.player, winner);
    case 'DEUCE': return scoreWhenDeuce(winner);
    case 'GAME': return scoreWhenGame(winner);
  }
};