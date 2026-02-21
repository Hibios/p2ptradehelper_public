'use client';

import { useState, useEffect } from 'react';
import FileExplorer from './components/FileExplorer';
import ASTViewer from './components/ASTViewer';
import ASTNodeEditor from './components/ASTNodeEditor';
import { ASTNode } from './utils/types';
import { parseFileToAST } from './utils/astParser';
import { updateASTNode } from './utils/astHelpers';

export default function ASTInspector() {
  const [projectPath, setProjectPath] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [astData, setAstData] = useState<ASTNode[] | null>(null);
  const [selectedNode, setSelectedNode] = useState<ASTNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // При монтировании пытаемся получить путь к текущему проекту
  useEffect(() => {
    // В браузерной среде мы не можем получить абсолютный путь напрямую
    // Предложим пользователю ввести путь
    const savedPath = localStorage.getItem('ast-inspector-project-path');
    if (savedPath) {
      setProjectPath(savedPath);
    }
  }, []);

  const handleProjectSelect = (path: string) => {
    setProjectPath(path);
    localStorage.setItem('ast-inspector-project-path', path);
    setSelectedFile(null);
    setAstData(null);
    setSelectedNode(null);
  };

  const handleFileSelect = async (filePath: string) => {
    setIsLoading(true);
    try {
      setSelectedFile(filePath);
      const ast = await parseFileToAST(filePath);
      setAstData(ast);
      setSelectedNode(null);
    } catch (error) {
      console.error('Error parsing file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeSelect = (node: ASTNode) => {
    setSelectedNode(node);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<ASTNode>) => {
    if (astData) {
      const updatedAST = updateASTNode(astData, nodeId, updates);
      setAstData(updatedAST);
      
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, ...updates });
      }
    }
  };

  // Если проект не выбран, показываем форму выбора
  if (!projectPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AST Inspector</h1>
          <p className="text-gray-600 mb-6">
            Select a project folder to analyze its Abstract Syntax Tree
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Path
              </label>
              <input
                type="text"
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.value)}
                placeholder="A:\Projects\YourProject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the absolute path to your project
              </p>
            </div>
            
            <button
              onClick={() => handleProjectSelect(projectPath)}
              disabled={!projectPath.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4">
      {/* Шапка с информацией о проекте */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Project: {projectPath.split('/').pop()}</h2>
            <p className="text-sm text-gray-600 truncate">{projectPath}</p>
          </div>
          <button
            onClick={() => {
              setProjectPath('');
              localStorage.removeItem('ast-inspector-project-path');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Change Project
          </button>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="flex-1 flex gap-4">
        {/* Левая колонка - дерево файлов */}
        <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden">
          <FileExplorer 
            initialPath={projectPath}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Правая колонка - AST и редактор */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden mb-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Parsing file...</p>
                </div>
              </div>
            ) : astData ? (
              <ASTViewer 
                data={astData} 
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNode?.id}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🌳</div>
                  <h3 className="text-lg font-medium mb-2">No AST Data</h3>
                  <p>Select a file from the explorer to view its Abstract Syntax Tree</p>
                </div>
              </div>
            )}
          </div>

          {/* Панель редактирования выбранного узла */}
          <div className="h-1/3 bg-white rounded-lg shadow overflow-hidden">
            {selectedNode ? (
              <ASTNodeEditor 
                node={selectedNode}
                onUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-3">📝</div>
                  <p>Select an AST node to edit its properties</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}