import { Sprite } from "./sprites";

/**
 * Detects collision between two sprites based on their positions
 * We use a simple distance-based collision detection for circular sprites
 */
export function detectCollision(sprite1: Sprite, sprite2: Sprite): boolean {
  // Calculate the distance between sprite centers
  const dx = sprite1.x - sprite2.x;
  const dy = sprite1.y - sprite2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Assuming sprites are circles with radius 24 pixels (48px diameter)
  // We convert from canvas coordinates to pixels approximately (this should be fine-tuned based on canvas size)
  const spriteSize = 24; 
  
  // Return true if sprites are overlapping
  return distance < spriteSize;
}
