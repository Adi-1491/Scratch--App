import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionBlock from "@/components/blocks/MotionBlock";
import ControlBlock from "@/components/blocks/ControlBlock";
import ProgramArea from "@/components/workspace/ProgramArea";
import Canvas from "@/components/workspace/Canvas";
import SpriteList from "@/components/sprites/SpriteList";
import SpriteProperties from "@/components/sprites/SpriteProperties";
import { useSprites } from "@/contexts/SpritesContext";
import { useBlocks } from "@/contexts/BlocksContext";
import { MotionBlockAction, ControlBlockAction } from "@/utils/blockTypes";
import { toast } from "@/hooks/use-toast";

const Scratchpad: React.FC = () => {
  const { sprites, resetSpritePositions } = useSprites();
  const { swapSpriteAnimations } = useBlocks();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("workspace");
  const [currentSpriteId, setCurrentSpriteId] = useState(sprites[0]?.id || "");

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    // We don't reset positions automatically when stopping anymore
    // This allows sprites to maintain their positions when the animation stops
  };
  
  const handleReset = () => {
    // Reset sprite positions to their original values
    resetSpritePositions();
    setIsPlaying(false);
    // Show a toast notification to inform the user
    toast({
      title: "Reset Complete",
      description: "All sprites have been reset to their original positions.",
      variant: "default",
    });
  };

  const handleCollision = (sprite1Id: string, sprite2Id: string) => {
    // When two sprites collide, swap their animations
    swapSpriteAnimations(sprite1Id, sprite2Id);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header isPlaying={isPlaying} onPlay={handlePlay} onStop={handleStop} onReset={handleReset} />

      <div className="flex flex-1 overflow-hidden">
        {/* Blocks Palette */}
        <div className="w-64 bg-white shadow-md z-10 flex flex-col border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Blocks</h2>
          </div>
          
          {/* Block categories */}
          <div className="p-2 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">
                Motion
              </h3>
              
              <MotionBlock type={MotionBlockAction.MOVE} />
              <MotionBlock type={MotionBlockAction.TURN} />
              <MotionBlock type={MotionBlockAction.GOTO} />
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">
                Controls
              </h3>
              
              <ControlBlock type={ControlBlockAction.REPEAT} />
            </div>
          </div>
        </div>

        {/* Middle section with workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Workspace tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("workspace")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "workspace"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => setActiveTab("codeOutput")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "codeOutput"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Code Output
              </button>
            </div>
          </div>
          
          {/* Workspace content */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Program area */}
            <div className="w-full sm:w-1/2 overflow-y-auto">
              <ProgramArea currentSpriteId={currentSpriteId} />
            </div>
            
            {/* Canvas area */}
            <div className="w-full sm:w-1/2 p-4 overflow-y-auto bg-gray-50 border-l border-gray-200">
              <Canvas isPlaying={isPlaying} onCollision={handleCollision} />
            </div>
          </div>
        </div>

        {/* Sprite panel */}
        <div className="w-64 bg-white shadow-md border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Sprites</h2>
          </div>
          
          <SpriteList
            activeSprite={currentSpriteId}
            onSelectSprite={setCurrentSpriteId}
          />
          
          <SpriteProperties spriteId={currentSpriteId} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Scratchpad;
