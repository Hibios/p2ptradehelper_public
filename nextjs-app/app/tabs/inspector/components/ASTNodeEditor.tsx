'use client';

import { useState } from 'react';
import { ASTNode } from '../utils/types';

interface ASTNodeEditorProps {
  node: ASTNode;
  onUpdate: (updates: Partial<ASTNode>) => void;
}

export default function ASTNodeEditor({ node, onUpdate }: ASTNodeEditorProps) {
  const [description, setDescription] = useState(node.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate({ description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(node.description || '');
    setIsEditing(false);
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h3 className="font-bold text-lg mb-4">Node Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node ID
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded border text-sm font-mono">
            {node.uuid}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Type
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded border text-sm">
            {node.type}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded border text-sm">
            {node.start} - {node.end}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter description for this AST node..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group">
              <div className="px-3 py-2 bg-gray-50 rounded border text-sm min-h-[60px]">
                {description || 'No description'}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Description
              </button>
            </div>
          )}
        </div>

        {node.text && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Code
            </label>
            <pre className="px-3 py-2 bg-gray-900 text-gray-100 rounded text-sm overflow-auto">
              {node.text}
            </pre>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Properties
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded border text-sm">
            <pre>{JSON.stringify(node.properties || {}, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}