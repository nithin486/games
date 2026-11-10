import { SCORING } from '../config/constants';
import { LevelData, LevelResult } from '../config/types';

export function calculateResult(
  levelData: LevelData,
  time: number,
  flips: number,
  collectedStar: boolean
): LevelResult {
  let score = SCORING.LEVEL_COMPLETE;

  if (collectedStar) {
    score += SCORING.COLLECTIBLE_BONUS;
  }

  // Efficiency bonus
  let efficiencyBonus = 0;
  if (flips <= levelData.flipTarget) {
    efficiencyBonus = SCORING.EFFICIENCY_MAX_BONUS;
  } else {
    const excessFlips = flips - levelData.flipTarget;
    const factor = Math.max(0, 1 - excessFlips / Math.max(1, levelData.flipTarget));
    efficiencyBonus = Math.round(SCORING.EFFICIENCY_MAX_BONUS * factor);
  }
  score += efficiencyBonus;

  // Time bonus
  let timeBonus = 0;
  if (time <= levelData.timeTarget) {
    timeBonus = SCORING.TIME_MAX_BONUS;
  } else {
    const excessTime = time - levelData.timeTarget;
    const factor = Math.max(0, 1 - excessTime / Math.max(1, levelData.timeTarget));
    timeBonus = Math.round(SCORING.TIME_MAX_BONUS * factor);
  }
  score += timeBonus;

  // Stars calculation:
  // 1 star: complete level
  // +1 star: collect star
  // +1 star: flips <= flipTarget
  let stars = 1;
  if (collectedStar) stars++;
  if (flips <= levelData.flipTarget) stars++;

  return {
    levelId: levelData.id,
    completed: true,
    time,
    flips,
    collectedStar,
    score,
    stars,
  };
}
