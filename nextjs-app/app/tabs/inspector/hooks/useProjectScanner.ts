'use client';

import { useState } from 'react';

export interface ProjectInfo {
  folders: string[];
  fileStats: Map<string, number>;
}

export function useProjectScanner() {
  const [isLoading, setIsLoading] = useState(false);

  const scanProject = async (projectPath: string): Promise<ProjectInfo> => {
    setIsLoading(true);
    
    try {
      // В браузерной среде делаем запрос к API
      const response = await fetch('/api/project/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: projectPath }),
      });
      
      if (!response.ok) throw new Error('Failed to scan project');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { scanProject, isLoading };
}