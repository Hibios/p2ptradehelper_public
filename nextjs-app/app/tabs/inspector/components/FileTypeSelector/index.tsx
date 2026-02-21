'use client';

import { useState } from "react";

interface FileTypeSelectorProps {
  projectPath: string;
  selectedFolders?: string[];
  onSelect: (items: string[]) => void;
  mode: 'folders' | 'fileTypes';
}

export function FileTypeSelector({ 
  projectPath, 
  selectedFolders = [], 
  onSelect, 
  mode 
}: FileTypeSelectorProps) {
  const items = mode === 'folders' 
    ? ['app', 'components', 'lib', 'utils', 'styles', 'public']
    : ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'];
  
  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelected(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleContinue = () => {
    onSelect(selected);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Select {mode === 'folders' ? 'Folders' : 'File Types'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {items.map(item => (
          <button
            key={item}
            onClick={() => toggleItem(item)}
            className={`p-4 rounded-lg border transition-all
              ${selected.includes(item) 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue ({selected.length} selected)
      </button>
    </div>
  );
}