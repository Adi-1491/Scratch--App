import React from "react";
import { Sprite } from "@/utils/sprites";

interface SpriteItemProps {
  sprite: Sprite;
  active: boolean;
  onClick: () => void;
}

const SpriteItem: React.FC<SpriteItemProps> = ({ sprite, active, onClick }) => {
  return (
    <div
      className={`sprite-item ${
        active ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
      } border rounded-lg p-3 cursor-pointer shadow-sm transition-transform`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center"
          style={{ backgroundColor: sprite.color }}
        >
          <span className="text-white font-bold">{sprite.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{sprite.name}</h3>
          <p className="text-xs text-gray-500">x: {Math.round(sprite.x)}, y: {Math.round(sprite.y)}</p>
        </div>
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
