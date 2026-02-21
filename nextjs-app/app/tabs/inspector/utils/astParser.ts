// app/tabs/inspector/utils/astParser.ts
import * as parser from '@babel/parser';
import * as t from '@babel/types';
import { ASTNode } from './types';
import { v4 as uuidv4 } from 'uuid';

// Объявляем типы для параметров
interface ProcessNodeParams {
  node: any;
  nodeIndexRef: { index: number };
  parentId?: string;
}

function processNode({ node, nodeIndexRef, parentId }: ProcessNodeParams): ASTNode {
  const id = `node_${nodeIndexRef.index++}`;
  const astNode: ASTNode = {
    id,
    uuid: uuidv4(),
    type: node.type || 'Unknown',
    start: node.start || 0,
    end: node.end || 0,
    parentId,
    collapsed: true,
    properties: {}
  };

  // Добавляем специфичные свойства в зависимости от типа
  switch(node.type) {
    case 'ImportDeclaration':
      astNode.name = 'Import';
      astNode.text = `import from "${node.source?.value || 'unknown'}"`;
      astNode.properties = {
        source: node.source?.value,
        specifiers: node.specifiers?.map((s: any) => ({
          type: s.type,
          imported: s.imported?.name,
          local: s.local?.name
        }))
      };
      break;
      
    case 'FunctionDeclaration':
      astNode.name = node.id?.name || 'Anonymous Function';
      astNode.text = `function ${astNode.name}()`;
      break;
      
    case 'VariableDeclaration':
      astNode.name = 'Variable Declaration';
      astNode.text = `${node.kind} declaration`;
      astNode.properties = { kind: node.kind };
      break;
      
    case 'JSXElement':
      astNode.name = 'JSX Element';
      astNode.text = `<${node.openingElement?.name?.name || 'Unknown'}>`;
      break;

    case 'ExportNamedDeclaration':
      astNode.name = 'Export';
      astNode.text = 'export declaration';
      break;

    case 'ClassDeclaration':
      astNode.name = node.id?.name || 'Anonymous Class';
      astNode.text = `class ${astNode.name}`;
      break;
  }

  // Рекурсивно обрабатываем детей с правильной передачей параметров
  if (node.body && Array.isArray(node.body)) {
    astNode.children = node.body.map((child: any) => 
      processNode({ 
        node: child, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  } else if (node.declarations && Array.isArray(node.declarations)) {
    astNode.children = node.declarations.map((child: any) => 
      processNode({ 
        node: child, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  } else if (node.specifiers && Array.isArray(node.specifiers)) {
    astNode.children = node.specifiers.map((child: any) => 
      processNode({ 
        node: child, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  } else if (node.expression) {
    astNode.children = [
      processNode({ 
        node: node.expression, 
        nodeIndexRef, 
        parentId: id 
      })
    ];
  } else if (node.consequent) {
    astNode.children = [
      processNode({ 
        node: node.consequent, 
        nodeIndexRef, 
        parentId: id 
      })
    ];
  } else if (node.alternate) {
    astNode.children = [
      processNode({ 
        node: node.alternate, 
        nodeIndexRef, 
        parentId: id 
      })
    ];
  } else if (node.arguments && Array.isArray(node.arguments)) {
    astNode.children = node.arguments.map((arg: any) => 
      processNode({ 
        node: arg, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  } else if (node.elements && Array.isArray(node.elements)) {
    astNode.children = node.elements.map((element: any) => 
      processNode({ 
        node: element, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  } else if (node.properties && Array.isArray(node.properties)) {
    astNode.children = node.properties.map((prop: any) => 
      processNode({ 
        node: prop, 
        nodeIndexRef, 
        parentId: id 
      })
    );
  }

  return astNode;
}

function parseCodeToAST(code: string, filename: string): ASTNode[] {
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        filename.endsWith('.tsx') ? 'jsx' : undefined,
        'decorators-legacy'
      ].filter(Boolean) as any[],
      tokens: true
    });

    const nodes: ASTNode[] = [];
    const nodeIndexRef = { index: 0 };

    // Обрабатываем корневые узлы программы
    if (ast.program && ast.program.body) {
      nodes.push(...ast.program.body.map((node: any) => 
        processNode({ 
          node, 
          nodeIndexRef 
        })
      ));
    }

    return groupSimilarNodes(nodes);
  } catch (error) {
    console.error('Error parsing code:', error);
    return [];
  }
}

function groupSimilarNodes(nodes: ASTNode[]): ASTNode[] {
  const importNodes = nodes.filter(n => n.type === 'ImportDeclaration');
  const otherNodes = nodes.filter(n => n.type !== 'ImportDeclaration');
  
  if (importNodes.length >= 2) {
    // Создаем группу импортов
    const importGroup: ASTNode = {
      id: `import_group_${Date.now()}`,
      uuid: uuidv4(),
      type: 'ImportGroup',
      name: 'Import Declarations',
      description: `Group of ${importNodes.length} import statements`,
      start: Math.min(...importNodes.map(n => n.start)),
      end: Math.max(...importNodes.map(n => n.end)),
      children: importNodes,
      collapsed: true,
      properties: {
        count: importNodes.length,
        sources: importNodes.map(n => n.properties?.source).filter(Boolean)
      }
    };
    
    return [importGroup, ...otherNodes];
  }
  
  return nodes;
}

// Экспортируемые функции
export async function parseFileToAST(filePath: string): Promise<ASTNode[]> {
  try {
    const response = await fetch('/api/project/inspector/parse-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath })
    });
    
    if (!response.ok) {
      throw new Error('Failed to read file');
    }
    
    const { content } = await response.json();
    
    return parseCodeToAST(content, filePath);
  } catch (error) {
    console.error('Error parsing file:', error);
    return [];
  }
}

export function parseCodeStringToAST(code: string, filename: string = 'file.ts'): ASTNode[] {
  return parseCodeToAST(code, filename);
}