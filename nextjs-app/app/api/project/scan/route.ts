import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Выносим вспомогательные функции на верхний уровень
function shouldSkipDir(dirName: string): boolean {
  const skipDirs = [
    'node_modules', '.git', '.next', 'dist', 'build',
    '.cache', '.vercel', '.vscode', '.idea', '.husky',
    '.github', '.docker', '.DS_Store'
  ];
  return skipDirs.includes(dirName) || dirName.startsWith('.');
}

async function scanDirectory(
  dirPath: string,
  projectPath: string,
  folders: string[],
  fileTypes: Record<string, number>,
  depth = 0
): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    if (depth > 0) {
      const relativePath = path.relative(projectPath, dirPath);
      folders.push(relativePath);
    }
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip system directories
        if (shouldSkipDir(entry.name)) continue;
        await scanDirectory(fullPath, projectPath, folders, fileTypes, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (ext) {
          fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
    // Пропускаем ошибки доступа, продолжаем сканирование других папок
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectPath } = body;
    
    if (!projectPath) {
      return NextResponse.json(
        { error: 'Project path is required' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли путь
    try {
      await fs.access(projectPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Project path does not exist or is not accessible' },
        { status: 404 }
      );
    }

    const folders: string[] = [];
    const fileTypes: Record<string, number> = {};

    await scanDirectory(projectPath, projectPath, folders, fileTypes);
    
    // Сортируем папки по алфавиту и фильтруем пустые
    const sortedFolders = folders
      .filter(folder => folder.trim() !== '')
      .sort((a, b) => a.localeCompare(b));
    
    // Сортируем расширения файлов по количеству
    const sortedFileTypes = Object.entries(fileTypes)
      .sort(([, countA], [, countB]) => countB - countA)
      .reduce((acc, [ext, count]) => {
        acc[ext] = count;
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      projectPath,
      totalFolders: sortedFolders.length,
      folders: sortedFolders.slice(0, 200), // Ограничиваем для UI
      totalFileTypes: Object.keys(sortedFileTypes).length,
      fileTypes: sortedFileTypes,
      scannedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in project scan:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Также можно добавить GET запрос для тестирования
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AST Inspector API is running',
    endpoints: ['POST /api/project/inspector/scan'],
    usage: 'Send POST request with { "projectPath": "/path/to/project" }'
  });
}