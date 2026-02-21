// app/tabs/inspector/utils/types.ts

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileTreeNode[];
}

export interface ASTNode {
  id: string;
  uuid: string;
  type: string;
  name?: string;
  text?: string;
  description?: string;
  start: number;
  end: number;
  children?: ASTNode[];
  collapsed?: boolean; // Может быть undefined
  parentId?: string;
  properties?: {
    [key: string]: any;
  };
}

// Дополнительный тип для проверки hasChildren
export type ASTNodeWithChildren = ASTNode & {
  children: ASTNode[];
};