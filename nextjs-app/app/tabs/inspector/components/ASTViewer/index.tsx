'use client';

import { useState } from 'react';
import { ASTNode } from '../../utils/types';
import { toggleASTNode } from '../../utils/astHelpers';
import ASTNodeItem from '../ASTNodeItem';

interface ASTViewerProps {
  data: ASTNode[];
  onNodeSelect: (node: ASTNode) => void;
  selectedNodeId?: string;
}

export default function ASTViewer({ data, onNodeSelect, selectedNodeId }: ASTViewerProps) {
  const [astData, setAstData] = useState<ASTNode[]>(data);

  const toggleNode = (nodeId: string) => {
    const updatedAST = toggleASTNode(astData, nodeId);
    setAstData(updatedAST);
  };

  const renderNode = (node: ASTNode, depth = 0) => {
    const isSelected = node.id === selectedNodeId;
    const hasChildren = !!(node.children && node.children.length > 0); // Преобразуем в boolean

    return (
      <div key={node.uuid}>
        <ASTNodeItem
          node={node}
          depth={depth}
          isSelected={isSelected}
          hasChildren={hasChildren}
          onToggle={() => toggleNode(node.id)}
          onClick={() => onNodeSelect(node)}
        />
        
        {!node.collapsed && hasChildren && node.children && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg">AST Tree</h3>
        <p className="text-sm text-gray-600">
          {astData.length} root nodes
        </p>
      </div>
      
      <div className="space-y-1">
        {astData.map(node => renderNode(node))}
      </div>
    </div>
  );
}