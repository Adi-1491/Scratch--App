import React from "react";
import { Sprite } from "@/utils/sprites";

interface SpriteItemProps {
  sprite: Sprite;
  active: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  canDelete: boolean; // Prevent deleting last sprite
}

const SpriteItem: React.FC<SpriteItemProps> = ({ 
  sprite, 
  active, 
  onClick, 
  onDelete,
  canDelete 
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    onDelete(sprite.id);
  };

  return (
    <div
      className={`sprite-item ${
        active ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
      } border rounded-lg p-3 cursor-pointer shadow-sm transition-transform`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-md shadow-sm flex items-center justify-center overflow-hidden">
          <img 
            src="/assets/scratch-cat.png" 
            alt={sprite.name}
            className="w-full h-full object-contain"
            style={{ 
              filter: sprite.id !== "sprite-1" ? `hue-rotate(${parseInt(sprite.color.slice(1), 16) % 360}deg)` : "" 
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{sprite.name}</h3>
          <p className="text-xs text-gray-500">x: {Math.round(sprite.x)}, y: {Math.round(sprite.y)}</p>
        </div>
        {canDelete && (
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Delete sprite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>
      {active && (
        <div className="mt-2 pt-2 border-t border-indigo-200">
          <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
            Active
          </span>
        </div>
      )}
    </div>
  );
};

export default SpriteItem;
