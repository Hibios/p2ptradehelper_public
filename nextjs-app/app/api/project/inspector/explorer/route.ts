import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileTreeNode[];
}

function shouldSkip(name: string): boolean {
  const skipItems = [
    'node_modules', '.next', '.git', 'dist', 'build',
    '.cache', '.vercel', '.vscode', '.idea',
    'package-lock.json', 'yarn.lock', '.env',
    '.DS_Store', 'next.config.js', '.eslintrc.js',
    'tsconfig.json', 'README.md'
  ];
  return skipItems.includes(name) || name.startsWith('.');
}

async function buildFileTree(dirPath: string, basePath: string, depth = 0): Promise<FileTreeNode[]> {
  const nodes: FileTreeNode[] = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    // Сортируем: сначала папки, потом файлы
    const sortedEntries = entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of sortedEntries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Пропускаем системные файлы и папки
      if (shouldSkip(entry.name)) continue;
      
      // Ограничиваем глубину рекурсии
      if (depth > 5) continue;
      
      const relativePath = path.relative(basePath, fullPath);
      
      const node: FileTreeNode = {
        id: relativePath || entry.name,
        name: entry.name,
        path: fullPath,
        type: entry.isDirectory() ? 'folder' : 'file',
        extension: entry.isFile() ? path.extname(entry.name) : undefined
      };

      if (entry.isDirectory()) {
        // Добавляем детей только для некоторых папок (или всех)
        node.children = await buildFileTree(fullPath, basePath, depth + 1);
      }

      nodes.push(node);
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return nodes;
}

export async function POST(request: NextRequest) {
  try {
    const { path: projectPath } = await request.json();
    
    if (!projectPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Проверяем существование пути
    try {
      await fs.access(projectPath);
    } catch {
      return NextResponse.json(
        { error: 'Path does not exist or is not accessible' },
        { status: 404 }
      );
    }

    const tree = await buildFileTree(projectPath, projectPath);
    
    return NextResponse.json({
      success: true,
      tree,
      projectPath,
      scannedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error building file tree:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'File Explorer API',
    usage: 'Send POST request with { "path": "/your/project/path" }',
    example: {
      method: 'POST',
      body: { path: '/Users/username/projects/nextjs-app' }
    }
  });
}