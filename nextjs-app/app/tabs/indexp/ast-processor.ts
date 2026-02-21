// @START_UKO80O7S

import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { ParserPlugin } from "@babel/parser";

const plugins: ParserPlugin[] = [
  "decorators-legacy",
  "classProperties",
];



export interface FoldingRange {
  start: number;
  end: number;
  type: string;
}
// @END_XBPJSRNP
// @START_ITENN5X8




/**
 * Парсит код и возвращает структурные блоки
 */

export const getFoldingRanges = async (code: string, ext: string): Promise<FoldingRange[]> => {
  const ranges: FoldingRange[] = [];

  // Флаги на основе расширения
  const isTS = ext.endsWith('ts') || ext.endsWith('tsx');
  const isJSX = ext.endsWith('jsx') || ext.endsWith('tsx');

  const plugins: ParserPlugin[] = [
    "decorators-legacy",
    "classProperties",
    "topLevelAwait",
    "asyncGenerators",
    "dynamicImport",
    "optionalChaining", // Для кода типа obj?.prop
    "nullishCoalescingOperator" // Для кода типа a ?? b
  ];

  if (isTS) plugins.push("typescript");
  if (isJSX) plugins.push("jsx");

  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: plugins,
      errorRecovery: true, // Позволяет продолжить при мелких синтаксических ошибках
      attachComment: false, // Нам не нужны комментарии в AST для поиска блоков
    });

    traverse(ast, {
      enter(path) {
        const node = path.node;
        
        // К списку блоков добавляем JSXElement (чтобы можно было сворачивать верстку)
        const isFoldable = 
          path.isFunctionDeclaration() || 
          path.isClassDeclaration() || 
          path.isClassMethod() || 
          path.isObjectMethod() ||
          path.isObjectExpression() ||
          path.isImportDeclaration() ||
          path.isExportNamedDeclaration() ||
          path.isJSXElement() || // Сами элементы <div />
          path.isJSXFragment();   // Фрагменты <> </>

        if (isFoldable && node.loc) {
          // Игнорируем слишком мелкие JSX элементы (в одну строку)
          if (node.loc.start.line !== node.loc.end.line) {
            ranges.push({
              start: node.loc.start.line,
              end: node.loc.end.line,
              type: node.type,
            });
          }
        }
      }
    });
  } catch (error) {
    console.error(`Babel Error [${ext}]:`, error);
  }

  return ranges;
};
// @END_5P2YAAJD
// @START_IWLWY94W




/**
 * Простой парсер для JSON (так как Babel только для JS/TS)
 */

function getJsonFolding(code: string): FoldingRange[] {
  const ranges: FoldingRange[] = [];
  try {
    const obj = JSON.parse(code);
    // Для JSON блоки определяются по { и [ (упрощенно через RegExp для координат)
    // Но лучше просто вернуть пустой массив, если структура не важна
  } catch (e) {}
  return ranges;
}
// @END_E6S4G81Q

