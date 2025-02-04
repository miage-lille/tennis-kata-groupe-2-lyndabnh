import { Player, isSamePlayer } from './types/player';
import {
  Point,
  PointsData,
  Score,
  FortyData,
  advantage,
  deuce,
  game,
  incrementPoint,
  forty,
  points
} from './types/score';


export const playerToString = (player: Player) =>
  player === 'PLAYER_ONE' ? 'Player 1' : 'Player 2';

export const otherPlayer = (player: Player) =>
  player === 'PLAYER_ONE' ? 'PLAYER_TWO' : 'PLAYER_ONE';


export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE': return 'Love';
    case 'FIFTEEN': return 'Fifteen';
    case 'THIRTY': return 'Thirty';
  }
};


export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return `${pointToString(score.pointsData.PLAYER_ONE)} - ${pointToString(score.pointsData.PLAYER_TWO)}`;
    case 'FORTY':
      return `${playerToString(score.fortyData.player)} at Forty, Other Player: ${pointToString(score.fortyData.otherPoint)}`;
    case 'DEUCE': return 'Deuce';
    case 'ADVANTAGE': return `Advantage ${playerToString(score.player)}`;
    case 'GAME': return `Game won by ${playerToString(score.player)}`;
  }
};

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (advantagedPlayer: Player, winner: Player): Score =>
  isSamePlayer(advantagedPlayer, winner) ? game(winner) : deuce();


export const scoreWhenForty = (currentForty: FortyData, winner: Player): Score => {
  if (isSamePlayer(currentForty.player, winner)) {
    return game(winner);
  }

  const incrementedPoint = incrementPoint(currentForty.otherPoint);
  return incrementedPoint === null ? deuce() : forty(currentForty.player, incrementedPoint);
};


export const scoreWhenGame = (winner: Player): Score => game(winner);


export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS': return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY': return scoreWhenForty(currentScore.fortyData, winner);
    case 'ADVANTAGE': return scoreWhenAdvantage(currentScore.player, winner);
    case 'DEUCE': return scoreWhenDeuce(winner);
    case 'GAME': return currentScore;
  }
};

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
