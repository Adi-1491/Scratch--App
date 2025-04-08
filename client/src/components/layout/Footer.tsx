import React from "react";
import { useSprites } from "@/contexts/SpritesContext";
import { useBlocks } from "@/contexts/BlocksContext";

const Footer: React.FC = () => {
  const { sprites } = useSprites();
  const { getTotalBlockCount } = useBlocks();
  
  const totalBlockCount = getTotalBlockCount();

  return (
    <footer className="bg-gray-800 text-gray-300 p-2 text-xs flex justify-between items-center">
      <div>
        <span className="mr-4">Ready</span>
        <span>Sprites: {sprites.length}</span>
      </div>
      <div>
        <span className="mr-4">Hero Feature: Collision Detection Active</span>
        <span>Blocks: {totalBlockCount}</span>
      </div>
    </footer>
  );
};

export default Footer;
