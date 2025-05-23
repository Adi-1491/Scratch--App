import React from "react";
import { useSprites } from "@/contexts/SpritesContext";
import SpriteItem from "./SpriteItem";
import { useBlocks } from "@/contexts/BlocksContext";

interface SpriteListProps {
  activeSprite: string;
  onSelectSprite: (id: string) => void;
}

const SpriteList: React.FC<SpriteListProps> = ({ activeSprite, onSelectSprite }) => {
  const { sprites, addSprite, removeSprite } = useSprites();
  const { programBlocks } = useBlocks();

  const handleAddSprite = () => {
    const newSpriteId = addSprite();
    onSelectSprite(newSpriteId);
  };

  const handleDeleteSprite = (id: string) => {
    // If this is the current active sprite, select another one
    if (id === activeSprite) {
      const remainingSprites = sprites.filter(s => s.id !== id);
      if (remainingSprites.length > 0) {
        onSelectSprite(remainingSprites[0].id);
      }
    }
    
    // Remove the sprite
    removeSprite(id);
  };

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="space-y-3">
        {sprites.map((sprite) => (
          <SpriteItem
            key={sprite.id}
            sprite={sprite}
            active={sprite.id === activeSprite}
            onClick={() => onSelectSprite(sprite.id)}
            onDelete={handleDeleteSprite}
            canDelete={sprites.length > 1} // Prevent deleting the last sprite
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddSprite}
          className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Sprite</span>
        </button>
      </div>
    </div>
  );
};

export default SpriteList;
