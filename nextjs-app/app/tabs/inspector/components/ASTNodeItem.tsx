'use client';

import { ASTNode } from '../utils/types';

interface ASTNodeItemProps {
  node: ASTNode;
  depth: number;
  isSelected: boolean;
  hasChildren: boolean; // Теперь всегда boolean
  onToggle: () => void;
  onClick: () => void;
}

// Внутри компонента исправляем условие:
export default function ASTNodeItem({
  node,
  depth,
  isSelected,
  hasChildren,
  onToggle,
  onClick
}: ASTNodeItemProps) {
  const indent = depth * 20;
  
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'ImportDeclaration': return '📦';
      case 'FunctionDeclaration': return '🔧';
      case 'VariableDeclaration': return '📝';
      case 'JSXElement': return '⚛️';
      case 'ClassDeclaration': return '🏛️';
      case 'ExportDeclaration': return '📤';
      default: return '📌';
    }
  };

  return (
    <div
      className={`flex items-center px-2 py-1 rounded transition-colors cursor-pointer
        ${isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'}`}
      style={{ marginLeft: `${indent}px` }}
      onClick={onClick}
    >
      {/* Исправляем условие отображения кнопки сворачивания */}
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mr-2 w-4 h-4 flex items-center justify-center text-xs"
        >
          {node.collapsed ? '▶' : '▼'}
        </button>
      ) : (
        <div className="mr-2 w-4 h-4"></div> // Пустой спейсер для выравнивания
      )}
      
      <span className="mr-2">{getNodeIcon(node.type)}</span>
      
      <div className="flex-1">
        <div className="font-medium">
          {node.type}
          {node.name && <span className="ml-2 text-blue-600">({node.name})</span>}
        </div>
        
        {node.text && (
          <div className="text-sm text-gray-600 truncate max-w-md">
            {node.text}
          </div>
        )}
        
        {node.description && (
          <div className="text-xs text-gray-500 italic">
            {node.description}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400">
        {node.start}:{node.end}
      </div>
    </div>
  );
}