import React, { useRef } from "react";
import { useBlocks } from "@/contexts/BlocksContext";
import { useSprites } from "@/contexts/SpritesContext";
import MotionBlock from "@/components/blocks/MotionBlock";
import ControlBlock from "@/components/blocks/ControlBlock";
import { BlockType, MotionBlockAction, ControlBlockAction } from "@/utils/blockTypes";

interface ProgramAreaProps {
  currentSpriteId: string;
}

const ProgramArea: React.FC<ProgramAreaProps> = ({ currentSpriteId }) => {
  const { programBlocks, addBlock, moveBlock } = useBlocks();
  const { sprites } = useSprites();
  const programAreaRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (programAreaRef.current) {
      programAreaRef.current.classList.add("bg-indigo-50");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (programAreaRef.current) {
      programAreaRef.current.classList.remove("bg-indigo-50");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (programAreaRef.current) {
      programAreaRef.current.classList.remove("bg-indigo-50");
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      
      if (data.isMoving && data.id) {
        // Moving an existing block
        moveBlock(data.id, currentSpriteId, null);
      } else {
        // Adding a new block
        addBlock({
          ...data,
          spriteId: currentSpriteId,
          parentId: null
        });
      }
    } catch (err) {
      console.error("Error dropping block:", err);
    }
  };

  const renderBlocks = (blocks: any[], parentId: string | null = null) => {
    if (!blocks || blocks.length === 0) return null;

    return blocks.map((block, index) => {
      if (block.type === BlockType.MOTION) {
        return (
          <MotionBlock
            key={block.id}
            type={block.action as MotionBlockAction}
            placed={true}
            blockId={block.id}
            parentId={parentId}
            index={index}
            defaultSteps={block.params?.steps || 10}
            defaultDegrees={block.params?.degrees || 15}
            defaultX={block.params?.x || 0}
            defaultY={block.params?.y || 0}
          />
        );
      } else if (block.type === BlockType.CONTROL) {
        return (
          <ControlBlock
            key={block.id}
            type={block.action as ControlBlockAction}
            placed={true}
            blockId={block.id}
            parentId={parentId}
            index={index}
            defaultRepeatCount={block.params?.repeatCount || 10}
          >
            {renderBlocks(block.children || [], block.id)}
          </ControlBlock>
        );
      }
      return null;
    });
  };

  const currentSpriteBlocks = programBlocks[currentSpriteId] || [];
  const currentSprite = sprites.find(s => s.id === currentSpriteId);

  return (
    <div className="w-full p-4 bg-gray-100 overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Program - {currentSprite?.name || "No sprite selected"}
      </h3>
      
      <div
        id="program-area"
        ref={programAreaRef}
        className="program-area bg-white border border-gray-200 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="script-area bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 mb-4 min-h-[120px]">
          {currentSpriteBlocks.length > 0 ? (
            renderBlocks(currentSpriteBlocks)
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <p>Drag blocks here to program {currentSprite?.name || "your sprite"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramArea;
