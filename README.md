# Visual Programming Environment

A drag-and-drop visual programming environment inspired by MIT Scratch, allowing users to create animations and interactive programs without writing code.

## Features

- **Intuitive Block-Based Programming**: Drag and drop blocks to build programs
- **Multiple Block Types**:
  - **Motion Blocks**: Move and rotate sprites
  - **Control Blocks**: Create loops and repeat actions
  - **Look Blocks**: Display speech bubbles
- **Interactive Canvas**: See sprites move in real-time
- **Sprite System**: Create multiple sprites with different colors
- **Collision Detection**: Detect when sprites touch each other
- **Coordinate System**: Easy-to-use coordinate system for positioning

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser to the displayed URL

## How To Use

### Sprites
- The application starts with a default cat sprite
- You can add multiple sprites with different colors
- Each sprite has its own set of blocks

### Building Programs
1. Select a sprite from the sprite list
2. Drag blocks from the left panel to the program area
3. Configure block parameters (steps, degrees, messages)
4. Order matters! Blocks execute from top to bottom

### Running Programs
- Click the **Play** button to start execution
- Click **Stop** to pause execution
- Click **Reset** to return sprites to their starting positions

### Block Types

#### Motion Blocks (Blue)
- **Move**: Moves the sprite forward in its current direction
- **Turn**: Changes the sprite's direction
- **Go to**: Teleports the sprite to specific coordinates

#### Control Blocks (Yellow)
- **Repeat**: Executes contained blocks multiple times

#### Look Blocks (Purple)
- **Say**: Displays a speech bubble with custom text

### Example Program
1. Add a "Repeat 4 times" block
2. Inside the repeat block, add:
   - "Move 50 steps"
   - "Turn 90 degrees"
3. Add a "Say Hello!" block at the end
4. Press Play to watch the sprite move in a square while saying "Hello!"

## Technical Details

This project is built with:
- React for component-based UI
- TypeScript for type safety
- HTML5 Canvas for rendering
- Context API for state management

## Project Structure

- `client/src/components/blocks/`: Contains the block components
- `client/src/components/workspace/`: Contains the canvas and program area
- `client/src/components/sprites/`: Contains sprite-related components
- `client/src/contexts/`: Contains the application's state management
- `client/src/utils/`: Contains utility functions and type definitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.