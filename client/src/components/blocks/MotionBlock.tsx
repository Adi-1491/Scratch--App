import React, { useRef, useState } from "react";
import { useBlocks } from "@/contexts/BlocksContext";
import { BlockType, MotionBlockAction } from "@/utils/blockTypes";

interface MotionBlockProps {
  type: MotionBlockAction;
  placed?: boolean;
  index?: number;
  parentId?: string | null;
  blockId?: string;
  defaultSteps?: number;
  defaultDegrees?: number;
  defaultX?: number;
  defaultY?: number;
}

const MotionBlock: React.FC<MotionBlockProps> = ({
  type,
  placed = false,
  index = -1,
  parentId = null,
  blockId,
  defaultSteps = 10,
  defaultDegrees = 15,
  defaultX = 0,
  defaultY = 0,
}) => {
  const { addBlock, updateBlockParam, removeBlock } = useBlocks();
  const blockRef = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState(defaultSteps);
  const [degrees, setDegrees] = useState(defaultDegrees);
  const [x, setX] = useState(defaultX);
  const [y, setY] = useState(defaultY);

  const handleDragStart = (e: React.DragEvent) => {
    // If the block is already placed, allow moving it
    if (placed && blockId) {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: BlockType.MOTION,
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
          type: BlockType.MOTION,
          action: type,
          params: getParams(),
        })
      );
    }

    e.currentTarget.classList.add("opacity-50");
  };

  const getParams = () => {
    switch (type) {
      case MotionBlockAction.MOVE:
        return { steps };
      case MotionBlockAction.TURN:
        return { degrees };
      case MotionBlockAction.GOTO:
        return { x, y };
      default:
        return {};
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSteps = parseInt(e.target.value);
    setSteps(newSteps);
    if (placed && blockId) {
      updateBlockParam(blockId, "steps", newSteps);
    }
  };

  const handleDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDegrees = parseInt(e.target.value);
    setDegrees(newDegrees);
    if (placed && blockId) {
      updateBlockParam(blockId, "degrees", newDegrees);
    }
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseInt(e.target.value);
    setX(newX);
    if (placed && blockId) {
      updateBlockParam(blockId, "x", newX);
    }
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseInt(e.target.value);
    setY(newY);
    if (placed && blockId) {
      updateBlockParam(blockId, "y", newY);
    }
  };

  const renderBlockContent = () => {
    switch (type) {
      case MotionBlockAction.MOVE:
        return (
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"></path>
            </svg>
            <span>Move</span>
            <input
              type="number"
              value={steps}
              onChange={handleStepsChange}
              className="w-14 px-2 py-1 text-gray-800 rounded bg-white text-center text-sm"
            />
            <span>steps</span>
          </div>
        );
      case MotionBlockAction.TURN:
        return (
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"></path>
            </svg>
            <span>Turn</span>
            <input
              type="number"
              value={degrees}
              onChange={handleDegreesChange}
              className="w-14 px-2 py-1 text-gray-800 rounded bg-white text-center text-sm"
            />
            <span>degrees</span>
          </div>
        );
      case MotionBlockAction.GOTO:
        return (
          <div className="flex items-center space-x-2 flex-wrap">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
            </svg>
            <span>Go to</span>
            <span>x:</span>
            <input
              type="number"
              value={x}
              onChange={handleXChange}
              className="w-14 px-2 py-1 text-gray-800 rounded bg-white text-center text-sm"
            />
            <span>y:</span>
            <input
              type="number"
              value={y}
              onChange={handleYChange}
              className="w-14 px-2 py-1 text-gray-800 rounded bg-white text-center text-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={blockRef}
      className="block-container mb-3"
      data-block-type="motion"
      data-block-action={type}
      data-placed={placed.toString()}
      data-block-id={blockId}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="block bg-motion text-white p-3 rounded-lg shadow-sm cursor-grab"
      >
        {renderBlockContent()}
        <div className="block-notch"></div>
      </div>
    </div>
  );
};

export default MotionBlock;
