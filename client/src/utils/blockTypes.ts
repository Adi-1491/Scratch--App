export enum BlockType {
  MOTION = "MOTION",
  CONTROL = "CONTROL",
  LOOK = "LOOK"
}

export enum MotionBlockAction {
  MOVE = "MOVE",
  TURN = "TURN",
  GOTO = "GOTO"
}

export enum ControlBlockAction {
  REPEAT = "REPEAT"
}

export enum LookBlockAction {
  SAY = "SAY"
}

export interface BlockParams {
  steps?: number;
  degrees?: number;
  x?: number;
  y?: number;
  repeatCount?: number;
  message?: string;
  seconds?: number;
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
  children?: (MotionBlock | ControlBlock | LookBlock)[];
}

export interface LookBlock {
  type: BlockType.LOOK;
  action: LookBlockAction;
  params: BlockParams;
}

export type Block = MotionBlock | ControlBlock | LookBlock;
