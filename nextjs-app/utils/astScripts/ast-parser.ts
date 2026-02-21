import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { v4 as uuidv4 } from "uuid";

export interface CodeNode {
  id: string;
  type: string;
  name: string;
  content: string;
  start: number;
  end: number;
  children: CodeNode[];
  description?: string;
}

export const parseCodeToTree = (code: string): CodeNode[] => {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const rootNodes: CodeNode[] = [];
  const nodeMap = new Map<any, CodeNode>();

  traverse(ast, {
    enter(path) {
      const { node } = path;
      
      // Выбираем только значимые блоки для деления
      const isExport = path.isExportDeclaration();
      const isFunction = path.isFunctionDeclaration() || path.isArrowFunctionExpression();
      const isLoop = path.isLoop();
      const isImport = path.isImportDeclaration();

      if (isExport || isFunction || isLoop || isImport) {
        const newNode: CodeNode = {
          id: uuidv4(),
          type: node.type,
          name: (node as any).id?.name || node.type,
          content: code.slice(node.start!, node.end!),
          start: node.start!,
          end: node.end!,
          children: [],
        };

        nodeMap.set(node, newNode);

        // Определяем вложенность
        const parent = path.findParent((p) => nodeMap.has(p.node));
        if (parent) {
          nodeMap.get(parent.node)!.children.push(newNode);
        } else {
          rootNodes.push(newNode);
        }
      }
    },
  });

  return rootNodes;
};