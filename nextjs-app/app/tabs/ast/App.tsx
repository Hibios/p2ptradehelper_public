'use client';
import { CodeGroup, generateAnnotatedFile, processProjectFile } from '@/utils/ast-processor';
import React, { useState } from 'react';

// @START_K5UBO3JF
export default function ASTPage() {
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const code = await file.text();
    const processedGroups = processProjectFile(code);
    setGroups(processedGroups);
  };

  const generateData = async () => {
    setLoading(true);
    const smEntries = [];

    for (const group of groups) {
      const res = await fetch('/api/describe', {
        method: 'POST',
        body: JSON.stringify({ code: group.content })
      });
      const { description } = await res.json();
      
      smEntries.push({
        name: group.name,
        description,
        start_id: group.start_id,
        end_id: group.end_id
      });
// @END_9TI0IH7M
// @START_B69CR2FC
    }

    // Скачивание .sm файла
    downloadFile(smEntries.map(e => JSON.stringify(e)).join('\n'), 'project.sm');
    // Скачивание аннотированного кода
    downloadFile(generateAnnotatedFile(groups), 'annotated_code.tsx');
    setLoading(false);
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">AST Splitter v2 (DeepSeek)</h1>
      <input type="file" accept=".ts,.tsx" onChange={handleFile} className="block w-full border p-2" />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 h-[600px] overflow-auto">
          <h3 className="font-bold mb-2">Группы блоков:</h3>
          {groups.map(g => (
            <div key={g.id} className="mb-2 p-2 bg-gray-50 border text-xs">
              <div className="flex justify-between">
                <strong>{g.type}: {g.name}</strong>
                <span>{g.lineCount} lines</span>
              </div>
              <code className="text-gray-400 block truncate">{g.content.slice(0, 50)}...</code>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={generateData}
        disabled={loading || groups.length === 0}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Генерация через DeepSeek...' : 'Создать .sm и аннотированный файл'}
      </button>
    </div>
// @END_3QP17E1O
  );
}
