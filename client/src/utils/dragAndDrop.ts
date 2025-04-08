/**
 * Helper functions for drag and drop functionality
 */

// Creates a custom drag ghost element for a better drag visual
export function createDragGhost(element: HTMLElement): HTMLElement {
  const ghost = element.cloneNode(true) as HTMLElement;
  ghost.style.position = "absolute";
  ghost.style.top = "-1000px";
  ghost.style.opacity = "0.8";
  
  document.body.appendChild(ghost);
  return ghost;
}

// Removes the drag ghost element
export function removeDragGhost(ghost: HTMLElement): void {
  if (ghost.parentNode) {
    ghost.parentNode.removeChild(ghost);
  }
}

// Position the drag ghost at the mouse position
export function positionDragGhost(ghost: HTMLElement, x: number, y: number): void {
  ghost.style.top = `${y}px`;
  ghost.style.left = `${x}px`;
}
