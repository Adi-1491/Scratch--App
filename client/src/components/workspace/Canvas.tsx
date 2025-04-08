import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSprites } from "@/contexts/SpritesContext";
import { useBlocks } from "@/contexts/BlocksContext";
import { detectCollision } from "@/utils/collisionDetection";
import { Sprite } from "@/utils/sprites";
import { toast } from "@/hooks/use-toast";

interface CanvasProps {
  isPlaying: boolean;
  onCollision: (sprite1Id: string, sprite2Id: string) => void;
}

// Track execution state for each sprite's blocks
interface SpriteExecutionState {
  [spriteId: string]: {
    [blockId: string]: {
      executed: boolean;
      repeatCount?: number;
      currentRepeat?: number;
    };
  };
}

const Canvas: React.FC<CanvasProps> = ({ isPlaying, onCollision }) => {
  const { sprites, updateSpritePosition, resetSpritePositions } = useSprites();
  const { programBlocks, swapSpriteAnimations } = useBlocks();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State to track execution of blocks to avoid continuous movement
  const [executionState, setExecutionState] = useState<SpriteExecutionState>({});
  
  // State to track collision indications
  const [collisionIndication, setCollisionIndication] = useState<{ 
    x: number, 
    y: number, 
    visible: boolean 
  }>({
    x: 0,
    y: 0,
    visible: false
  });
  
  // State to track recently collided sprites to prevent multiple swaps
  const [recentlyCollidedPairs, setRecentlyCollidedPairs] = useState<Set<string>>(new Set());
  
  // State for coordinate display
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Reset execution state when play/stop state changes
  // Using a ref to avoid the maximum update depth error
  const programBlocksRef = useRef(programBlocks);
  
  // Update the ref when programBlocks changes
  useEffect(() => {
    programBlocksRef.current = programBlocks;
  }, [programBlocks]);
  
  useEffect(() => {
    if (isPlaying) {
      // Initialize execution state for all blocks
      const newState: SpriteExecutionState = {};
      
      // Set all blocks to not executed yet
      Object.keys(programBlocksRef.current).forEach(spriteId => {
        newState[spriteId] = {};
        
        const initializeBlockState = (blocks: any[]) => {
          blocks.forEach(block => {
            newState[spriteId][block.id] = { 
              executed: false,
              repeatCount: block.params?.repeatCount || 1,
              currentRepeat: 0
            };
            
            // Initialize child blocks for control blocks
            if (block.children && block.children.length > 0) {
              initializeBlockState(block.children);
            }
          });
        };
        
        initializeBlockState(programBlocksRef.current[spriteId] || []);
      });
      
      setExecutionState(newState);
      // Clear recently collided pairs when starting the program
      setRecentlyCollidedPairs(new Set());
    } else {
      // Reset execution state when stopped
      setExecutionState({});
      // Clear collision indication
      setCollisionIndication(prev => ({ ...prev, visible: false }));
      // Clear recently collided pairs
      setRecentlyCollidedPairs(new Set());
    }
  }, [isPlaying]);
  
  // Create refs for sprites and execution state to avoid dependency issues
  const spritesRef = useRef(sprites);
  const executionStateRef = useRef(executionState);
  
  // Keep the refs updated
  useEffect(() => {
    spritesRef.current = sprites;
  }, [sprites]);
  
  useEffect(() => {
    executionStateRef.current = executionState;
  }, [executionState]);
  
  // Function to handle collision swap
  const handleCollisionSwap = useCallback((sprite1Id: string, sprite2Id: string) => {
    const sprite1 = sprites.find(s => s.id === sprite1Id);
    const sprite2 = sprites.find(s => s.id === sprite2Id);
    
    if (!sprite1 || !sprite2) return;
    
    // Create a unique ID for this collision pair
    const spritePair = [sprite1Id, sprite2Id].sort();
    const collisionPairId = `${spritePair[0]}-${spritePair[1]}`;
    
    // Only swap animations if we haven't already for this collision pair
    if (!recentlyCollidedPairs.has(collisionPairId)) {
      // Swap the animations between the two sprites
      swapSpriteAnimations(sprite1Id, sprite2Id);
      
      // Show a notification to the user
      toast({
        title: "Animations Swapped!",
        description: `${sprite1.name} and ${sprite2.name} have swapped their animation blocks.`,
        variant: "default",
      });
      
      // Mark this pair as recently collided to prevent multiple swaps
      setRecentlyCollidedPairs(prev => {
        const newSet = new Set(prev);
        newSet.add(collisionPairId);
        return newSet;
      });
      
      // Reset the execution state to run the swapped blocks
      setExecutionState(prevState => {
        const newState = { ...prevState };
        
        // Reset all blocks to not executed for both sprites
        if (newState[sprite1Id]) {
          Object.keys(newState[sprite1Id]).forEach(blockId => {
            newState[sprite1Id][blockId] = {
              ...newState[sprite1Id][blockId],
              executed: false,
              currentRepeat: 0
            };
          });
        }
        
        if (newState[sprite2Id]) {
          Object.keys(newState[sprite2Id]).forEach(blockId => {
            newState[sprite2Id][blockId] = {
              ...newState[sprite2Id][blockId],
              executed: false,
              currentRepeat: 0
            };
          });
        }
        
        return newState;
      });
    }
  }, [sprites, recentlyCollidedPairs, swapSpriteAnimations]);

  // Update sprite positions based on their running programs
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const animationIntervals: NodeJS.Timeout[] = [];
    
    // Set up animation loops for each sprite
    sprites.forEach(sprite => {
      // Get blocks assigned to this sprite
      const spriteBlocks = programBlocksRef.current[sprite.id] || [];
      
      if (spriteBlocks.length > 0) {
        const interval = setInterval(() => {
          // Skip execution if playing state has changed
          if (!isPlaying) return;
          
          // Execute sprite's program
          executeSpriteProgram(sprite.id, spriteBlocks);
          
          // Check for collisions with other sprites
          spritesRef.current.forEach(otherSprite => {
            if (otherSprite.id !== sprite.id) {
              if (detectCollision(sprite, otherSprite)) {
                // Show collision indication
                const collisionX = (sprite.x + otherSprite.x) / 2;
                const collisionY = (sprite.y + otherSprite.y) / 2;
                
                setCollisionIndication({
                  x: collisionX,
                  y: collisionY,
                  visible: true
                });
                
                onCollision(sprite.id, otherSprite.id);
                
                // Handle collision swap using our extracted function
                handleCollisionSwap(sprite.id, otherSprite.id);
                
                // Hide collision indication after 1 second
                setTimeout(() => {
                  setCollisionIndication(prev => ({ ...prev, visible: false }));
                }, 1000);
              }
            }
          });
        }, 100);
        
        animationIntervals.push(interval);
      }
    });
    
    return () => {
      // Clean up all animation intervals when the component unmounts or isPlaying changes
      animationIntervals.forEach(interval => clearInterval(interval));
    };
  }, [isPlaying, sprites, onCollision, handleCollisionSwap]);
  
  // We've removed the automatic position reset when stopping
  // This allows the sprites to maintain their positions when the program is stopped
  
  const executeSpriteProgram = (spriteId: string, blocks: any[]) => {
    const sprite = sprites.find(s => s.id === spriteId);
    if (!sprite) return;
    
    blocks.forEach(block => {
      // Skip if this block has already been executed
      if (executionState[spriteId]?.[block.id]?.executed) {
        return;
      }
      
      switch (block.type) {
        case "MOTION":
          switch (block.action) {
            case "MOVE":
              // In our coordinate system: 
              // 0° = up, 90° = right, 180° = down, 270° = left
              // Adjust 90° to point right
              const angle = sprite.direction * (Math.PI / 180); // Convert to radians
              const deltaX = Math.sin(angle) * block.params.steps;
              const deltaY = -Math.cos(angle) * block.params.steps;
              updateSpritePosition(sprite.id, sprite.x + deltaX, sprite.y + deltaY);
              
              // Mark as executed
              setExecutionState(prev => ({
                ...prev,
                [spriteId]: {
                  ...prev[spriteId],
                  [block.id]: { ...prev[spriteId]?.[block.id], executed: true }
                }
              }));
              break;
              
            case "TURN":
              const newDirection = (sprite.direction + block.params.degrees) % 360;
              updateSpritePosition(sprite.id, sprite.x, sprite.y, newDirection);
              
              // Mark as executed
              setExecutionState(prev => ({
                ...prev,
                [spriteId]: {
                  ...prev[spriteId],
                  [block.id]: { ...prev[spriteId]?.[block.id], executed: true }
                }
              }));
              break;
              
            case "GOTO":
              updateSpritePosition(sprite.id, block.params.x, block.params.y);
              
              // Mark as executed
              setExecutionState(prev => ({
                ...prev,
                [spriteId]: {
                  ...prev[spriteId],
                  [block.id]: { ...prev[spriteId]?.[block.id], executed: true }
                }
              }));
              break;
          }
          break;
          
        case "CONTROL":
          if (block.action === "REPEAT" && block.children) {
            const blockState = executionState[spriteId]?.[block.id];
            const repeatCount = block.params.repeatCount || 1;
            const currentRepeat = blockState?.currentRepeat || 0;
            
            if (currentRepeat < repeatCount) {
              // Execute children blocks
              executeSpriteProgram(spriteId, block.children);
              
              // Increment repeat counter
              setExecutionState(prev => ({
                ...prev,
                [spriteId]: {
                  ...prev[spriteId],
                  [block.id]: { 
                    ...prev[spriteId]?.[block.id], 
                    currentRepeat: currentRepeat + 1,
                    executed: currentRepeat + 1 >= repeatCount
                  }
                }
              }));
            }
          }
          break;
      }
    });
  };

  // Convert canvas coordinates to CSS pixel positions
  const getPositionStyle = (x: number, y: number, rotation: number = 0) => {
    const canvasWidth = canvasRef.current?.clientWidth || 400;
    const canvasHeight = canvasRef.current?.clientHeight || 300;
    
    // Convert coordinates where 0,0 is center of canvas
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const pixelX = centerX + x;
    const pixelY = centerY - y; // Y is inverted in CSS
    
    return {
      left: `${pixelX}px`,
      top: `${pixelY}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`
    };
  };

  // Get current position display
  const getMouseCoordinates = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Calculate position relative to center
    const x = Math.round(e.clientX - rect.left - canvasWidth / 2);
    const y = Math.round(canvasHeight / 2 - (e.clientY - rect.top)); // Invert Y
    
    return { x, y };
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition(getMouseCoordinates(e));
  };

  return (
    <div id="canvas-area" className="bg-white border border-gray-200 rounded-lg p-4 relative">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Canvas</h3>
      <div 
        ref={canvasRef} 
        className="sprite-canvas border border-gray-200 rounded-lg relative h-72 overflow-hidden"
        style={{
          backgroundSize: "20px 20px",
          backgroundImage: "linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)"
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0zM12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11z"></path>
          </svg>
        </div>
        
        {/* Position coordinates display */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-gray-800 bg-opacity-70 text-white text-xs rounded">
          <span className="mr-2">x: {mousePosition.x}</span>
          <span>y: {mousePosition.y}</span>
        </div>
        
        {/* Render all sprites */}
        {sprites.map((sprite) => (
          <div 
            key={sprite.id}
            id={`sprite-${sprite.id}`}
            className="absolute"
            style={getPositionStyle(sprite.x, sprite.y, sprite.direction - 90)}
          >
            <div className="sprite-image-container relative">
              <img 
                src="/assets/scratch-cat.png" 
                alt={sprite.name}
                className="w-16 h-16 object-contain"
                style={{ 
                  filter: sprite.id !== "sprite-1" ? `hue-rotate(${parseInt(sprite.color.slice(1), 16) % 360}deg)` : "" 
                }}
              />
              <div className="absolute -bottom-2 left-0 right-0 text-center">
                <span className="text-xs font-medium bg-white bg-opacity-70 px-1 rounded">{sprite.name}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Collision indicator */}
        {collisionIndication.visible && (
          <div 
            id="collision-indicator" 
            className="absolute bg-yellow-300 bg-opacity-50 text-yellow-800 font-medium text-xs px-2 py-1 rounded-full animate-pulse"
            style={getPositionStyle(collisionIndication.x, collisionIndication.y)}
          >
            Collision!
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
