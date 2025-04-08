import React, { useRef } from "react";
import { useBlocks } from "@/contexts/BlocksContext";
import { useSprites } from "@/contexts/SpritesContext";
import { BlockType, LookBlockAction } from "@/utils/blockTypes";
import { createDragGhost } from "@/utils/dragAndDrop";

interface LookBlockProps {
  type: LookBlockAction;
  placed?: boolean;
  index?: number;
  parentId?: string | null;
  blockId?: string;
  defaultMessage?: string;
  defaultSeconds?: number;
  children?: React.ReactNode;
}

const LookBlock: React.FC<LookBlockProps> = ({
  type,
  placed = false,
  index,
  parentId = null,
  blockId,
  defaultMessage = "Hello!",
  defaultSeconds = 2,
  children
}) => {
  const { addBlock, updateBlockParam, removeBlock } = useBlocks();
  const { sprites } = useSprites();
  const inputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);
  
  // Get current sprite ID from the context
  const currentSpriteId = sprites.length > 0 ? sprites[0].id : "";
  
  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (placed && blockId) {
      // If the block is already placed, allow moving it
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: BlockType.LOOK,
          action: type,
          id: blockId,
          isMoving: true,
          parentId,
          index,
        })
      );
    } else {
      // Otherwise create a new block
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: BlockType.LOOK,
          action: type,
          params: {
            message: defaultMessage,
            seconds: type === LookBlockAction.SAY_FOR_SECONDS ? defaultSeconds : undefined
          }
        })
      );
    }
    
    // Create a custom drag ghost
    const ghost = createDragGhost(e.currentTarget);
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
    
    e.currentTarget.classList.add("opacity-50");
  };
  
  // Handle drag end event
  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };
  
  // Handle parameter changes
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blockId && placed) {
      updateBlockParam(blockId, "message", e.target.value);
    }
  };
  
  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blockId && placed) {
      updateBlockParam(blockId, "seconds", Number(e.target.value) || 1);
    }
  };
  
  // Handle deleting the block
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (blockId) {
      removeBlock(blockId);
    }
  };
  
  // Prevent dragging on input fields
  const handleInputDragStart = (e: React.DragEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };
  
  // Click handler to focus input when block is clicked
  const handleBlockClick = () => {
    if (type === LookBlockAction.SAY && inputRef.current) {
      inputRef.current.focus();
    } else if (type === LookBlockAction.SAY_FOR_SECONDS) {
      if (inputRef.current) inputRef.current.focus();
    }
  };
  
  // Render the appropriate block based on the type
  return (
    <div
      id={blockId ? `block-${blockId}` : undefined}
      className={`mb-2 rounded-md cursor-grab active:cursor-grabbing flex relative ${
        placed ? "shadow-md" : ""
      }`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleBlockClick}
      data-block-id={blockId}
      data-block-type={BlockType.LOOK}
      data-block-action={type}
      data-placed={placed}
      data-index={index}
      data-parent-id={parentId}
    >
      <div className="bg-purple-500 text-white rounded-l-md p-2 flex items-center">
        <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M13,11h-2V5h2V11z M13,15h-2v-2h2V15z"></path>
        </svg>
        <span>say</span>
      </div>
      
      <div className="bg-purple-400 p-2 flex items-center">
        <input
          ref={inputRef}
          type="text"
          className="bg-purple-300 px-2 py-1 text-black text-sm rounded-md w-20"
          value={defaultMessage}
          placeholder="message"
          onChange={handleMessageChange}
          onDragStart={handleInputDragStart}
        />
      </div>
      
      {type === LookBlockAction.SAY_FOR_SECONDS && (
        <>
          <div className="bg-purple-400 p-2 flex items-center">
            <span className="text-white">for</span>
          </div>
          <div className="bg-purple-400 p-2 flex items-center">
            <input
              ref={secondsInputRef}
              type="number"
              className="bg-purple-300 px-2 py-1 text-black text-sm rounded-md w-10"
              value={defaultSeconds}
              min="1"
              max="10"
              onChange={handleSecondsChange}
              onDragStart={handleInputDragStart}
            />
          </div>
          <div className="bg-purple-400 rounded-r-md p-2 flex items-center">
            <span className="text-white">seconds</span>
          </div>
        </>
      )}
      
      {type === LookBlockAction.SAY && (
        <div className="bg-purple-400 rounded-r-md w-3"></div>
      )}
      
      {/* Delete button - only show for placed blocks */}
      {placed && blockId && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          title="Remove block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
      {children}
    </div>
  );
};

export default LookBlock;