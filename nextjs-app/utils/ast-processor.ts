import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { v4 as uuidv4 } from "uuid";

export interface CodeGroup {
  id: string;
  name: string;
  content: string;
  type: string;
  start_id: string;
  end_id: string;
  lineCount: number;
}

export const processProjectFile = (code: string) => {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"], // Поддержка JSX/TSX
  });

  const groups: CodeGroup[] = [];
  let currentImports: any[] = [];
  let pendingFunctions: any[] = [];
  let pendingLines = 0;

  const flushImports = () => {
    if (currentImports.length > 0) {
      const content = currentImports.map(n => code.slice(n.start, n.end)).join('\n');
      groups.push(createGroup("Imports Block", content, "imports"));
      currentImports = [];
    }
  };

  const flushFunctions = () => {
    if (pendingFunctions.length > 0) {
      const content = pendingFunctions.map(n => code.slice(n.start, n.end)).join('\n\n');
      groups.push(createGroup("Functions Group", content, "functions_batch"));
      pendingFunctions = [];
      pendingLines = 0;
    }
  };

  const createGroup = (name: string, content: string, type: string): CodeGroup => ({
    id: uuidv4(),
    name,
    content,
    type,
    start_id: uuidv4(),
    end_id: uuidv4(),
    lineCount: content.split('\n').length
  });

  traverse(ast, {
    ImportDeclaration(path) {
      currentImports.push(path.node);
    },
    // Обработка функций и JSX внутри них
    FunctionDeclaration(path) {
      flushImports();
      const node = path.node;
      const fnCode = code.slice(node.start!, node.end!);
      const lines = fnCode.split('\n').length;

      if (lines > 100) {
        flushFunctions();
        groups.push(createGroup(node.id?.name || "Anonymous Fn", fnCode, "function_large"));
      } else {
        pendingFunctions.push(node);
        pendingLines += lines;
        if (pendingLines > 100) flushFunctions();
      }
    },
    // Обработка констант с JSX (компоненты)
    VariableDeclarator(path) {
      if (path.node.init?.type === 'ArrowFunctionExpression' || path.node.init?.type === 'JSXElement') {
        flushImports();
        const fnCode = code.slice(path.parentPath.node.start!, path.parentPath.node.end!);
        pendingFunctions.push(path.parentPath.node);
        pendingLines += (fnCode.split('\n').length);
        if (pendingLines > 100) flushFunctions();
      }
    }
  });

  flushImports();
  flushFunctions();
  return groups;
};

export const generateAnnotatedFile = (groups: CodeGroup[]) => {
  return groups.map(g => 
    `/* start_id: ${g.start_id} */\n${g.content}\n/* end_id: ${g.end_id} */`
  ).join('\n\n');
};