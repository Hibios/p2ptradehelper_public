// app/api/inspector/parse-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Проверяем существование файла
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File does not exist' },
        { status: 404 }
      );
    }

    // Читаем содержимое файла
    const content = await fs.readFile(filePath, 'utf-8');
    
    return NextResponse.json({
      success: true,
      filePath,
      content,
      size: content.length,
      scannedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}