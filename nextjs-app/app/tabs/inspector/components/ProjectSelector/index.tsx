'use client';

import { useState } from 'react';

interface ProjectSelectorProps {
  onSelect: (path: string) => void;
}

export function ProjectSelector({ onSelect }: ProjectSelectorProps) {
  const [path, setPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) {
      onSelect(path.trim());
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Project</h2>
        <p className="text-gray-600">Choose a NextJS project to analyze its AST</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Path
          </label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/Users/username/projects/nextjs-app"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all"
            autoFocus
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter the absolute path to your NextJS project folder
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              // В браузере мы не можем напрямую выбрать папку
              // Вместо этого предлагаем ввести путь
              alert('For security reasons, please enter the path manually. In a desktop app, you could use a folder picker.');
            }}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg 
                     hover:border-gray-400 transition-colors"
          >
            Browse...
          </button>
          
          <button
            type="submit"
            disabled={!path.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}