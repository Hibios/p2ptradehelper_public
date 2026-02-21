'use client';

import { useState, useEffect } from 'react';
import { FileTreeNode } from '../../utils/types';

interface FileExplorerProps {
  initialPath: string;
  onFileSelect: (filePath: string) => void;
}

export default function FileExplorer({ initialPath, onFileSelect }: FileExplorerProps) {
  const [tree, setTree] = useState<FileTreeNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFileTree(initialPath);
  }, [initialPath]);

  const loadFileTree = async (path: string) => {
    const response = await fetch('/api/project/inspector/explorer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    const data = await response.json();
    setTree(data.tree);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (nodes: FileTreeNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div 
          className={`flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer
            ${node.type === 'file' ? 'pl-4' : ''}`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              <span className="mr-2">
                {expandedFolders.has(node.path) ? '📂' : '📁'}
              </span>
              <span className="font-medium">{node.name}</span>
            </>
          ) : (
            <>
              <span className="mr-2">📄</span>
              <span>{node.name}</span>
            </>
          )}
        </div>
        
        {node.type === 'folder' && 
         expandedFolders.has(node.path) && 
         node.children && (
          <div>
            {renderTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg">Project Files</h3>
        <p className="text-sm text-gray-600">{initialPath}</p>
      </div>
      {renderTree(tree)}
    </div>
  );
}