export interface Sprite {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: number; // in degrees, 0 is up, 90 is right
  color: string;
  originalX: number;
  originalY: number;
  originalDirection: number;
}

// Store used color indexes to avoid repeating colors
let usedColorIndexes: number[] = [];

/**
 * Generates a unique color for new sprites
 * @param existingSprites Optional array of existing sprites to check for used colors
 */
export function generateRandomColor(existingSprites?: Sprite[]): string {
  // List of vibrant colors for sprites
  const colors = [
    "#FF5722", // Deep Orange
    "#2196F3", // Blue
    "#4CAF50", // Green
    "#9C27B0", // Purple
    "#FFC107", // Amber
    "#E91E63", // Pink
    "#00BCD4", // Cyan
    "#8BC34A", // Light Green
    "#3F51B5", // Indigo
    "#F44336", // Red
    "#795548", // Brown
    "#607D8B", // Blue Grey
    "#FF9800", // Orange
    "#673AB7", // Deep Purple
    "#009688", // Teal
  ];
  
  // Reset used colors if we've used them all
  if (usedColorIndexes.length >= colors.length) {
    usedColorIndexes = [];
  }
  
  // If existing sprites are provided, add their colors to the used list
  if (existingSprites) {
    existingSprites.forEach(sprite => {
      const colorIndex = colors.indexOf(sprite.color);
      if (colorIndex !== -1 && !usedColorIndexes.includes(colorIndex)) {
        usedColorIndexes.push(colorIndex);
      }
    });
  }
  
  // Find an unused color
  let colorIndex: number;
  do {
    colorIndex = Math.floor(Math.random() * colors.length);
  } while (usedColorIndexes.includes(colorIndex));
  
  // Mark this color as used
  usedColorIndexes.push(colorIndex);
  
  return colors[colorIndex];
}
