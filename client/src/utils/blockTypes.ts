export enum BlockType {
  MOTION = "MOTION",
  CONTROL = "CONTROL"
}

export enum MotionBlockAction {
  MOVE = "MOVE",
  TURN = "TURN",
  GOTO = "GOTO"
}

export enum ControlBlockAction {
  REPEAT = "REPEAT"
}

export interface BlockParams {
  steps?: number;
  degrees?: number;
  x?: number;
  y?: number;
  repeatCount?: number;
}

export interface MotionBlock {
  type: BlockType.MOTION;
  action: MotionBlockAction;
  params: BlockParams;
}

export interface ControlBlock {
  type: BlockType.CONTROL;
  action: ControlBlockAction;
  params: BlockParams;
  children?: (MotionBlock | ControlBlock)[];
}

export type Block = MotionBlock | ControlBlock;
