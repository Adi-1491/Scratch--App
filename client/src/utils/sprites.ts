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

/**
 * Generates a random color for new sprites
 */
export function generateRandomColor(): string {
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
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}
