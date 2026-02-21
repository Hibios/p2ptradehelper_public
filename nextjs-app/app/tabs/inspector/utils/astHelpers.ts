// app/tabs/inspector/utils/astHelpers.ts
import { ASTNode } from './types';

export function updateASTNode(
  nodes: ASTNode[],
  nodeId: string,
  updates: Partial<ASTNode>
): ASTNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        ...updates,
        children: node.children ? updateASTNode(node.children, nodeId, updates) : undefined
      };
    }
    
    if (node.children) {
      return {
        ...node,
        children: updateASTNode(node.children, nodeId, updates)
      };
    }
    
    return node;
  });
}

export function toggleASTNode(
  nodes: ASTNode[],
  nodeId: string
): ASTNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        collapsed: !node.collapsed
      };
    }
    
    if (node.children) {
      return {
        ...node,
        children: toggleASTNode(node.children, nodeId)
      };
    }
    
    return node;
  });
}

export function findASTNode(
  nodes: ASTNode[],
  nodeId: string
): ASTNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    
    if (node.children) {
      const found = findASTNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}