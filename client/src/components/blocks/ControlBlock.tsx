import React, { useRef, useState } from "react";
import { useBlocks } from "@/contexts/BlocksContext";
import { BlockType, ControlBlockAction } from "@/utils/blockTypes";

interface ControlBlockProps {
  type: ControlBlockAction;
  placed?: boolean;
  index?: number;
  parentId?: string | null;
  blockId?: string;
  defaultRepeatCount?: number;
  children?: React.ReactNode;
}

const ControlBlock: React.FC<ControlBlockProps> = ({
  type,
  placed = false,
  index = -1,
  parentId = null,
  blockId,
  defaultRepeatCount = 10,
  children,
}) => {
  const { addBlock, updateBlockParam, removeBlock } = useBlocks();
  const blockRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(defaultRepeatCount);

  const handleDragStart = (e: React.DragEvent) => {
    // If the block is already placed and has an ID, it's being moved
    if (placed && blockId) {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: BlockType.CONTROL,
          action: type,
          id: blockId,
          isMoving: true,
          parentId,
          index,
        })
      );
    } else {
      // Create a new block
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: BlockType.CONTROL,
          action: type,
          params: { repeatCount },
        })
      );
    }

    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (blockRef.current) {
      blockRef.current.classList.add("bg-amber-300");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (blockRef.current) {
      blockRef.current.classList.remove("bg-amber-300");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (blockRef.current) {
      blockRef.current.classList.remove("bg-amber-300");
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      
      if (blockId) {
        // Add the dropped block as a child of this repeat block
        if (data.isMoving && data.id) {
          // Moving an existing block
          addBlock({
            ...data,
            parentId: blockId,
          });
        } else {
          // Adding a new block
          addBlock({
            ...data,
            parentId: blockId,
          });
        }
      }
    } catch (err) {
      console.error("Error dropping block:", err);
    }
  };

  const handleRepeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value);
    setRepeatCount(newCount);
    if (placed && blockId) {
      updateBlockParam(blockId, "repeatCount", newCount);
    }
  };

  return (
    <div
      className="block-container mb-3"
      data-block-type="control"
      data-block-action={type}
      data-placed={placed.toString()}
      data-block-id={blockId}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="block bg-control text-white p-3 rounded-t-lg shadow-sm cursor-grab"
      >
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path>
          </svg>
          <span>Repeat</span>
          <input
            type="number"
            value={repeatCount}
            onChange={handleRepeatCountChange}
            className="w-14 px-2 py-1 text-gray-800 rounded bg-white text-center text-sm"
          />
          <span>times</span>
        </div>
      </div>
      <div 
        ref={blockRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="bg-amber-400 p-4 rounded-b-lg border-t-2 border-amber-600"
      >
        {children || (
          <div className="bg-amber-300 rounded p-2 text-amber-800 text-center text-sm">
            Drop blocks here
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlBlock;
