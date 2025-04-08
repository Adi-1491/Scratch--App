import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Sprite, generateRandomColor } from "@/utils/sprites";

interface SpritesState {
  sprites: Sprite[];
}

interface SpritesContextType extends SpritesState {
  addSprite: () => string;
  removeSprite: (id: string) => void;
  updateSprite: (id: string, sprite: Sprite) => void;
  updateSpritePosition: (id: string, x: number, y: number, direction?: number) => void;
  resetSpritePositions: () => void;
}

const SpritesContext = createContext<SpritesContextType | undefined>(undefined);

// Default sprites to start with
const defaultSprites: Sprite[] = [
  {
    id: "sprite-1",
    name: "Sprite 1",
    x: 0,
    y: 0,
    direction: 90,
    color: "#FF5722",
    originalX: 0,
    originalY: 0,
    originalDirection: 90,
  },
  {
    id: "sprite-2",
    name: "Sprite 2",
    x: 100,
    y: 0,
    direction: 270,
    color: "#2196F3",
    originalX: 100,
    originalY: 0,
    originalDirection: 270,
  },
];

export const SpritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sprites, setSprites] = useState<Sprite[]>(defaultSprites);

  const addSprite = (): string => {
    const newSpriteId = `sprite-${uuidv4()}`;
    const newSpriteNumber = sprites.length + 1;
    
    const newSprite: Sprite = {
      id: newSpriteId,
      name: `Sprite ${newSpriteNumber}`,
      x: Math.random() * 100 - 50, // Random position
      y: Math.random() * 100 - 50,
      direction: 90,
      color: generateRandomColor(sprites), // Pass existing sprites to ensure unique color
      originalX: 0,
      originalY: 0,
      originalDirection: 90,
    };
    
    // Also store original positions for reset
    newSprite.originalX = newSprite.x;
    newSprite.originalY = newSprite.y;
    newSprite.originalDirection = newSprite.direction;
    
    setSprites([...sprites, newSprite]);
    return newSpriteId;
  };

  const removeSprite = (id: string) => {
    setSprites(sprites.filter((s) => s.id !== id));
  };

  const updateSprite = (id: string, updatedSprite: Sprite) => {
    setSprites(
      sprites.map((sprite) => (sprite.id === id ? updatedSprite : sprite))
    );
  };

  const updateSpritePosition = (id: string, x: number, y: number, direction?: number) => {
    setSprites(
      sprites.map((sprite) => {
        if (sprite.id === id) {
          return {
            ...sprite,
            x,
            y,
            direction: direction !== undefined ? direction : sprite.direction,
          };
        }
        return sprite;
      })
    );
  };

  const resetSpritePositions = () => {
    setSprites(
      sprites.map((sprite) => ({
        ...sprite,
        x: sprite.originalX,
        y: sprite.originalY,
        direction: sprite.originalDirection,
      }))
    );
  };

  return (
    <SpritesContext.Provider
      value={{
        sprites,
        addSprite,
        removeSprite,
        updateSprite,
        updateSpritePosition,
        resetSpritePositions,
      }}
    >
      {children}
    </SpritesContext.Provider>
  );
};

export const useSprites = () => {
  const context = useContext(SpritesContext);
  if (context === undefined) {
    throw new Error("useSprites must be used within a SpritesProvider");
  }
  return context;
};
