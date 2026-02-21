// @START_MQ0PJHOK
'use client';
import React, { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { OpenAI } from 'openai';
import { FoldingRange, getFoldingRanges } from './ast-processor';

const client = new OpenAI({
  apiKey: "sk-52ec3a09db774a7bafb80c061761f2ff",
  dangerouslyAllowBrowser: true,
  baseURL: "https://api.deepseek.com"
});

const cleanExistingMarkers = (text: string) => {
  return text.replace(/\/\/ @(START|END)_[A-Z0-9]+\n?/g, '');
};

const SemanticAnalyzer = () => {
  const [status, setStatus] = useState('');
  const [maxLines, setMaxLines] = useState(50);
  const [extensions, setExtensions] = useState('.ts,.tsx,.js,.css,.json');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ignoredFolders, setIgnoredFolders] = useState('node_modules,.git,dist,build');

  // Основная функция запуска
  const startIndexing = async () => {
    try {
      // 1. Выбор папки через File System Access API
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite' 
      });
// @END_8AAE951H
// @START_0IOIIKH1

      // Важно: в некоторых браузерах нужно дополнительно проверить права
      if ((await dirHandle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
        if ((await dirHandle.requestPermission({ mode: 'readwrite' })) !== 'granted') {
          throw new Error('Доступ на запись в папку отклонен пользователем');
        }
      }

      setIsProcessing(true);
      const semanticMap: Record<string, any> = {};

      setStatus('Сканирование файлов...');
      await processDirectory(dirHandle, '', semanticMap);

      // 2. Сохранение итогового файла
      const mapBlob = new Blob([JSON.stringify(semanticMap, null, 2)], { type: 'application/json' });

      const url = URL.createObjectURL(mapBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'semantic_map.project';
      link.click();

      setStatus('Готово! Файл semantic_map.project скачан.');
    } catch (err) {
      console.error(err);
      setStatus('Ошибка: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanAllMarkers = async () => {
    try {
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite'
      });
      
      setIsProcessing(true);
      setStatus('Очистка меток в проекте...');
      
      let filesCleaned = 0;

      const processDir = async (handle: any) => {
        const skipList = ignoredFolders.split(',').map(s => s.trim());
        
        for await (const entry of handle.values()) {
          if (entry.kind === 'directory') {
            if (!skipList.includes(entry.name) && !entry.name.startsWith('.')) {
              await processDir(entry);
            }
          } else {
            const ext = `.${entry.name.split('.').pop()}`;
            if (extensions.split(',').includes(ext)) {
              const file = await entry.getFile();
              const content = await file.text();
              
              // Регулярное выражение для поиска и удаления строк с нашими метками
              // Оно удаляет саму строку и символ переноса строки после неё
              const cleanedContent = content.replace(/\/\/ @(START|END)_[A-Z0-9]+\n?/g, '');
              
              if (content !== cleanedContent) {
                const writable = await entry.createWritable();
                await writable.write(cleanedContent);
                await writable.close();
                filesCleaned++;
              }
            }
          }
        }
      };

      await processDir(dirHandle);
      setStatus(`Очистка завершена. Обновлено файлов: ${filesCleaned}`);
    } catch (err) {
      console.error(err);
      setStatus('Ошибка очистки: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };
  

  const processDirectory = async (dirHandle: any, path: string, map: any) => {
    const skipList = ignoredFolders.split(',').map(s => s.trim());
    
    for await (const entry of dirHandle.values()) {
      const currentPath = path ? `${path}/${entry.name}` : entry.name;
      
      if (entry.kind === 'directory') {
        if (skipList.includes(entry.name)) {
          console.log(`Пропуск папки: ${entry.name}`);
          continue; 
        }

        await processDirectory(entry, currentPath, map);
      } else {
        const ext = `.${entry.name.split('.').pop()}`;
        if (extensions.split(',').includes(ext)) {
          setStatus(`Обработка: ${currentPath}`);
          const file = await entry.getFile();
          let content = await file.text();
          
          content = cleanExistingMarkers(content);

          const { updatedCode, batches } = await analyzeAndTag(content, entry.name, ext);
          
          // Сохраняем изменения в файл (требует разрешения на запись)
          const writable = await entry.createWritable();
          await writable.write(updatedCode);
          await writable.close();

          map[currentPath] = batches;
        }
      }
    }
  };

  const analyzeAndTag = async (code: string, fileName: string, ext: string) => {
    const allRanges = await getFoldingRanges(code, ext);
    const executionRanges = allRanges.sort((a, b) => a.start - b.start || b.end - a.end);

    const lines = code.split('\n');
    const batches: any[] = [];
    const markers: { line: number, text: string }[] = [];

    const processRanges = async (currentRanges: FoldingRange[], parentContext: string = "", startBoundary: number = 0, endBoundary: number = lines.length) => {
      const processedIndices = new Set<number>();
      let lastProcessedLine = startBoundary;

      for (let i = 0; i < currentRanges.length; i++) {
        if (processedIndices.has(i)) continue;

        const range = currentRanges[i];
        const start = range.start - 1;
        const end = range.end - 1;

        if (start < startBoundary || end >= endBoundary) continue;

        const children = currentRanges.filter((r, idx) => r.start > range.start && r.end < range.end);
        const blockSize = end - start + 1; // Размер текущего целого блока

        // Условие 2: Функция больше N строк? Пробуем делить.
        if (blockSize > maxLines && children.length > 0) {
          // --- РЕКУРСИВНЫЙ СПУСК ---
          
          // Считаем размер детей. Если дети тоже огромные, это не поможет
          const hasSmallChildren = children.some(child => (child.end - child.start + 1) <= maxLines);

          if (hasSmallChildren) {
              // Дети достаточно малы, чтобы их паковать - спускаемся
              const headCode = lines[start].trim();
              const currentEntityName = headCode.replace(/\{$/, '').trim();
              const newHierarchy = parentContext ? `${parentContext} > ${currentEntityName}` : currentEntityName;
              
              processedIndices.add(i);
              await processRanges(children, newHierarchy, start, end + 1);
              lastProcessedLine = end + 1;

          } else {
              // Если деление не помогает (дети тоже > 50 строк), пакуем родителя целиком
              // Игнорируем детей и обрабатываем как один большой блок
              processedIndices.add(i);
              children.forEach((r, idx) => processedIndices.add(currentRanges.indexOf(r)));
              // Переходим сразу к логике упаковки ниже, без рекурсии
          }
        } 
        
        // Если условие выше не сработало (блок маленький, или деление не помогло)
        if (!processedIndices.has(i)) {
          // --- УПАКОВКА / ЖАДНОЕ ПОГЛОЩЕНИЕ (Условие 1) ---
          processedIndices.add(i);
          let groupStart = lastProcessedLine; 
          let groupEnd = end;
          
          // Жадное поглощение: смотрим на следующий ЦЕЛЫЙ блок
          let j = i + 1;
          while (j < currentRanges.length) {
            if (processedIndices.has(j)) { j++; continue; }
            const nextRange = currentRanges[j];
            const nextBlockSize = nextRange.end - nextRange.start + 1;
            const currentGroupSize = groupEnd - groupStart + 1;

            // Проверяем: Влезает ли СЛЕДУЮЩИЙ ЦЕЛЫЙ БЛОК в оставшийся лимит?
            if (currentGroupSize + nextBlockSize <= maxLines) {
              groupEnd = nextRange.end - 1;
              processedIndices.add(j);
              j++;
            } else { 
              // Уже больше 50 строк? Значит, этот следующий блок пойдет в новую пачку.
              break; 
            }
          }

          const uStart = `START_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
          const uEnd = `END_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
          
          const chunkCode = lines.slice(groupStart, groupEnd + 1).join('\n');
          if (chunkCode.trim()) { 
            const summary = await getSummary(chunkCode, parentContext || fileName);

            markers.push({ line: groupStart, text: `// @${uStart}` });
            markers.push({ line: groupEnd, text: `// @${uEnd}` });

            batches.push({
              ids: [uStart, uEnd],
              summary: summary,
              lines: `${groupStart + 1}-${groupEnd + 1}`
            });
          }

          lastProcessedLine = groupEnd + 1;
          // i = j - 1; // Убрали, так как цикл for сам управляет i
        }
      }

      // Обработка хвоста файла (не меняется)
      if (lastProcessedLine < endBoundary && parentContext === "") {
          // Логика обработки оставшегося кода
      }
    };

    // Запуск
    await processRanges(executionRanges, "", 0, lines.length);

    const updatedLines = [...lines];
    const sortedMarkers = markers.sort((a, b) => b.line - a.line);
    for (const marker of sortedMarkers) {
      const isStart = marker.text.includes('START');
      updatedLines.splice(isStart ? marker.line : marker.line + 1, 0, marker.text);
    }

    return { updatedCode: updatedLines.join('\n'), batches };
  };


  const getSummary = async (code: string, context: string) => {
    const cleanCode = code.trim().slice(0, 1500); 

    try {
      const res = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: `Ты — технический писатель. Твоя задача — описать конкретный фрагмент кода для того чтобы другая LLM поняла - есть ли то что ей нужно исправить в этом коде или нет.
            ОБЯЗАТЕЛЬНО: Начни ответ с упоминания иерархии из контекста (если он есть),  напиши на чём начинается открывок, далее что происходит в процессе отрывка и чем он заканчивается.
            ФОРМАТ: "Контекст: [краткая суть]".
            ЗАПРЕЩЕНО: Markdown, списки, переносы строк, фразы "Этот код...".
            Максимум 50 слов.` 
          },
          { 
            role: "user", 
            content: `Иерархия/Контекст: ${context}\n\nКод для анализа:\n${cleanCode}` 
          }
        ],
        temperature: 0.1,
      });
// @END_TWGE2FQT
// @START_7YK1PFA4
      
      const result = res.choices[0].message.content || "";
      return result.replace(/[*#`\n]/g, "").trim();
    } catch (error) {
      return "Технический блок кода";
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 bg-slate-900 text-white rounded-xl">
      <h2 className="text-2xl font-bold">AI Semantic Indexer</h2>
      
      <div className="grid gap-4">
        <label>Разрешения (через запятую):</label>
        <input 
          className="p-2 bg-slate-800 border border-slate-700 rounded"
          value={extensions} onChange={(e) => setExtensions(e.target.value)} 
        />

        <label>Макс. строк в пачке:</label>
        <input 
          type="number" className="p-2 bg-slate-800 border border-slate-700 rounded"
          value={maxLines} onChange={(e) => setMaxLines(Number(e.target.value))} 
        />
      </div>

      <label>Исключить папки (через запятую):</label>
      <input 
        className="p-2 bg-slate-800 border border-slate-700 rounded"
        value={ignoredFolders} 
        onChange={(e) => setIgnoredFolders(e.target.value)} 
      />
      <div className="flex gap-4">
        <button 
          onClick={startIndexing}
          disabled={isProcessing}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded font-semibold disabled:opacity-50"
        >
          {isProcessing ? 'Обработка...' : 'Начать индексацию'}
        </button>

        <button 
          onClick={cleanAllMarkers}
          disabled={isProcessing}
          className="px-6 py-3 bg-red-900/50 hover:bg-red-800 border border-red-700 rounded font-semibold disabled:opacity-50"
          title="Удалить все UUID метки из выбранной папки"
        >
          Очистить проект
        </button>
      </div>


      <div className="text-sm text-slate-400 italic">{status}</div>
    </div>
// @END_YZ8YI2R9
  );
};

export default SemanticAnalyzer;
