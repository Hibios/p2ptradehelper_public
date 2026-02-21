'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, ChevronDown, ChevronRight, Save, X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Типы для AST групп
interface ASTGroup {
  id: string;
  name: string;
  type: string;
  description: string;
  codeSnippet: string;
  lineStart: number;
  lineEnd: number;
  isExpanded: boolean;
  metadata?: Record<string, any>;
}

interface FileInspectorProps {
  filePath?: string;
  onClose?: () => void;
}

// Временные данные для демонстрации
const DEMO_AST_GROUPS: ASTGroup[] = [
  {
    id: uuidv4(),
    name: 'Импорты',
    type: 'imports',
    description: 'Все импорты React и сторонних библиотек',
    codeSnippet: `import React from 'react';\nimport { useState } from 'react';`,
    lineStart: 1,
    lineEnd: 3,
    isExpanded: false,
  },
  {
    id: uuidv4(),
    name: 'Компонент',
    type: 'component',
    description: 'Основной функциональный компонент',
    codeSnippet: `const MyComponent: React.FC = () => {\n  const [state, setState] = useState();\n  return <div>Hello</div>;\n};`,
    lineStart: 5,
    lineEnd: 10,
    isExpanded: false,
  },
  {
    id: uuidv4(),
    name: 'Стили',
    type: 'styles',
    description: 'Tailwind CSS классы и inline стили',
    codeSnippet: `className="container mx-auto p-4"\nstyle={{ color: 'red' }}`,
    lineStart: 12,
    lineEnd: 15,
    isExpanded: false,
  },
  {
    id: uuidv4(),
    name: 'Эффекты',
    type: 'effects',
    description: 'React хуки useEffect',
    codeSnippet: `useEffect(() => {\n  console.log('Mounted');\n  return () => console.log('Unmounted');\n}, []);`,
    lineStart: 17,
    lineEnd: 22,
    isExpanded: false,
  },
];

