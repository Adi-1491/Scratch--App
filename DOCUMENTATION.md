# Visual Programming Environment - User Guide

## Introduction

Welcome to the Visual Programming Environment! This application lets you create animations and interactive programs without writing any code. Instead, you use colorful blocks that you can drag, drop, and connect together.

This guide explains how to use the application in simple, easy-to-understand terms.

## Basic Concepts

### Sprites

Sprites are the characters or objects that appear on the screen. Think of them as the actors in your animation.

- Each sprite has a **position** (where it is on the screen)
- Each sprite has a **direction** (which way it's facing)
- Each sprite has a **color** (to tell them apart)

### Blocks

Blocks are the building pieces of your program. They snap together like puzzle pieces to tell the sprites what to do.

There are three types of blocks:

1. **Motion Blocks** (Blue): Make sprites move and turn
2. **Control Blocks** (Yellow): Create loops and repeated actions
3. **Look Blocks** (Purple): Make sprites display speech bubbles

### The Canvas

The Canvas is the white area where your sprites appear and move around. It uses a coordinate system where:

- The center of the canvas is position (0, 0)
- Moving right increases the X coordinate
- Moving up increases the Y coordinate

## How to Use the Application

### Step 1: Get Familiar with the Interface

The application has four main areas:

1. **Block Palette** (Left): Where you find blocks you can use
2. **Program Area** (Middle): Where you build your program by connecting blocks
3. **Canvas** (Right): Where you see your sprites move and interact
4. **Sprite List** (Bottom): Where you manage your sprites

### Step 2: Create Your Program

1. **Add blocks to your program**:
   - Click and drag a block from the Block Palette
   - Drop it into the Program Area

2. **Configure your blocks**:
   - Click on the numbers or text within blocks to change them
   - For Motion blocks, change the steps or degrees
   - For Control blocks, change the repeat count
   - For Look blocks, change the message text

3. **Order matters!** Blocks execute from top to bottom

### Step 3: Run Your Program

Use the buttons at the top of the screen:

- **Play**: Start running your program
- **Stop**: Pause the execution
- **Reset**: Return all sprites to their starting positions

### Step 4: Watch and Iterate

As your program runs, watch how your sprites move and interact. If things don't work as expected, you can:

- Stop the program
- Make changes to your blocks
- Run it again

## Block Reference Guide

### Motion Blocks (Blue)

#### Move
- **What it does**: Moves the sprite forward in its current direction
- **Parameter**: Number of steps to move
- **Example**: "Move 10 steps" makes the sprite go forward 10 units

#### Turn
- **What it does**: Rotates the sprite
- **Parameter**: Number of degrees to turn
- **Example**: "Turn 90 degrees" makes the sprite turn clockwise by 90 degrees

#### Go To
- **What it does**: Teleports the sprite to a specific position
- **Parameters**: X and Y coordinates
- **Example**: "Go to x: 50, y: 30" places the sprite at that position

### Control Blocks (Yellow)

#### Repeat
- **What it does**: Runs the blocks inside it multiple times
- **Parameter**: Number of times to repeat
- **Example**: "Repeat 5 times" will run all blocks inside it 5 times in sequence

### Look Blocks (Purple)

#### Say
- **What it does**: Displays a speech bubble above the sprite
- **Parameter**: Text message to display
- **Example**: "Say Hello!" shows a speech bubble with "Hello!" above the sprite

## Example Projects

### 1. Simple Square

To make a sprite move in a square pattern:

1. Add a "Repeat 4 times" block
2. Inside the repeat block, add:
   - "Move 50 steps"
   - "Turn 90 degrees"
3. Press Play

### 2. Dancing Sprites

To make sprites "dance" around each other:

1. Create two sprites
2. For Sprite 1:
   - Add "Repeat 36 times"
   - Inside the repeat, add:
     - "Move 5 steps"
     - "Turn 10 degrees"
3. For Sprite 2:
   - Add "Repeat 36 times"
   - Inside the repeat, add:
     - "Move 5 steps"
     - "Turn -10 degrees"
4. Press Play to see them circle around each other

### 3. Talking Sprites

To make sprites have a conversation:

1. Create two sprites
2. For Sprite 1:
   - Add "Say Hello!"
   - Add "Move 30 steps"
3. For Sprite 2:
   - Add "Say Hi there!"
   - Add "Move -30 steps"
4. Press Play to see them greet each other and move

## Tips and Tricks

1. **Use the coordinate display** at the bottom of the canvas to help position sprites
2. **Start with simple programs** and gradually add more complexity
3. **Sprites will collide** when they touch each other, and the app will show a "Collision!" indicator
4. **Speech bubbles** stay visible until you stop the program or the sprite says something new
5. **Reset positions** if your sprites move off-screen by clicking the Reset button

## Troubleshooting

- **Sprites not moving?** Make sure you've added Motion blocks to your program
- **Program stops too quickly?** Add more blocks or use Repeat blocks to make longer animations
- **Can't see the sprite?** It might have moved off-screen. Click Reset to bring it back
- **Blocks not connecting?** Make sure you're dropping them in the right place in the Program Area

## Conclusion

The Visual Programming Environment is designed to make programming fun and accessible. By using blocks instead of text-based code, you can focus on the logic and creativity of programming without getting caught up in syntax details.

Have fun creating amazing animations and interactive programs!