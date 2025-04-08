import React, { useRef, useEffect, useState } from "react";
import { useSprites } from "@/contexts/SpritesContext";
import { useBlocks } from "@/contexts/BlocksContext";
import { detectCollision } from "@/utils/collisionDetection";

interface CanvasProps {
  isPlaying: boolean;
  onCollision: (sprite1Id: string, sprite2Id: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ isPlaying, onCollision }) => {
  const { sprites, updateSpritePosition } = useSprites();
  const { programBlocks } = useBlocks();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [collisionIndication, setCollisionIndication] = useState<{ x: number, y: number, visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });
  
  // Update sprite positions based on their running programs
  useEffect(() => {
    if (!isPlaying) {
      setCollisionIndication({ ...collisionIndication, visible: false });
      return;
    }

    const animationIntervals: NodeJS.Timeout[] = [];
    
    // Set up animation loops for each sprite
    sprites.forEach(sprite => {
      // Get blocks assigned to this sprite
      const spriteBlocks = programBlocks[sprite.id] || [];
      
      if (spriteBlocks.length > 0) {
        const interval = setInterval(() => {
          // Execute sprite's program
          executeSpriteProgram(sprite.id, spriteBlocks);
          
          // Check for collisions with other sprites
          sprites.forEach(otherSprite => {
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
                
                // Hide collision indication after 1 second
                setTimeout(() => {
                  setCollisionIndication({ ...collisionIndication, visible: false });
                }, 1000);
              }
            }
          });
        }, 100);
        
        animationIntervals.push(interval);
      }
    });
    
    return () => {
      // Clean up all animation intervals
      animationIntervals.forEach(interval => clearInterval(interval));
    };
  }, [isPlaying, sprites, programBlocks, onCollision]);
  
  const executeSpriteProgram = (spriteId: string, blocks: any[]) => {
    const sprite = sprites.find(s => s.id === spriteId);
    if (!sprite) return;
    
    blocks.forEach(block => {
      switch (block.type) {
        case "MOTION":
          switch (block.action) {
            case "MOVE":
              const angle = sprite.direction * (Math.PI / 180); // Convert to radians
              const deltaX = Math.cos(angle) * block.params.steps;
              const deltaY = Math.sin(angle) * block.params.steps;
              updateSpritePosition(sprite.id, sprite.x + deltaX, sprite.y - deltaY);
              break;
            case "TURN":
              const newDirection = (sprite.direction + block.params.degrees) % 360;
              updateSpritePosition(sprite.id, sprite.x, sprite.y, newDirection);
              break;
            case "GOTO":
              updateSpritePosition(sprite.id, block.params.x, block.params.y);
              break;
          }
          break;
        case "CONTROL":
          if (block.action === "REPEAT" && block.children) {
            // For simplicity, we just execute children blocks once per animation frame
            // In a complete implementation, we'd track repetition count
            executeSpriteProgram(spriteId, block.children);
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
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0zM12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11z"></path>
          </svg>
        </div>
        
        {/* Position coordinates display */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-gray-800 bg-opacity-70 text-white text-xs rounded">
          <span className="mr-2">x: 0</span>
          <span>y: 0</span>
        </div>
        
        {/* Render all sprites */}
        {sprites.map((sprite) => (
          <div 
            key={sprite.id}
            id={`sprite-${sprite.id}`}
            className="absolute"
            style={getPositionStyle(sprite.x, sprite.y, sprite.direction - 90)}
          >
            <div 
              className="w-12 h-12 rounded-full shadow-md flex items-center justify-center"
              style={{ backgroundColor: sprite.color }}
            >
              <span className="text-white font-bold">{sprite.name.charAt(0)}</span>
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