const InspectorA: React.FC<FileInspectorProps> = ({ filePath: initialFilePath, onClose }) => {
  const [filePath, setFilePath] = useState(initialFilePath || '');
  const [fileContent, setFileContent] = useState('');
  const [astGroups, setAstGroups] = useState<ASTGroup[]>(DEMO_AST_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<ASTGroup | null>(DEMO_AST_GROUPS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(!initialFilePath);

  // Загрузка файла (демо-версия)
  const loadFileContent = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь был бы fetch к API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Демо-контент
      const demoContent = `import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const InspectorA: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Inspector</h1>
      <p>This is a demo component</p>
    </div>
  );
};

export default InspectorA;`;
      
      setFileContent(demoContent);
      setShowFilePicker(false);
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Обработчик выбора файла
  const handleFileSelect = () => {
    if (filePath.trim()) {
      loadFileContent(filePath);
    }
  };

  // Обработчик клика по группе
  const handleGroupClick = (group: ASTGroup) => {
    setSelectedGroup(group);
  };

  // Переключение состояния развертывания группы
  const toggleGroupExpansion = (groupId: string) => {
    setAstGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isExpanded: !group.isExpanded }
        : group
    ));
  };

  // Обновление выбранной группы
  const updateSelectedGroup = (updates: Partial<ASTGroup>) => {
    if (!selectedGroup) return;
    
    const updatedGroup = { ...selectedGroup, ...updates };
    setSelectedGroup(updatedGroup);
    
    setAstGroups(prev => prev.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
  };

  // Добавление новой группы
  const handleAddGroup = () => {
    const newGroup: ASTGroup = {
      id: uuidv4(),
      name: 'Новая группа',
      type: 'custom',
      description: 'Добавьте описание',
      codeSnippet: '// Пример кода',
      lineStart: 1,
      lineEnd: 1,
      isExpanded: true,
    };
    
    setAstGroups(prev => [...prev, newGroup]);
    setSelectedGroup(newGroup);
  };

  // Удаление группы
  const handleDeleteGroup = (groupId: string) => {
    setAstGroups(prev => prev.filter(group => group.id !== groupId));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(astGroups.length > 1 ? astGroups[1] : null);
    }
  };

  // Сохранение изменений
  const handleSave = () => {
    alert('Изменения сохранены!');
    // В реальном приложении здесь был бы вызов API
  };

  // Сгруппированные группы по типу для лучшей визуализации
  const groupedByType = useMemo(() => {
    const groups: Record<string, ASTGroup[]> = {};
    astGroups.forEach(group => {
      if (!groups[group.type]) {
        groups[group.type] = [];
      }
      groups[group.type].push(group);
    });
    return groups;
  }, [astGroups]);

  // Рендер содержимого файла с подсветкой строк
  const renderFileContent = () => {
    if (!fileContent) return null;
    
    const lines = fileContent.split('\n');
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const groupForLine = astGroups.find(group => 
        lineNumber >= group.lineStart && lineNumber <= group.lineEnd
      );
      
      return (
        <div 
          key={index}
          className={`flex hover:bg-gray-50 ${
            groupForLine ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="w-16 text-right pr-3 text-gray-500 select-none">
            {lineNumber}
          </div>
          <div className="flex-1 font-mono text-sm">
            {line || ' '}
          </div>
        </div>
      );
    });
  };

  // Если не выбран файл, показываем форму выбора
  if (showFilePicker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">TSX Inspector</h1>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Выберите .tsx файл для AST анализа. Файл будет разбит на логические группы с возможностью редактирования метаданных.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Функционал:</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Группировка кода по AST элементам</li>
                <li>Сворачивание/разворачивание групп</li>
                <li>Редактирование описания групп</li>
                <li>Управление метаданными</li>
                <li>Подсветка синтаксиса</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Абсолютный путь к .tsx файлу
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="Например: /home/user/project/components/MyComponent.tsx"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFileSelect}
                  disabled={!filePath.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Загрузка...' : 'Анализировать'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                В демо-версии будет загружен пример компонента
              </p>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                Или перетащите файл .tsx сюда
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Основной интерфейс инспектора
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilePicker(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">{filePath || 'Выберите файл'}</span>
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <div className="text-sm text-gray-500">
                {astGroups.length} групп · {fileContent.split('\n').length} строк
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddGroup}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить группу
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - AST группы */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">AST Группы</h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {Object.entries(groupedByType).map(([type, groups]) => (
                <div key={type} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {type}
                  </h3>
                  <div className="space-y-2">
                    {groups.map(group => (
                      <div
                        key={group.id}
                        onClick={() => handleGroupClick(group)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedGroup?.id === group.id
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleGroupExpansion(group.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {group.isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <span className="font-medium text-gray-800">{group.name}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id);
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {group.isExpanded && (
                          <div className="ml-6 mt-2 space-y-2">
                            <p className="text-sm text-gray-600">{group.description}</p>
                            <div className="text-xs font-mono bg-gray-800 text-gray-100 p-2 rounded">
                              {group.codeSnippet.split('\n')[0]}
                              {group.codeSnippet.split('\n').length > 1 && '...'}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Строки: {group.lineStart}-{group.lineEnd}</span>
                              <span>UUID: {group.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Центральная колонка - содержимое файла */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-gray-100 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-mono text-sm">file-content.tsx</span>
              </div>
              <div className="text-sm text-gray-400">
                TypeScript · React
              </div>
            </div>
            
            <div className="p-1">
              <div className="font-mono text-sm leading-relaxed bg-gray-50">
                {renderFileContent()}
              </div>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-500">
              Всего строк: {fileContent.split('\n').length} | 
              Групп: {astGroups.length} | 
              {selectedGroup && ` Выбрано: ${selectedGroup.name}`}
            </div>
          </div>
        </div>

        {/* Правая колонка - редактирование группы */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {selectedGroup ? `Редактирование: ${selectedGroup.name}` : 'Выберите группу'}
            </h2>
            
            {selectedGroup ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название группы
                  </label>
                  <input
                    type="text"
                    value={selectedGroup.name}
                    onChange={(e) => updateSelectedGroup({ name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип группы
                  </label>
                  <select
                    value={selectedGroup.type}
                    onChange={(e) => updateSelectedGroup({ type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="imports">Импорты</option>
                    <option value="component">Компонент</option>
                    <option value="styles">Стили</option>
                    <option value="effects">Эффекты</option>
                    <option value="custom">Пользовательский</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={selectedGroup.description}
                    onChange={(e) => updateSelectedGroup({ description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Код (первые строки)
                  </label>
                  <textarea
                    value={selectedGroup.codeSnippet}
                    onChange={(e) => updateSelectedGroup({ codeSnippet: e.target.value })}
                    rows={6}
                    className="w-full font-mono text-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Начальная строка
                    </label>
                    <input
                      type="number"
                      value={selectedGroup.lineStart}
                      onChange={(e) => updateSelectedGroup({ lineStart: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Конечная строка
                    </label>
                    <input
                      type="number"
                      value={selectedGroup.lineEnd}
                      onChange={(e) => updateSelectedGroup({ lineEnd: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UUID группы
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm font-mono">
                      {selectedGroup.id}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedGroup.id)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Копировать
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isExpanded"
                        checked={selectedGroup.isExpanded}
                        onChange={(e) => updateSelectedGroup({ isExpanded: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor="isExpanded" className="text-sm font-medium text-gray-700">
                        Развернута по умолчанию
                      </label>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteGroup(selectedGroup.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Удалить группу
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Выберите группу из списка слева для редактирования</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorA;