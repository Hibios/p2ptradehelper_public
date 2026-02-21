"use client";
import { ImageButton } from '@/components/Icons/imageIcon';
import { CanvasArea, CanvasItem, DraggedItem, ResizeHandle, ResizeState, SmuxCanvas } from '@/types/components';
import { parseSmuxData } from '@/utils/helpers';
import { ScrollShadow } from '@heroui/react';
import { useState, useRef, ChangeEvent, useEffect } from 'react';


const ALL_CONTROL_TYPES = [
  'Accordion',
  'Alert',
  'Autocomplete',
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Calendar',
  'Card',
  'Checkbox',
  'Checkbox Group',
  'Chip',
  'Circular Progress',
  'Code',
  'Date Input',
  'Date Picker',
  'Date Range Picker',
  'Divider',
  'Drawer',
  'Dropdown',
  'Form',
  'Image',
  'Input',
  'Input OTP',
  'Kbd',
  'Link',
  'Listbox',
  'Modal',
  'Navbar',
  'Number Input',
  'Pagination',
  'Popover',
  'Progress',
  'Radio Group',
  'Range Calendar',
  'Scroll Shadow',
  'Select',
  'Skeleton',
  'Slider',
  'Snippet',
  'Spacer',
  'Spinner',
  'Switch',
  'Table',
  'Tabs',
  'Textarea',
  'Time Input',
  'Toast',
  'Tooltip'
] as const;

export default function DragAndDropCanvas() {
  const [activeItem, setActiveItem] = useState<CanvasItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const SNAP_DISTANCE = 10;
  const [snapGuide, setSnapGuide] = useState<{ x?: number; y?: number }>({});
  const [clipboard, setClipboard] = useState<CanvasItem | null>(null);
  const [savedCanvases, setSavedCanvases] = useState<SmuxCanvas[]>([]);

  const [canvases, setCanvases] = useState<CanvasArea[]>([
    {
      id: '1',
      name: 'Главный канвас',
      items: [],
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      showBorder: true
    }
  ]);
  const [activeCanvasId, setActiveCanvasId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'elements' | 'canvases'>('elements');
  const activeCanvas = canvases.find(c => c.id === activeCanvasId) || canvases[0];

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startItem: null,
    startItemX: 0,
    startItemY: 0
  });

    // Функция преобразования элементов в SMUX формат
  const convertItemsToSmux = (items: CanvasItem[], indent: string = ''): string => {
    let smux = '';
    
    items.forEach(item => {
      if (item.type === 'box') {
        // Конвертируем justifyContent обратно в SMUX формат
        const justifyValue = item.justifyContent 
          ? item.justifyContent.replace('space-', '').replace('flex-', '')
          : 'start';

        // Flex контейнер - не включаем width и height согласно спецификации
        smux += `${indent}<flex>\n`;
        smux += `${indent}dir:${item.flexDirection || 'column'}\n`;
        smux += `${indent}justify:${justifyValue}\n`; // Исправлено здесь
        smux += `${indent}align:${(item.alignItems || 'stretch').replace('flex-', '')}\n`;
        smux += `${indent}spacing:${item.gap || 0}\n`;
        smux += `${indent}padding:${item.padding || 0}\n`;

        smux += `${indent}width:${item.width ? Math.round(item.width) : '-'}\n`;
        smux += `${indent}height:${item.height ? Math.round(item.height) : '-'}\n`;
        
        // Координаты только если нет родителя
        if (!item.parentBoxId) {
          smux += `${indent}x:${Math.round(item.x)}\n`;
          smux += `${indent}y:${Math.round(item.y)}\n`;
        } else {
          smux += `${indent}x:-\n`;
          smux += `${indent}y:-\n`;
        }
        
        // Рекурсивно обрабатываем вложенные элементы
        if (item.items && item.items.length > 0) {
          smux += convertItemsToSmux(item.items, indent + '  ');
        }
        
        smux += `${indent}</flex>\n`;
      } else if (item.type === 'button') {
        // Widget элемент
        smux += `${indent}<widget>\n`;
        smux += `${indent}type:${item.controlType || 'Button'}\n`;
        smux += `${indent}content:"${(item.content || '').replace(/"/g, '\\"')}"\n`;
        smux += `${indent}notes:"${(item.comment || '').replace(/"/g, '\\"')}"\n`;
        smux += `${indent}width:${item.width ? Math.round(item.width) : '-'}\n`;
        smux += `${indent}height:${item.height ? Math.round(item.height) : '-'}\n`;
        
        // Координаты только если нет родителя
        if (!item.parentBoxId) {
          smux += `${indent}x:${Math.round(item.x)}\n`;
          smux += `${indent}y:${Math.round(item.y)}\n`;
        } else {
          smux += `${indent}x:-\n`;
          smux += `${indent}y:-\n`;
        }
        
        smux += `${indent}</widget>\n`;
      } else if (item.type === 'image') {
        // Image элемент
        smux += `${indent}<image>\n`;
        smux += `${indent}src:"${(item.src || '').replace(/"/g, '\\"')}"\n`;
        smux += `${indent}width:${item.width ? Math.round(item.width) : '-'}\n`;
        smux += `${indent}height:${item.height ? Math.round(item.height) : '-'}\n`;
        
        // Координаты только если нет родителя
        if (!item.parentBoxId) {
          smux += `${indent}x:${Math.round(item.x)}\n`;
          smux += `${indent}y:${Math.round(item.y)}\n`;
        } else {
          smux += `${indent}x:-\n`;
          smux += `${indent}y:-\n`;
        }
        
        smux += `${indent}</image>\n`;
      }
    });
    
    return smux;
  };

  const handleSmuxFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      // Парсим имя из комментария или используем имя файла
      const nameMatch = content.match(/<!--\s*(.+?)\s*-->/);
      const name = nameMatch ? nameMatch[1] : file.name.replace('.smux', '');
      
      const smuxCanvas: SmuxCanvas = {
        id: Date.now().toString(),
        name,
        smuxData: content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSavedCanvases(prev => {
        const updated = [smuxCanvas, ...prev];
        localStorage.setItem('smux-canvases', JSON.stringify(updated));
        return updated;
      });
      
      // Очищаем input
      e.target.value = '';
    };
    
    reader.readAsText(file);
  };

  // Функция сохранения текущего канваса
  const saveCurrentCanvas = () => {
    const activeCanvas = canvases.find(c => c.id === activeCanvasId);
    if (!activeCanvas) return;

    const smuxData = convertItemsToSmux(activeCanvas.items);
    
    const smuxCanvas: SmuxCanvas = {
      id: Date.now().toString(),
      name: activeCanvas.name,
      smuxData: `<!-- ${activeCanvas.name} -->\n${smuxData}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Проверяем, есть ли уже сохраненный канвас с таким именем
    setSavedCanvases(prev => {
      const filtered = prev.filter(c => c.name !== activeCanvas.name);
      const updated = [smuxCanvas, ...filtered];
      localStorage.setItem('smux-canvases', JSON.stringify(updated));
      return updated;
    });
    
    alert(`Канвас "${activeCanvas.name}" сохранен в формате SMUX!`);
  };

  // Функция загрузки канваса из SMUX
  const loadCanvasFromSmux = (smuxCanvas: SmuxCanvas) => {
  try {
    // Удаляем комментарии для парсинга
    const cleanSmuxData = smuxCanvas.smuxData.replace(/<!--[\s\S]*?-->/g, '').trim();
    
    // Парсим SMUX данные
    const items = parseSmuxData(cleanSmuxData);
    
    // Рассчитываем размер канваса на основе элементов
    let maxRight = 0;
    let maxBottom = 0;
    const calculateBounds = (itemList: CanvasItem[], offsetX: number = 0, offsetY: number = 0) => {
      itemList.forEach(item => {
        const itemX = offsetX + (item.x || 0);
        const itemY = offsetY + (item.y || 0);
        const itemWidth = item.width || (item.type === 'button' ? 100 : 200);
        const itemHeight = item.height || (item.type === 'button' ? 40 : 200);
        
        const right = itemX + itemWidth;
        const bottom = itemY + itemHeight;
        
        if (right > maxRight) maxRight = right;
        if (bottom > maxBottom) maxBottom = bottom;
        
        // Для box также учитываем вложенные элементы
        if (item.type === 'box' && item.items) {
          // Добавляем padding для внутреннего содержимого
          const innerOffsetX = itemX + (item.padding || 0);
          const innerOffsetY = itemY + (item.padding || 0);
          calculateBounds(item.items, innerOffsetX, innerOffsetY);
        }
      });
    };
    
    calculateBounds(items);
    
    // Добавляем отступы
    maxRight += 50;
    maxBottom += 50;
    
    // Создаем новый канвас
    const newCanvas: CanvasArea = {
      id: Date.now().toString(),
      name: smuxCanvas.name,
      items: items,
      width: Math.max(800, maxRight),
      height: Math.max(600, maxBottom),
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      showBorder: true
    };
    
    setCanvases([...canvases, newCanvas]);
    setActiveCanvasId(newCanvas.id);
    setActiveItem(null);
    
  } catch (error) {
    console.error('Ошибка при загрузке SMUX файла:', error);
    alert('Не удалось загрузить SMUX файл. Проверьте формат файла.');
  }
};

  // Функция удаления сохраненного канваса
  const deleteSavedCanvas = (id: string) => {
    setSavedCanvases(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('smux-canvases', JSON.stringify(updated));
      return updated;
    });
  };

  // Функция скачивания SMUX файла
  const downloadSmuxFile = (smuxCanvas: SmuxCanvas) => {
    const blob = new Blob([smuxCanvas.smuxData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${smuxCanvas.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.smux`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Загрузка сохраненных канвасов при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('smux-canvases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCanvases(parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        })));
      } catch (e) {
        console.error('Ошибка загрузки сохраненных канвасов:', e);
      }
    }
  }, []);

  const handleResizeStart = (e: React.MouseEvent, item: CanvasItem, handle: ResizeHandle) => {
    console.log('Resize started!')
    e.preventDefault();
    e.stopPropagation();
    
    setActiveItem(item);
    
    // Получаем текущие размеры элемента
    const currentWidth = item.width || (item.type === 'button' ? 100 : item.type === 'image' ? 100 : 200);
    const currentHeight = item.height || (item.type === 'button' ? 40 : item.type === 'image' ? 100 : 200);
    
    setResizeState({
      isResizing: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentWidth,
      startHeight: currentHeight,
      startItem: item,
      startItemX: item.x,
      startItemY: item.y
    });
  };

  const ResizeHandles = ({ item, isActive }: { item: CanvasItem, isActive: boolean }) => {
    if (!isActive) return null;

    // Получаем текущие размеры элемента
    const width = item.width || (item.type === 'button' ? 100 : item.type === 'image' ? 100 : 200);
    const height = item.height || (item.type === 'button' ? 40 : item.type === 'image' ? 100 : 200);
    const handleSize = 10;

    const handles: ResizeHandle[] = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];

    return (
      <>
        {/* Контур вокруг элемента */}
        <div 
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: '0px',
            top: '0px',
            width: `${width}px`, 
            height: `${height}px`
          }}
        />
        
        {/* Хендлы для ресайза */}
        {handles.map(handle => {
          let left = 0;
          let top = 0;

          switch (handle) {
            case 'nw':
              left = -handleSize/2;
              top = -handleSize/2;
              break;
            case 'ne':
              left = width - handleSize/2;
              top = -handleSize/2;
              break;
            case 'sw':
              left = -handleSize/2;
              top = height - handleSize/2;
              break;
            case 'se':
              left = width - handleSize/2;
              top = height - handleSize/2;
              break;
            case 'n':
              left = width/2 - handleSize/2;
              top = -handleSize/2;
              break;
            case 's':
              left = width/2 - handleSize/2;
              top = height - handleSize/2;
              break;
            case 'w':
              left = -handleSize/2;
              top = height/2 - handleSize/2;
              break;
            case 'e':
              left = width - handleSize/2;
              top = height/2 - handleSize/2;
              break;
          }

          return (
            <div
              key={handle}
              className={`absolute bg-blue-500 border border-white rounded-sm cursor-${handle}-resize resize-handle`}
              style={{
                width: `${handleSize}px`,
                height: `${handleSize}px`,
                left: `${left}px`,
                top: `${top}px`,
              }}
              onMouseDown={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                handleResizeStart(e, item, handle);
              }}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
            />
          );
        })}
      </>
    );
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!resizeState.isResizing || !resizeState.startItem) return;

    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;
    const { handle, startWidth, startHeight, startItem, startItemX, startItemY } = resizeState;

    // Минимальные размеры
    const MIN_WIDTH = startItem.type === 'box' ? 20 : 20;
    const MIN_HEIGHT = startItem.type === 'box' ? 20 : 20;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startItemX;
    let newY = startItemY;

    switch (handle) {
      case 'e':
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
        break;
      case 'w':
        newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
        newX = startItemX + deltaX;
        break;
      case 's':
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
        break;
      case 'n':
        newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
        newY = startItemY + deltaY;
        break;
      case 'ne':
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
        newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
        newY = startItemY + deltaY;
        break;
      case 'nw':
        newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
        newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
        newX = startItemX + deltaX;
        newY = startItemY + deltaY;
        break;
      case 'se':
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
        newX = startItemX + deltaX;
        break;
    }

    let finalX = newX;
    let finalY = newY;
    let finalWidth = newWidth;
    let finalHeight = newHeight;
    let snapGuide: { x?: number; y?: number } = {};

    // Функция для получения всех элементов (включая вложенные) для проверки примагничивания
    const getAllItemsForSnap = (items: CanvasItem[]): CanvasItem[] => {
      const allItems: CanvasItem[] = [];
      
      const processItems = (itemList: CanvasItem[], parentX: number = 0, parentY: number = 0) => {
        itemList.forEach(item => {
          // Для элементов внутри Box нужно учитывать координаты родителя
          const absoluteX = parentX + item.x;
          const absoluteY = parentY + item.y;
          
          allItems.push({
            ...item,
            x: absoluteX,
            y: absoluteY
          });
          
          // Рекурсивно обрабатываем вложенные элементы
          if (item.type === 'box' && item.items) {
            processItems(item.items, absoluteX, absoluteY);
          }
        });
      };
      
      processItems(items);
      return allItems;
    };

    const allItems = getAllItemsForSnap(activeCanvas.items);
    
    // Фильтруем текущий элемент (если он есть в списке)
    const otherItems = allItems.filter(item => item.id !== startItem.id);

    otherItems.forEach(item => {
      const itemWidth = item.width || (item.type === 'button' ? 100 : item.type === 'image' ? 100 : 200);
      const itemHeight = item.height || (item.type === 'button' ? 40 : item.type === 'image' ? 100 : 200);

      if (handle === 'e' || handle === 'ne' || handle === 'se') {
        if (Math.abs((newX + newWidth) - item.x) < SNAP_DISTANCE) {
          finalWidth = item.x - newX;
          snapGuide.x = item.x;
        }
        if (Math.abs((newX + newWidth) - (item.x + itemWidth)) < SNAP_DISTANCE) {
          finalWidth = (item.x + itemWidth) - newX;
          snapGuide.x = item.x + itemWidth;
        }
      }

      if (handle === 'w' || handle === 'nw' || handle === 'sw') {
        if (Math.abs(newX - item.x) < SNAP_DISTANCE) {
          finalWidth = newWidth + (newX - item.x);
          finalX = item.x;
          snapGuide.x = item.x;
        }
        if (Math.abs(newX - (item.x + itemWidth)) < SNAP_DISTANCE) {
          finalWidth = newWidth + (newX - (item.x + itemWidth));
          finalX = item.x + itemWidth;
          snapGuide.x = item.x + itemWidth;
        }
      }

      if (handle === 's' || handle === 'se' || handle === 'sw') {
        if (Math.abs((newY + newHeight) - item.y) < SNAP_DISTANCE) {
          finalHeight = item.y - newY;
          snapGuide.y = item.y;
        }
        if (Math.abs((newY + newHeight) - (item.y + itemHeight)) < SNAP_DISTANCE) {
          finalHeight = (item.y + itemHeight) - newY;
          snapGuide.y = item.y + itemHeight;
        }
      }

      if (handle === 'n' || handle === 'ne' || handle === 'nw') {
        if (Math.abs(newY - item.y) < SNAP_DISTANCE) {
          finalHeight = newHeight + (newY - item.y);
          finalY = item.y;
          snapGuide.y = item.y;
        }
        if (Math.abs(newY - (item.y + itemHeight)) < SNAP_DISTANCE) {
          finalHeight = newHeight + (newY - (item.y + itemHeight));
          finalY = item.y + itemHeight;
          snapGuide.y = item.y + itemHeight;
        }
      }
    });

    setSnapGuide(snapGuide);

    // Функция для рекурсивного обновления элемента
    const updateItemInTree = (items: CanvasItem[], itemId: string, updates: Partial<CanvasItem>): CanvasItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updates };
        }
        
        // Если элемент внутри Box
        if (item.type === 'box' && item.items) {
          return {
            ...item,
            items: updateItemInTree(item.items, itemId, updates)
          };
        }
        
        return item;
      });
    };

    setCanvases(canvases.map(canvas => 
      canvas.id === activeCanvasId 
        ? { 
            ...canvas, 
            items: updateItemInTree(
              canvas.items, 
              startItem.id, 
              { width: finalWidth, height: finalHeight, x: finalX, y: finalY }
            )
          } 
        : canvas
    ));
  };

  const handleResizeEnd = () => {
    setResizeState({
      isResizing: false,
      handle: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startItem: null,
      startItemX: 0,
      startItemY: 0
    });
    setSnapGuide({});
  };

  const handleCanvasPropertyChange = (property: string, value: string | number | boolean) => {
    setCanvases(canvases.map(canvas => 
      canvas.id === activeCanvasId 
        ? { ...canvas, [property]: value }
        : canvas
    ));
  };

  const addNewCanvas = () => {
    const newCanvas: CanvasArea = {
      id: Date.now().toString(),
      name: `Канвас ${canvases.length + 1}`,
      items: [],
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      showBorder: true
    };
    setCanvases([...canvases, newCanvas]);
    setActiveCanvasId(newCanvas.id);
  };

  const updateCanvasName = (id: string, name: string) => {
    setCanvases(canvases.map(canvas => 
      canvas.id === id ? { ...canvas, name } : canvas
    ));
  };

  const deleteCanvas = (id: string) => {
    if (canvases.length <= 1) return;
    setCanvases(canvases.filter(canvas => canvas.id !== id));
    if (activeCanvasId === id) {
      setActiveCanvasId(canvases[0].id);
    }
  };

  const getSnapPosition = (x: number, y: number, currentItemId: string, isResizing: boolean = false, handle?: ResizeHandle) => {
    let snapX = x;
    let snapY = y;
    let snapGuide: { x?: number; y?: number } = {};

    const currentItem = activeCanvas.items.find(i => i.id === currentItemId);
    if (!currentItem) return { snapX, snapY, snapGuide };

    const currentWidth = currentItem.width || (currentItem.type === 'button' ? 100 : currentItem.type === 'image' ? 100 : 200);
    const currentHeight = currentItem.height || (currentItem.type === 'button' ? 40 : currentItem.type === 'image' ? 100 : 200);

    // Функция для получения всех элементов НЕ находящихся внутри Box
    const getTopLevelItems = (items: CanvasItem[]): CanvasItem[] => {
      const topLevelItems: CanvasItem[] = [];
      
      const processItems = (itemList: CanvasItem[]) => {
        itemList.forEach(item => {
          // Добавляем только элементы без parentBoxId (не вложенные в Box)
          if (!item.parentBoxId || item.parentBoxId === '') {
            topLevelItems.push(item);
          }
          
          // Рекурсивно обрабатываем элементы внутри Box (но не добавляем их в список для snap)
          if (item.type === 'box' && item.items) {
            processItems(item.items);
          }
        });
      };
      
      processItems(items);
      return topLevelItems;
    };

    const topLevelItems = getTopLevelItems(activeCanvas.items);
    const otherItems = topLevelItems.filter(item => item.id !== currentItemId);

    otherItems.forEach(item => {
      const itemWidth = item.width || (item.type === 'button' ? 100 : item.type === 'image' ? 100 : 200);
      const itemHeight = item.height || (item.type === 'button' ? 40 : item.type === 'image' ? 100 : 200);

      // Выравнивание по краям
      const edges = [
        { pos: x, target: item.x, guide: item.x }, // левый к левому
        { pos: x, target: item.x + itemWidth, guide: item.x + itemWidth }, // левый к правому
        { pos: x + currentWidth, target: item.x, guide: item.x }, // правый к левому
        { pos: x + currentWidth, target: item.x + itemWidth, guide: item.x + itemWidth }, // правый к правому
        
        { pos: y, target: item.y, guide: item.y }, // верхний к верхнему
        { pos: y, target: item.y + itemHeight, guide: item.y + itemHeight }, // верхний к нижнему
        { pos: y + currentHeight, target: item.y, guide: item.y }, // нижний к верхнему
        { pos: y + currentHeight, target: item.y + itemHeight, guide: item.y + itemHeight }, // нижний к нижнему
      ];

      edges.forEach(edge => {
        if (Math.abs(edge.pos - edge.target) < SNAP_DISTANCE) {
          if (edge.pos === x) snapX = edge.target;
          if (edge.pos === x + currentWidth) snapX = edge.target - currentWidth;
          if (edge.pos === y) snapY = edge.target;
          if (edge.pos === y + currentHeight) snapY = edge.target - currentHeight;
          snapGuide.x = edge.guide;
          snapGuide.y = edge.guide;
        }
      });

      // Выравнивание по центрам
      const currentCenterX = x + currentWidth / 2;
      const currentCenterY = y + currentHeight / 2;
      const itemCenterX = item.x + itemWidth / 2;
      const itemCenterY = item.y + itemHeight / 2;

      if (Math.abs(currentCenterX - itemCenterX) < SNAP_DISTANCE) {
        snapX = itemCenterX - currentWidth / 2;
        snapGuide.x = itemCenterX;
      }
      if (Math.abs(currentCenterY - itemCenterY) < SNAP_DISTANCE) {
        snapY = itemCenterY - currentHeight / 2;
        snapGuide.y = itemCenterY;
      }
    });

    return { snapX, snapY, snapGuide };
  };

  useEffect(() => {
    setActiveItem(null);
  }, [activeCanvasId]);

  const handleDragStart = (type: 'button' | 'image' | 'box', e?: React.DragEvent, item?: CanvasItem, parentBoxId?: string) => {
    // Если перетаскиваем существующий элемент (из канваса или Box)
    if (item && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      setDraggedItem({
        item: { ...item },
        parentBoxId: parentBoxId
      });
      return;
    }

    // Если создаем новый элемент из палитры
    const baseItem = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      scale: 1,
    };

    let newItem: CanvasItem;
    
    if (type === 'button') {
      newItem = {
        ...baseItem,
        content: 'Новый элемент',
        backgroundColor: '#3b82f6',
        controlType: 'Button',
        comment: '',
        width: 100,
        height: 40,
      };
    } else if (type === 'image') {
      newItem = {
        ...baseItem,
        src: '/imageExample.svg',
        width: 100,
        height: 100,
      };
    } else { // box
      newItem = {
        ...baseItem,
        width: 200,
        height: 200,
        backgroundColor: '#f3f4f6',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        gap: 10,
        padding: 10,
        items: [],
        minWidth: 20,
        minHeight: 20
      };
    }

    setDraggedItem({
      item: newItem,
      isNew: true
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - dragOffset.x;
    let y = e.clientY - rect.top - dragOffset.y;

    // ПРОВЕРЯЕМ: если элемент уже находится внутри Box, отключаем snap
    const isInsideBox = !!draggedItem.parentBoxId;
    
    let snapX = x;
    let snapY = y;
    let snapGuide: { x?: number; y?: number } = {};

    // Применяем примагничивание ТОЛЬКО для элементов не внутри Box
    if (!isInsideBox) {
      const snapResult = getSnapPosition(
        x, 
        y, 
        draggedItem.item.id,
        false
      );
      snapX = snapResult.snapX;
      snapY = snapResult.snapY;
      snapGuide = snapResult.snapGuide;
    } else {
      // Для элементов внутри Box используем исходные координаты
      snapX = x;
      snapY = y;
    }

    x = snapX;
    y = snapY;
    
    // Если это новое перетаскивание из палитры, тоже отключаем snap
    if (draggedItem.isNew && draggedItem.item.type !== 'box') {
      x = x;
      y = y;
    }

    setSnapGuide(snapGuide);

    if (draggedItem.item.type === 'box' && draggedItem.parentBoxId) {
      // Специальная логика для детача Box из Box
      const removeBoxFromParent = (items: CanvasItem[], parentBoxId: string, boxToRemoveId: string): CanvasItem[] => {
        return items.map(item => {
          if (item.id === parentBoxId) {
            return {
              ...item,
              items: item.items?.filter(i => i.id !== boxToRemoveId) || []
            };
          }
          
          // Рекурсивно ищем родительский Box во вложенных
          if (item.type === 'box' && item.items) {
            return {
              ...item,
              items: removeBoxFromParent(item.items, parentBoxId, boxToRemoveId)
            };
          }
          
          return item;
        });
      };

      // Добавляем Box на основной канвас с абсолютными координатами
      setCanvases(canvases.map(canvas => 
        canvas.id === activeCanvasId 
          ? { 
              ...canvas, 
              items: [
                ...removeBoxFromParent(canvas.items, draggedItem.parentBoxId!, draggedItem.item.id),
                { 
                  ...draggedItem.item, 
                  x, 
                  y,
                  parentBoxId: undefined // Убираем ссылку на родительский Box
                }
              ]
            } 
          : canvas
      ));
      
      setDraggedItem(null);
      setTimeout(() => setSnapGuide({}), 300);
      return;
    }

    // Рекурсивная функция для поиска Box, в который попадает точка
    // Рекурсивная функция для поиска Box, в который попадает точка
    const findTargetBox = (items: CanvasItem[], targetX: number, targetY: number, currentDepth: number = 0): { box: CanvasItem, depth: number, relativeX: number, relativeY: number } | undefined => {
      let deepestBox: { box: CanvasItem, depth: number, relativeX: number, relativeY: number } | undefined;
      
      for (const item of items) {
        if (item.type === 'box' && item.id !== draggedItem?.item?.id) {
          const itemWidth = item.width || 200;
          const itemHeight = item.height || 200;
          
          // Проверяем попадание в Box
          if (targetX >= item.x && 
              targetX <= item.x + itemWidth && 
              targetY >= item.y && 
              targetY <= item.y + itemHeight) {
            
            // Рассчитываем координаты относительно текущего Box
            const relativeX = targetX - item.x;
            const relativeY = targetY - item.y;
            
            // Рекурсивно проверяем вложенные Box
            if (item.items && item.items.length > 0) {
              const nestedBox = findTargetBox(item.items, relativeX, relativeY, currentDepth + 1);
              if (nestedBox) {
                // Нашли более глубокий Box
                deepestBox = nestedBox;
              } else {
                // Нет более глубокого Box, используем текущий
                if (!deepestBox || currentDepth >= deepestBox.depth) {
                  deepestBox = { 
                    box: item, 
                    depth: currentDepth,
                    relativeX,
                    relativeY
                  };
                }
              }
            } else {
              // В этом Box нет вложенных элементов
              if (!deepestBox || currentDepth >= deepestBox.depth) {
                deepestBox = { 
                  box: item, 
                  depth: currentDepth,
                  relativeX,
                  relativeY
                };
              }
            }
          }
        }
      }
      
      return deepestBox;
    };

    // Ищем целевой Box (самый вложенный, в который попадает точка)
    const targetBoxResult = findTargetBox(activeCanvas.items, x, y);
    const targetBox = targetBoxResult?.box;

    if (draggedItem.isNew) {
      // Новый элемент из палитры
      if (draggedItem.parentBoxId && draggedItem.parentBoxId === targetBox?.id) {
        x = x;
        y = y;
      } else if (targetBox) {
        // Используем уже рассчитанные relativeX и relativeY
        const { relativeX, relativeY } = targetBoxResult;
        
        // Рекурсивная функция для добавления элемента в целевой Box
        const addItemToBox = (items: CanvasItem[], targetBoxId: string, newItem: CanvasItem): CanvasItem[] => {
          return items.map(item => {
            if (item.id === targetBoxId) {
              return {
                ...item,
                items: [...(item.items || []), { 
                  ...newItem, 
                  x: 0, // Сбрасываем координаты
                  y: 0,
                  parentBoxId: targetBoxId
                }]
              };
            }
            
            // Рекурсивно ищем целевой Box во вложенных элементах
            if (item.type === 'box' && item.items) {
              return {
                ...item,
                items: addItemToBox(item.items, targetBoxId, newItem)
              };
            }
            
            return item;
          });
        };

        const updatedItem = { 
          ...draggedItem.item, 
          x: 0, // Сбрасываем координаты
          y: 0,
          parentBoxId: targetBox.id
        };
        
        setCanvases(canvases.map(canvas => 
          canvas.id === activeCanvasId 
            ? { 
                ...canvas, 
                items: addItemToBox(canvas.items, targetBox.id, updatedItem)
              } 
            : canvas
        ));
      } else {
        // Помещаем на основной канвас
        setCanvases(canvases.map(canvas => 
          canvas.id === activeCanvasId 
            ? { 
                ...canvas, 
                items: [...canvas.items, { ...draggedItem.item, x, y }] 
              } 
            : canvas
        ));
      }
    } else {
      if (targetBox && draggedItem.item.id !== targetBox.id) {
        // Используем already calculated relative coordinates
        const { relativeX, relativeY } = targetBoxResult;
        
        // Рекурсивная функция для перемещения элемента между Box
        // В функции handleDrop, в ветке существующего элемента:
        const moveItemToBox = (
          items: CanvasItem[], 
          targetBoxId: string, 
          itemToMove: CanvasItem,
          oldParentBoxId?: string
        ): CanvasItem[] => {
          let itemAdded = false;
          
          // Функция для добавления элемента в целевой Box
          const addToTargetBox = (itemList: CanvasItem[]): CanvasItem[] => {
            return itemList.map(item => {
              if (item.id === targetBoxId) {
                itemAdded = true;
                const currentItems = item.items || [];
                
                // Проверяем, нет ли уже такого элемента в целевом Box
                const alreadyExists = currentItems.some(i => i.id === itemToMove.id);
                
                if (!alreadyExists) {
                  return {
                    ...item,
                    items: [...currentItems, { 
                      ...itemToMove, 
                      x: 0, 
                      y: 0,
                      parentBoxId: targetBoxId
                    }]
                  };
                }
              }
              
              // Рекурсивно обрабатываем вложенные Box
              if (item.type === 'box' && item.items) {
                return {
                  ...item,
                  items: addToTargetBox(item.items)
                };
              }
              
              return item;
            });
          };
          
          // Функция для удаления элемента из старого местоположения
          const removeFromOldLocation = (itemList: CanvasItem[]): CanvasItem[] => {
            if (oldParentBoxId) {
              // Элемент был в другом Box - удаляем его оттуда
              return itemList.map(item => {
                if (item.id === oldParentBoxId) {
                  return {
                    ...item,
                    items: item.items?.filter(i => i.id !== itemToMove.id) || []
                  };
                }
                
                // Рекурсивно ищем старый Box во вложенных
                if (item.type === 'box' && item.items) {
                  return {
                    ...item,
                    items: removeFromOldLocation(item.items)
                  };
                }
                
                return item;
              });
            } else {
              // Элемент был на основном канвасе - удаляем его оттуда
              return itemList.filter(item => item.id !== itemToMove.id)
                .map(item => {
                  // Также рекурсивно обрабатываем вложенные Box
                  if (item.type === 'box' && item.items) {
                    return {
                      ...item,
                      items: removeFromOldLocation(item.items)
                    };
                  }
                  return item;
                });
            }
          };
          
          // Сначала удаляем элемент из старого местоположения
          let itemsAfterRemoval = removeFromOldLocation(items);
          
          // Затем добавляем элемент в новый Box (только если targetBoxId указан)
          if (targetBoxId) {
            itemsAfterRemoval = addToTargetBox(itemsAfterRemoval);
          }
          
          return itemsAfterRemoval;
        };

        setCanvases(canvases.map(canvas => 
          canvas.id === activeCanvasId 
            ? { 
                ...canvas, 
                items: moveItemToBox(
                  canvas.items, 
                  targetBox.id, 
                  draggedItem.item,
                  draggedItem.parentBoxId
                )
              } 
            : canvas
        ));
      } else if (draggedItem.parentBoxId && !targetBox) {
    // Перемещаем элемент из Box обратно на основной канвас
    // Рекурсивная функция для удаления элемента из Box
    const removeItemFromBox = (items: CanvasItem[], parentBoxId: string, itemId: string): CanvasItem[] => {
      return items.map(item => {
        if (item.id === parentBoxId) {
          return {
            ...item,
            items: item.items?.filter(i => i.id !== itemId) || []
          };
        }
        
        // Рекурсивно ищем родительский Box во вложенных
        if (item.type === 'box' && item.items) {
          return {
            ...item,
            items: removeItemFromBox(item.items, parentBoxId, itemId)
          };
        }
        
        return item;
      });
    };
    
    setCanvases(canvases.map(canvas => 
      canvas.id === activeCanvasId 
        ? { 
            ...canvas, 
            items: [
              ...removeItemFromBox(canvas.items, draggedItem.parentBoxId!, draggedItem.item.id),
              { ...draggedItem.item, x, y }
            ]
          } 
        : canvas
    ));
  } else {
        // Перемещаем элемент по основному канвасу
        setCanvases(canvases.map(canvas => 
      canvas.id === activeCanvasId 
        ? { 
            ...canvas, 
            items: canvas.items.map(item => 
              item.id === draggedItem.item.id 
                ? { ...item, x, y } 
                : item
            )
          } 
        : canvas
    ));
      }
    }

    setDraggedItem(null);
    setTimeout(() => setSnapGuide({}), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' && activeItem) {
          // Копирование
          e.preventDefault();
          setClipboard(activeItem);
        } else if (e.key === 'v' && clipboard) {
          // Вставка
          e.preventDefault();
          const newItem = {
            ...clipboard,
            id: Date.now().toString(),
            x: clipboard.x + 20, // Смещаем немного для видимости
            y: clipboard.y + 20
          };
          setCanvases(canvases.map(canvas => 
            canvas.id === activeCanvasId 
              ? { ...canvas, items: [...canvas.items, newItem] } 
              : canvas
          ));
          setActiveItem(newItem);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, clipboard, activeCanvas.items]);

  const handleItemClick = (item: CanvasItem, e: React.MouseEvent, parentBoxId?: string) => {
    // Проверяем, не кликнули ли мы на handle ресайза
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle')) {
      return; // Игнорируем клики на handle'ах
    }
    
    e.stopPropagation();
    
    // Создаем копию элемента с информацией о родительском Box
    const itemWithParentInfo: CanvasItem = { 
      ...item,
      parentBoxId: parentBoxId 
    };
    
    setActiveItem(itemWithParentInfo);
  };

  const renderBoxItems = (box: CanvasItem, parentBoxId?: string) => {
  const hasChildren = box.items && box.items.length > 0;
  
  // Автоматически подстраиваем размер под содержимое
  const calculateContentSize = () => {
    if (hasChildren) {
      let maxX = 0;
      let maxY = 0;
      
      box.items?.forEach(item => {
        const itemWidth = item.width || (item.type === 'button' ? 100 : 100);
        const itemHeight = item.height || (item.type === 'button' ? 40 : 100);
        const itemRight = item.x + itemWidth;
        const itemBottom = item.y + itemHeight;
        
        if (itemRight > maxX) maxX = itemRight;
        if (itemBottom > maxY) maxY = itemBottom;
      });
      
      // Добавляем padding
      const padding = box.padding || 10;
      return {
        contentWidth: Math.max(20, maxX + padding * 2),
        contentHeight: Math.max(20, maxY + padding * 2)
      };
    }
    
    return {
      contentWidth: box.width || 200,
      contentHeight: box.height || 200
    };
  };

  const { contentWidth, contentHeight } = calculateContentSize();
  const displayWidth = box.width || contentWidth;
  const displayHeight = box.height || contentHeight;

  // Если Box находится внутри другого Box, используем flex стили вместо абсолютного позиционирования
  if (parentBoxId) {
    return (
      <div
        key={box.id}
        className={`select-none ${activeItem?.id === box.id ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          transform: `scale(${box.scale})`,
          cursor: 'default',
          minWidth: '20px',
          minHeight: '20px',
          position: 'relative'
        }}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          handleDragStart(box.type as 'button' | 'image' | 'box', e, box, parentBoxId);
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleItemClick(box, e, parentBoxId);
        }}
      >
        <div
          className="h-full relative"
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            backgroundColor: box.backgroundColor || '#f3f4f6',
            display: 'flex',
            flexDirection: box.flexDirection || 'column',
            justifyContent: box.justifyContent || 'flex-start',
            alignItems: box.alignItems || 'stretch',
            flexWrap: box.flexWrap || 'nowrap',
            gap: box.gap ? `${box.gap}px` : '10px',
            padding: box.padding ? `${box.padding}px` : '10px',
            overflow: 'auto',
            minWidth: '20px',
            minHeight: '20px'
          }}
          data-item-id={box.id}
        >
          {/* Если нет элементов, показываем плейсхолдер */}
          {!hasChildren && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Перетащите элементы сюда
            </div>
          )}
          
          {/* Рекурсивно рендерим все элементы внутри Box */}
          {box.items?.map(nestedItem => {
            if (nestedItem.type === 'box') {
              // Рекурсивный рендер вложенных Box
              return renderBoxItems(nestedItem, box.id);
            }
            
            // Рендер обычных элементов внутри Box
            const itemWidth = nestedItem.width || (nestedItem.type === 'button' ? 100 : 100);
            const itemHeight = nestedItem.height || (nestedItem.type === 'button' ? 40 : 100);
            
            return (
              <div
                key={nestedItem.id}
                className="relative"
                style={{
                  position: 'relative',
                  transform: `scale(${nestedItem.scale})`,
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  // Не используем left/top для элементов внутри Box - позиционирование контролируется flexbox
                  flexShrink: 0 // Предотвращаем сжатие элемента
                }}
                data-item-id={nestedItem.id}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  handleDragStart(nestedItem.type as 'button' | 'image', e, nestedItem, box.id);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(nestedItem, e, box.id);
                }}
              >
                {nestedItem.type === 'button' && (
                  <button 
                    className="p-2 text-white rounded relative w-full h-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: nestedItem.backgroundColor,
                      outline: activeItem?.id === nestedItem.id ? '2px solid #3b82f6' : 'none',
                      outlineOffset: '2px'
                    }}
                  >
                    {nestedItem.content}
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                      {nestedItem.controlType || 'Button'}
                    </span>
                  </button>
                )}
                {nestedItem.type === 'image' && (
                  <img 
                    src={nestedItem.src} 
                    alt="Nested" 
                    className="w-full h-full object-contain"
                    style={{ 
                      outline: activeItem?.id === nestedItem.id ? '2px solid #3b82f6' : 'none',
                      outlineOffset: '2px'
                    }} 
                  />
                )}
                {/* Добавляем resize handles для элементов внутри Box */}
                <ResizeHandles item={nestedItem} isActive={activeItem?.id === nestedItem.id} />
              </div>
            );
          })}
        </div>
        
        <ResizeHandles item={{...box, width: displayWidth, height: displayHeight}} isActive={activeItem?.id === box.id} />
      </div>
    );
  }

  // Для Box на основном канвасе используем абсолютное позиционирование
  return (
    <div
      key={box.id}
      className={`absolute select-none ${activeItem?.id === box.id ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: `${box.x}px`,
        top: `${box.y}px`,
        transform: `scale(${box.scale})`,
        cursor: 'default',
        minWidth: '20px',
        minHeight: '20px'
      }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        handleDragStart(box.type as 'button' | 'image' | 'box', e, box, parentBoxId);
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleItemClick(box, e, parentBoxId);
      }}
    >
      <div
        className="h-full relative"
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          backgroundColor: box.backgroundColor || '#f3f4f6',
          display: 'flex',
          flexDirection: box.flexDirection || 'column',
          justifyContent: box.justifyContent || 'flex-start',
          alignItems: box.alignItems || 'stretch',
          flexWrap: box.flexWrap || 'nowrap',
          gap: box.gap ? `${box.gap}px` : '10px',
          padding: box.padding ? `${box.padding}px` : '10px',
          overflow: 'auto',
          minWidth: '20px',
          minHeight: '20px'
        }}
        data-item-id={box.id}
      >
        {/* Если нет элементов, показываем плейсхолдер */}
        {!hasChildren && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Перетащите элементы сюда
          </div>
        )}
        
        {/* Рекурсивно рендерим все элементы внутри Box */}
        {box.items?.map(nestedItem => {
          if (nestedItem.type === 'box') {
            // Рекурсивный рендер вложенных Box
            return renderBoxItems(nestedItem, box.id);
          }
          
          // Рендер обычных элементов внутри Box
          const itemWidth = nestedItem.width || (nestedItem.type === 'button' ? 100 : 100);
          const itemHeight = nestedItem.height || (nestedItem.type === 'button' ? 40 : 100);
          
          return (
            <div
              key={nestedItem.id}
              className="relative"
              style={{
                position: 'relative',
                transform: `scale(${nestedItem.scale})`,
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                flexShrink: 0
              }}
              data-item-id={nestedItem.id}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handleDragStart(nestedItem.type as 'button' | 'image', e, nestedItem, box.id);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(nestedItem, e, box.id);
              }}
            >
              {nestedItem.type === 'button' && (
                <button 
                  className="p-2 text-white rounded relative w-full h-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: nestedItem.backgroundColor,
                    outline: activeItem?.id === nestedItem.id ? '2px solid #3b82f6' : 'none',
                    outlineOffset: '2px'
                  }}
                >
                  {nestedItem.content}
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                    {nestedItem.controlType || 'Button'}
                  </span>
                </button>
              )}
              {nestedItem.type === 'image' && (
                <img 
                  src={nestedItem.src} 
                  alt="Nested" 
                  className="w-full h-full object-contain"
                  style={{ 
                    outline: activeItem?.id === nestedItem.id ? '2px solid #3b82f6' : 'none',
                    outlineOffset: '2px'
                  }} 
                />
              )}
              {/* Добавляем resize handles для элементов внутри Box */}
              <ResizeHandles item={nestedItem} isActive={activeItem?.id === nestedItem.id} />
            </div>
          );
        })}
      </div>
      
      <ResizeHandles item={{...box, width: displayWidth, height: displayHeight}} isActive={activeItem?.id === box.id} />
    </div>
  );
};

  
  const handlePropertyChange = (property: string, value: string | number) => {
    if (!activeItem) return;
    
    console.log(`Changing ${property} to ${value}`); // Добавьте логирование
    
    setCanvases(canvases.map(canvas => 
      canvas.id === activeCanvasId 
        ? { 
            ...canvas, 
            items: canvas.items.map(canvasItem => {
              // Рекурсивно обновляем элемент
              const updateItemsRecursively = (items: CanvasItem[]): CanvasItem[] => {
                return items.map(item => {
                  if (item.id === activeItem.id) {
                    return { ...item, [property]: value };
                  }
                  
                  if (item.type === 'box' && item.items) {
                    return {
                      ...item,
                      items: updateItemsRecursively(item.items)
                    };
                  }
                  
                  return item;
                });
              };
              
              return updateItemsRecursively([canvasItem])[0];
            })
          } 
        : canvas
    ));
    
    setActiveItem({ ...activeItem, [property]: value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeItem) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        handlePropertyChange('src', event.target.result as string);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const deleteActiveItem = () => {
  if (!activeItem) return;
  
  const deleteItemFromTree = (items: CanvasItem[]): CanvasItem[] => {
    if (activeItem.parentBoxId) {
      // Удаляем из конкретного родительского Box
      return items.map(item => {
        if (item.id === activeItem.parentBoxId) {
          return {
            ...item,
            items: item.items?.filter(i => i.id !== activeItem.id) || []
          };
        }
        
        // Рекурсивно ищем родительский Box во вложенных
        if (item.type === 'box' && item.items) {
          return {
            ...item,
            items: deleteItemFromTree(item.items)
          };
        }
        
        return item;
      });
    } else {
      // Удаляем с основного канваса
      return items
        .map(item => {
          // Рекурсивно обрабатываем вложенные Box
          if (item.type === 'box' && item.items) {
            return {
              ...item,
              items: deleteItemFromTree(item.items)
            };
          }
          return item;
        })
        .filter(item => item.id !== activeItem.id);
    }
  };
  
  setCanvases(canvases.map(canvas => 
    canvas.id === activeCanvasId 
      ? { 
          ...canvas, 
          items: deleteItemFromTree(canvas.items)
        } 
      : canvas
  ));
  
  setActiveItem(null);
};

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Левая панель элементов (25%) */}
      <div className="w-1/4 p-4 bg-white border-r border-gray-300">
        {/* Переключатель вкладок */}
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`flex-1 p-2 ${activeTab === 'elements' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('elements')}
          >
            Элементы
          </button>
          <button
            className={`flex-1 p-2 ${activeTab === 'canvases' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('canvases')}
          >
            Канвасы
          </button>
        </div>

        {activeTab === 'elements' ? (
          <>
            <h2 className="text-lg font-bold mb-4">Элементы</h2>
            {/* Элементы управления */}
            <div
              draggable
              onDragStart={() => handleDragStart('button')}
              className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-move"
            >
              Элемент управления
              <span className="block text-xs opacity-75">(Button, Accordion, CheckBox, ListView, Input)</span>
            </div>

            <div
              draggable
              onDragStart={() => handleDragStart('image')}
              className="w-full p-2 border border-gray-300 rounded cursor-move"
            >
              <ImageButton/>
              <p className="text-center mt-2">Изображение</p>
            </div>

            <div
              draggable
              onDragStart={() => handleDragStart('box')}
              className="w-full p-2 mb-2 bg-gray-200 border border-gray-300 rounded cursor-move"
            >
              <div className="flex items-center justify-center h-12 border-2 border-dashed border-gray-400">
                <span className="text-gray-600">Box (Flex контейнер)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">Канвасы</h2>

            <label className="w-full p-2 mb-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Загрузить .SMUX файл
              <input
                type="file"
                accept=".smux"
                onChange={handleSmuxFileUpload}
                className="hidden"
              />
            </label>
            
            {/* Кнопка сохранения текущего канваса */}
            <button
              onClick={saveCurrentCanvas}
              className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Сохранить текущий канвас
            </button>
            
            <button
              onClick={addNewCanvas}
              className="w-full p-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Новый канвас
            </button>
            
            {/* Сохраненные канвасы */}
            {savedCanvases.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Сохраненные канвасы:</h3>
                <div className="space-y-2">
                  {savedCanvases.map(canvas => (
                    <div
                      key={canvas.id}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{canvas.name}</h4>
                          <p className="text-xs text-gray-500">
                            {canvas.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadCanvasFromSmux(canvas)}
                            className="text-blue-500 hover:text-blue-700 text-sm p-1"
                            title="Загрузить"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => downloadSmuxFile(canvas)}
                            className="text-green-500 hover:text-green-700 text-sm p-1"
                            title="Скачать .SMUX файл"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteSavedCanvas(canvas.id)}
                            className="text-red-500 hover:text-red-700 text-sm p-1"
                            title="Удалить"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded font-mono whitespace-pre-wrap overflow-auto max-h-20">
                        {canvas.smuxData.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Текущие канвасы */}
            <h3 className="font-bold mb-2">Текущие канвасы:</h3>
            {canvases.map(canvas => (
              <div
                key={canvas.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  activeCanvasId === canvas.id ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveCanvasId(canvas.id)}
              >
                <input
                  type="text"
                  value={canvas.name}
                  onChange={(e) => updateCanvasName(canvas.id, e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCanvas(canvas.id);
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  Удалить
                </button>
              </div>
            ))}
          </>
        )}
      </div>


      {/* Холст (50%) */}
      <div className="w-2/4 overflow-auto border border-gray-200 p-4">
        <div 
          ref={canvasRef}
          className="relative bg-white touch-none"
          style={{
            width: `${activeCanvas.width}px`,
            height: `${activeCanvas.height}px`,
            backgroundColor: activeCanvas.backgroundColor,
            border: activeCanvas.showBorder ? `2px dashed ${activeCanvas.borderColor}` : 'none',
            margin: '0 auto',
            minWidth: 'min-content',
            minHeight: 'min-content'
          }}
          onClick={() => setActiveItem(null)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={resizeState.isResizing ? handleResize : undefined}
          onMouseUp={resizeState.isResizing ? handleResizeEnd : undefined}
          onMouseLeave={resizeState.isResizing ? handleResizeEnd : undefined}
        >
          {/* Направляющие */}
          {snapGuide.x !== undefined && (
            <div 
              className="absolute top-0 w-px bg-red-500 z-50"
              style={{ left: `${snapGuide.x}px`, height: `${activeCanvas.height}px` }}
            />
          )}
          {snapGuide.y !== undefined && (
            <div 
              className="absolute left-0 h-px bg-red-500 z-50"
              style={{ top: `${snapGuide.y}px`, width: `${activeCanvas.width}px` }}
            />
          )}
          {activeCanvas.items.map(item => {
            if (item.type === 'box') {
              return renderBoxItems(item);
            }
            
            return (
              <div
                key={item.id}
                className={`absolute select-none ${activeItem?.id === item.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `scale(${item.scale})`,
                  cursor: 'default'
                }}
                draggable
                onDragStart={(e) => handleDragStart(item.type as 'button' | 'image', e, item)}
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.type === 'button' ? (
                  <button 
                    className="p-2 text-white rounded relative"
                    style={{
                      width: item.width ? `${item.width}px` : 'auto',
                      height: item.height ? `${item.height}px` : 'auto',
                      backgroundColor: item.backgroundColor || '#3b82f6'
                    }}
                  >
                    {item.content}
                    {/* Показываем тип элемента в виде маленького бейджа */}
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                      {item.controlType || 'Button'}
                    </span>
                  </button>
                ) : item.type === 'image' ? (
                  <img 
                    src={item.src} 
                    alt="Draggable" 
                    className="cursor-move"
                    style={{
                      width: item.width ? `${item.width}px` : '100px',
                      height: item.height ? `${item.height}px` : '100px'
                    }}
                  />
                ) : null}
                <ResizeHandles item={item} isActive={activeItem?.id === item.id} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Панель свойств (25%) */}
      <ScrollShadow className='w-1/4 h-3/4' offset={30}>
      <div className="p-4 bg-white border-l border-gray-300 w-full">
        <h2 className="text-lg font-bold mb-4">Свойства</h2>
        
        {activeItem ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded">
              Ctrl+C - копировать, Ctrl+V - вставить
            </div>
            {activeItem.type === 'button' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Тип элемента</label>
                  <select
                    value={activeItem.controlType || 'Button'}
                    onChange={(e) => handlePropertyChange('controlType', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {ALL_CONTROL_TYPES.map((controlType) => (
                      <option key={controlType} value={controlType}>
                        {controlType}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Текст</label>
                  <input
                    type="text"
                    value={activeItem.content || ''}
                    onChange={(e) => handlePropertyChange('content', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Заметки</label>
                  <textarea
                    value={activeItem.comment || ''}
                    onChange={(e) => handlePropertyChange('comment', e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Введите заметки к элементу..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ширина</label>
                  <input
                    type="number"
                    value={activeItem.width || ''}
                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Высота</label>
                  <input
                    type="number"
                    value={activeItem.height || ''}
                    onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Цвет фона</label>
                  <input
                    type="color"
                    value={activeItem.backgroundColor || '#3b82f6'}
                    onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>
              </>
            )}

            {activeItem?.type === 'box' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Направление flex</label>
                  <select
                    value={activeItem.flexDirection || 'column'}
                    onChange={(e) => handlePropertyChange('flexDirection', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Выравнивание по главной оси</label>
                  <select
                    value={activeItem.justifyContent || 'flex-start'}
                    onChange={(e) => handlePropertyChange('justifyContent', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="flex-start">Flex Start</option>
                    <option value="flex-end">Flex End</option>
                    <option value="center">Center</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Выравнивание по поперечной оси</label>
                  <select
                    value={activeItem.alignItems || 'stretch'}
                    onChange={(e) => handlePropertyChange('alignItems', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="flex-start">Flex Start</option>
                    <option value="flex-end">Flex End</option>
                    <option value="center">Center</option>
                    <option value="stretch">Stretch</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Перенос элементов</label>
                  <select
                    value={activeItem.flexWrap || 'nowrap'}
                    onChange={(e) => handlePropertyChange('flexWrap', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="nowrap">No Wrap</option>
                    <option value="wrap">Wrap</option>
                    <option value="wrap-reverse">Wrap Reverse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Расстояние между элементами</label>
                  <input
                    type="number"
                    value={activeItem.gap || 10}
                    onChange={(e) => handlePropertyChange('gap', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Внутренний отступ</label>
                  <input
                    type="number"
                    value={activeItem.padding || 10}
                    onChange={(e) => handlePropertyChange('padding', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Цвет фона</label>
                  <input
                    type="color"
                    value={activeItem.backgroundColor || '#f3f4f6'}
                    onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ширина</label>
                  <input
                    type="number"
                    value={activeItem.width || 200}
                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                    min="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Высота</label>
                  <input
                    type="number"
                    value={activeItem.height || 200}
                    onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                    min="60"
                  />
                </div>
              </>
            )}
            
            {activeItem.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Изображение</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ширина</label>
                  <input
                    type="number"
                    value={activeItem.width || 100}
                    onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Высота</label>
                  <input
                    type="number"
                    value={activeItem.height || 100}
                    onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <img 
                    src={activeItem.src} 
                    alt="Preview" 
                    className="mt-2 border rounded"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px'
                    }}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Масштаб: {activeItem.scale.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={activeItem.scale}
                onChange={(e) => handlePropertyChange('scale', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Позиция X</label>
              <input
                type="number"
                value={Math.round(activeItem.x)}
                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Позиция Y</label>
              <input
                type="number"
                value={Math.round(activeItem.y)}
                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={deleteActiveItem}
              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Удалить элемент
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500">Выберите элемент для редактирования</p>
            
            <h3 className="font-bold">Свойства Canvas</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ширина</label>
              <input
                type="number"
                value={activeCanvas.width}
                onChange={(e) => handleCanvasPropertyChange('width', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Высота</label>
              <input
                type="number"
                value={activeCanvas.height}
                onChange={(e) => handleCanvasPropertyChange('height', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Цвет фона</label>
              <input
                type="color"
                value={activeCanvas.backgroundColor}
                onChange={(e) => handleCanvasPropertyChange('backgroundColor', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Цвет границы</label>
              <input
                type="color"
                value={activeCanvas.borderColor}
                onChange={(e) => handleCanvasPropertyChange('borderColor', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showBorder"
                checked={activeCanvas.showBorder}
                onChange={(e) => handleCanvasPropertyChange('showBorder', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showBorder">Показывать границу</label>
            </div>
          </div>
        )}
      </div>
      </ScrollShadow>
    </div>
  );
}
