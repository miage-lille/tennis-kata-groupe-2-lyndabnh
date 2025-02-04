import { describe, expect, test } from '@jest/globals';
import * as fc from 'fast-check';
import { isSamePlayer } from '../types/player';
import { scoreWhenAdvantage, scoreWhenForty,scoreWhenPoint } from '../index';

import * as G from './generators';
import {
  Point,
  PointsData,
  Score,
  Points,
  FortyData,
  advantage,
  deuce,
  game,
 
} from '../types/score';

describe('Tests for advantage transitions', () => {
  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(isSamePlayer(advantagedPlayer, winner));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        expect(score).toStrictEqual(game(winner));
      })
    );
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(!isSamePlayer(advantagedPlayer, winner));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        expect(score).toStrictEqual(deuce());
      })
    );
  });
});

describe('Tests for forty transitions', () => {
  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(isSamePlayer(fortyData.player, winner));
        const score = scoreWhenForty(fortyData, winner);
        expect(score).toStrictEqual(game(winner));
      })
    );
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        fc.pre(fortyData.otherPoint.kind === 'THIRTY');
        const score = scoreWhenForty(fortyData, winner);
        expect(score).toStrictEqual(deuce());
      })
    );
  });
});

test('Given players at 0 or 15 points, score kind is still POINTS unless reaching 40', () => {
  fc.assert(
    fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
      const newScore = scoreWhenPoint(pointsData, winner);

    
      if (
        pointsData[winner].kind === 'LOVE' ||
        pointsData[winner].kind === 'FIFTEEN'
      ) {
        expect(newScore.kind).toBe('POINTS');
      } else {
  
        expect(newScore.kind).toBe('FORTY');
      }
    })
  );
});


test('Given one player at 30 and win, score is forty', () => {
  fc.assert(
    fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {

      fc.pre(pointsData[winner].kind === 'THIRTY');
      
      const newScore = scoreWhenPoint(pointsData, winner);
      expect(newScore.kind).toBe('FORTY');
    })
  );
});


