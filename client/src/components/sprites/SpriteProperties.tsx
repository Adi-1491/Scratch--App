import React, { useState, useEffect } from "react";
import { useSprites } from "@/contexts/SpritesContext";
import { Sprite } from "@/utils/sprites";

interface SpritePropertiesProps {
  spriteId: string;
}

const SpriteProperties: React.FC<SpritePropertiesProps> = ({ spriteId }) => {
  const { sprites, updateSprite, updateSpritePosition } = useSprites();
  const [sprite, setSprite] = useState<Sprite | null>(null);
  const [name, setName] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [direction, setDirection] = useState(90);

  useEffect(() => {
    const currentSprite = sprites.find((s) => s.id === spriteId);
    if (currentSprite) {
      setSprite(currentSprite);
      setName(currentSprite.name);
      setX(currentSprite.x);
      setY(currentSprite.y);
      setDirection(currentSprite.direction);
    }
  }, [spriteId, sprites]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (sprite) {
      updateSprite(spriteId, { ...sprite, name: newName });
    }
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value);
    setX(newX);
    if (sprite) {
      updateSpritePosition(spriteId, newX, sprite.y, sprite.direction);
    }
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value);
    setY(newY);
    if (sprite) {
      updateSpritePosition(spriteId, sprite.x, newY, sprite.direction);
    }
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDirection = parseFloat(e.target.value);
    setDirection(newDirection);
    if (sprite) {
      updateSpritePosition(spriteId, sprite.x, sprite.y, newDirection);
    }
  };

  if (!sprite) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Sprite Properties</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 block mb-1">X Position</label>
            <input
              type="number"
              value={x}
              onChange={handleXChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Y Position</label>
            <input
              type="number"
              value={y}
              onChange={handleYChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Direction</label>
          <input
            type="number"
            value={direction}
            onChange={handleDirectionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SpriteProperties;
