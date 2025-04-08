import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlockType } from "@/utils/blockTypes";

interface Block {
  id: string;
  type: BlockType;
  action: string;
  spriteId: string;
  parentId: string | null;
  params: Record<string, any>;
  children?: Block[];
}

interface BlocksState {
  // Blocks organized by sprite and hierarchical structure
  programBlocks: Record<string, Block[]>;
}

interface BlocksContextType extends BlocksState {
  addBlock: (block: any) => string;
  removeBlock: (blockId: string) => void;
  updateBlockParam: (blockId: string, paramName: string, value: any) => void;
  moveBlock: (blockId: string, spriteId: string, parentId: string | null) => void;
  swapSpriteAnimations: (spriteId1: string, spriteId2: string) => void;
  getTotalBlockCount: () => number;
}

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

export const BlocksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programBlocks, setProgramBlocks] = useState<Record<string, Block[]>>({});

  // Helper function to find a block anywhere in the program blocks
  const findBlock = (
    blockId: string,
    blocks: Block[] = [],
    spriteId?: string
  ): { block: Block; parent: Block[] | null; spriteId: string | null } | null => {
    // If spriteId is provided, only search in that sprite's blocks
    const spritesToSearch = spriteId
      ? [spriteId]
      : Object.keys(programBlocks);

    for (const sid of spritesToSearch) {
      const searchBlocks = spriteId ? blocks : programBlocks[sid] || [];
      
      for (let i = 0; i < searchBlocks.length; i++) {
        const block = searchBlocks[i];
        
        if (block.id === blockId) {
          return { block, parent: searchBlocks, spriteId: sid };
        }
        
        if (block.children && block.children.length > 0) {
          const found = findBlock(blockId, block.children, sid);
          if (found) {
            return found;
          }
        }
      }
    }
    
    return null;
  };

  const addBlock = (blockData: any): string => {
    const newBlockId = blockData.id || uuidv4();
    const spriteId = blockData.spriteId;
    const parentId = blockData.parentId;
    
    if (!spriteId) {
      console.error("No sprite ID provided for block");
      return newBlockId;
    }
    
    const newBlock: Block = {
      id: newBlockId,
      type: blockData.type,
      action: blockData.action,
      spriteId,
      parentId,
      params: blockData.params || {},
      children: blockData.children || [],
    };
    
    setProgramBlocks((prevBlocks) => {
      const newBlocks = { ...prevBlocks };
      
      // If this block is being moved and already exists
      if (blockData.isMoving) {
        // Find the block in its current location
        const found = findBlock(newBlockId);
        
        if (found) {
          // Remove from its current location
          const { parent, spriteId: oldSpriteId } = found;
          
          if (parent && oldSpriteId) {
            // If it's in a top-level sprite array
            if (parent === prevBlocks[oldSpriteId]) {
              newBlocks[oldSpriteId] = parent.filter(
                (b) => b.id !== newBlockId
              );
            } 
            // If it's in a parent block's children array
            else {
              const parentBlock = findBlock(newBlock.parentId || "", undefined, oldSpriteId);
              if (parentBlock && parentBlock.block.children) {
                parentBlock.block.children = parentBlock.block.children.filter(
                  (b) => b.id !== newBlockId
                );
              }
            }
          }
        }
      }
      
      // If the block has a parent, add it to that parent's children
      if (parentId) {
        const parentFound = findBlock(parentId, undefined, spriteId);
        
        if (parentFound) {
          if (!parentFound.block.children) {
            parentFound.block.children = [];
          }
          parentFound.block.children.push(newBlock);
        }
      } 
      // Otherwise, add it to the sprite's top-level blocks
      else {
        if (!newBlocks[spriteId]) {
          newBlocks[spriteId] = [];
        }
        newBlocks[spriteId].push(newBlock);
      }
      
      return newBlocks;
    });
    
    return newBlockId;
  };

  const removeBlock = (blockId: string) => {
    const found = findBlock(blockId);
    
    if (found) {
      const { parent, spriteId } = found;
      
      if (parent && spriteId) {
        setProgramBlocks((prevBlocks) => {
          const newBlocks = { ...prevBlocks };
          
          if (parent === prevBlocks[spriteId]) {
            newBlocks[spriteId] = parent.filter((b) => b.id !== blockId);
          } else {
            // It's in a parent's children array, find the parent and update its children
            const parentBlockId = found.block.parentId;
            if (parentBlockId) {
              const parentFound = findBlock(parentBlockId, undefined, spriteId);
              if (parentFound && parentFound.block.children) {
                parentFound.block.children = parentFound.block.children.filter(
                  (b) => b.id !== blockId
                );
              }
            }
          }
          
          return newBlocks;
        });
      }
    }
  };

  const updateBlockParam = (blockId: string, paramName: string, value: any) => {
    const found = findBlock(blockId);
    
    if (found) {
      const { block } = found;
      
      setProgramBlocks((prevBlocks) => {
        const newBlocks = { ...prevBlocks };
        block.params[paramName] = value;
        return newBlocks;
      });
    }
  };

  const moveBlock = (blockId: string, spriteId: string, parentId: string | null) => {
    const found = findBlock(blockId);
    
    if (found) {
      const blockData = {
        ...found.block,
        spriteId,
        parentId,
        isMoving: true,
      };
      
      addBlock(blockData);
    }
  };

  const swapSpriteAnimations = (spriteId1: string, spriteId2: string) => {
    setProgramBlocks((prevBlocks) => {
      const newBlocks = { ...prevBlocks };
      
      // Swap the blocks between the two sprites
      const sprite1Blocks = [...(prevBlocks[spriteId1] || [])];
      const sprite2Blocks = [...(prevBlocks[spriteId2] || [])];
      
      // Update sprite IDs for all blocks and their children
      const updateSpriteId = (blocks: Block[], newSpriteId: string) => {
        return blocks.map(block => ({
          ...block,
          spriteId: newSpriteId,
          children: block.children ? updateSpriteId(block.children, newSpriteId) : undefined
        }));
      };
      
      newBlocks[spriteId1] = updateSpriteId(sprite2Blocks, spriteId1);
      newBlocks[spriteId2] = updateSpriteId(sprite1Blocks, spriteId2);
      
      return newBlocks;
    });
  };

  // Calculate total block count across all sprites
  const getTotalBlockCount = () => {
    let count = 0;
    
    const countBlocks = (blocks: Block[]) => {
      count += blocks.length;
      
      blocks.forEach(block => {
        if (block.children && block.children.length > 0) {
          countBlocks(block.children);
        }
      });
    };
    
    Object.values(programBlocks).forEach(spriteBlocks => {
      countBlocks(spriteBlocks);
    });
    
    return count;
  };

  return (
    <BlocksContext.Provider
      value={{
        programBlocks,
        addBlock,
        removeBlock,
        updateBlockParam,
        moveBlock,
        swapSpriteAnimations,
        getTotalBlockCount
      }}
    >
      {children}
    </BlocksContext.Provider>
  );
};

export const useBlocks = () => {
  const context = useContext(BlocksContext);
  if (context === undefined) {
    throw new Error("useBlocks must be used within a BlocksProvider");
  }
  return context;
};
