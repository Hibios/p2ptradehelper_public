import { CanvasItem, ControlType, ResponseProps } from "@/types/components";

const createMockResponse = (status: number, statusText: string = '', body: any = null): Response => {
  return {
    ok: status >= 200 && status < 300,
    status: status,
    statusText: statusText,
    json: async () => body ? Promise.resolve(body) : Promise.reject('No body'),
    text: async () => body ? Promise.resolve(JSON.stringify(body)) : Promise.reject('No body'),
  } as Response;
};

export const getHeaders = (file?: boolean, req?: string, customHeaders?: Record<string, string>, author?: string): HeadersInit => {
  let token = process.env.API_TOKEN;

  const headers: HeadersInit = {}

  if (!file) {
    headers['Content-Type'] = `application/json`;
  }
  if (req) headers['rq-uid'] = req;
  if (author) headers['user'] = author;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });
  }

  return headers;
}

type FetchWrapperOptions = RequestInit & {handleErrors?: (status: number) => void};

export const fetchWrapper = async (url: string, options: FetchWrapperOptions & { params?: Record<string, any> } = {}, modal: any): Promise<Response> => {
  const { params, handleErrors, ...fetchOptions } = options;

  const finalUrl = (() => {
    if (!params) return url;
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value == "") return;
      
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
  })();

  try {
    const response = await fetch(finalUrl, fetchOptions);

    if (!response.ok && response.status != 302) {
      if (handleErrors) {
        handleErrors(response.status);
      } else {
        switch (response.status) {
          case 400:
            modal('Ошибка', 'Невозможно выполнить данный запрос на стороне сервера');
            break;
          case 401:
            modal('Ошибка', 'Запрос требует аутентификации. Войдите в систему чтобы получить доступ.', 'login', 'Войти');
            break;
          case 404:
            modal('Ошибка', 'Сервер не может найти запрашиваемый ресурс');
            break;
          case 500:
            modal('Ошибка', 'Сервер столкнулся с внутренней ошибкой и не может выполнить запрос');
            break;
          default:
            modal('Ошибка', `Непредвиденная ошибка: ${response.status}`);
        }
      }
    }

    return response;
  } catch (error) {
    modal('Ошибка', `Непредвиденная ошибка: ${error}`);
    return createMockResponse(500, 'Непредвиденная ошибка: ', error);
  }
};

export const fetchCheck = async (response: ResponseProps, modal: any): Promise<Response | undefined> => {
  if (response.status != 200 && response.status != 302) {
    try {
      switch (response.status) {
        case 400:
          modal('Ошибка', 'Невозможно выполнить данный запрос на стороне сервера');
          break;
        case 401:
          modal('Ошибка', 'Запрос требует аутентификации. Войдите в систему чтобы получить доступ.', 'login', 'Войти');
          break;
        case 403:
          const detail = response.detail;
          const regex = /allowed roles: \['(.*?)'\]/;
          const match = detail.match(regex);
          if (match && match[1]) {
            const role = match[1];
            modal('Ошибка', `Доступ запрещён, действие возможно только под ролью "${role}"`, 'logout', 'Выйти');
          } else {
            modal('Ошибка', 'Доступ запрещён', 'logout', 'Выйти');
          }
          break;
        case 404:
          modal('Ошибка', 'Сервер не может найти запрашиваемый ресурс');
          break;
        case 500:
          modal('Ошибка', 'Сервер столкнулся с внутренней ошибкой и не может выполнить запрос');
          break;
        default:
          modal('Ошибка', `Непредвиденная ошибка: ${response.status}`);
      }
      return new Response(null, { status: response.status });
    } catch (error) {
      modal('Ошибка', `Непредвиденная ошибка: ${error}`);
      return new Response(null, { status: 500 }); // Возвращаем ответ с ошибкой
    }
  }
};

export function decodeBase64ToUTF8(base64String: string): string {
  const buffer = Buffer.from(base64String, 'base64');
  const decodedText = buffer.toString('utf-8');
  return decodedText;
}






export type SmuxElement = {
  type: 'widget' | 'flex' | 'image';
  properties: Record<string, string>;
  children: SmuxElement[];
  indentLevel: number;
};

export const parseSmuxData = (smuxData: string): CanvasItem[] => {
  const lines = smuxData.split('\n');
  const stack: { element: SmuxElement; parentId?: string }[] = [];
  const elements: SmuxElement[] = [];
  let currentElement: SmuxElement | null = null;
  let currentIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Пропускаем пустые строки и комментарии
    if (!trimmedLine || trimmedLine.startsWith('<!--')) {
      continue;
    }

    // Определяем отступ
    const indent = line.match(/^\s*/)?.[0].length || 0;
    
    // Открывающий тег
    if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</')) {
      const tagMatch = trimmedLine.match(/<(\w+)>/);
      if (tagMatch) {
        const element: SmuxElement = {
          type: tagMatch[1] as 'widget' | 'flex' | 'image',
          properties: {},
          children: [],
          indentLevel: indent
        };
        
        if (currentElement && indent > currentElement.indentLevel) {
          // Это дочерний элемент
          currentElement.children.push(element);
          stack.push({ element, parentId: stack[stack.length - 1]?.element ? String(stack.length) : undefined });
        } else {
          // Это корневой элемент
          elements.push(element);
          stack.push({ element });
        }
        
        currentElement = element;
      }
    }
    // Закрывающий тег
    else if (trimmedLine.startsWith('</')) {
      stack.pop();
      currentElement = stack.length > 0 ? stack[stack.length - 1].element : null;
    }
    // Свойство
    else if (currentElement && trimmedLine.includes(':')) {
      const [key, ...valueParts] = trimmedLine.split(':');
      const value = valueParts.join(':').trim();
      currentElement.properties[key.trim()] = value;
    }
  }

  // Конвертируем SMUX элементы в CanvasItem
  return convertSmuxToCanvasItems(elements);
  };

  export const convertSmuxToCanvasItems = (smuxElements: SmuxElement[], parentBoxId?: string): CanvasItem[] => {
    return smuxElements.map((smux, index) => {
      const id = `${parentBoxId || 'root'}_${index}_${Date.now()}`;
      
      if (smux.type === 'flex') {
        // Flex контейнер - теперь с поддержкой width/height
        const children = convertSmuxToCanvasItems(smux.children, id);
        
        // Пытаемся получить width/height из свойств
        let width = 200;
        let height = 200;
        
        if (smux.properties.width && smux.properties.width !== '-') {
          width = parseInt(smux.properties.width);
        }
        
        if (smux.properties.height && smux.properties.height !== '-') {
          height = parseInt(smux.properties.height);
        }
        
        // Если размеры не указаны, вычисляем по содержимому
        if ((!smux.properties.width || smux.properties.width === '-') && children.length > 0) {
          let maxX = 0;
          let maxY = 0;
          
          children.forEach(child => {
            const childWidth = child.width || (child.type === 'button' ? 100 : 100);
            const childHeight = child.height || (child.type === 'button' ? 40 : 100);
            const childRight = child.x + childWidth;
            const childBottom = child.y + childHeight;
            
            if (childRight > maxX) maxX = childRight;
            if (childBottom > maxY) maxY = childBottom;
          });
          
          // Добавляем padding
          const padding = parseInt(smux.properties.padding) || 10;
          width = Math.max(100, maxX + padding * 2);
          height = Math.max(60, maxY + padding * 2);
        }
        
        const boxItem: CanvasItem = {
          id,
          type: 'box',
          x: smux.properties.x === '-' ? 0 : parseInt(smux.properties.x) || 0,
          y: smux.properties.y === '-' ? 0 : parseInt(smux.properties.y) || 0,
          scale: 1,
          width: width,
          height: height,
          backgroundColor: '#f3f4f6',
          flexDirection: convertFlexDirection(smux.properties.dir),
          justifyContent: convertJustifyContent(smux.properties.justify),
          alignItems: convertAlignItems(smux.properties.align),
          gap: parseInt(smux.properties.spacing) || 10,
          padding: parseInt(smux.properties.padding) || 10,
          items: children,
          parentBoxId: parentBoxId,
          minWidth: 100,
          minHeight: 60
        };
        
        return boxItem;
      }
      else if (smux.type === 'widget') {
        const widgetType = smux.properties.type as ControlType;
        
        let content = smux.properties.content;
        if (content && content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        }
        
        let notes = smux.properties.notes;
        if (notes && notes.startsWith('"') && notes.endsWith('"')) {
          notes = notes.slice(1, -1);
        }
        
        // Парсим ширину и высоту
        let width: number | undefined = undefined;
        let height: number | undefined = undefined;
        
        if (smux.properties.width !== '-' && smux.properties.width) {
          width = parseInt(smux.properties.width);
        }
        
        if (smux.properties.height !== '-' && smux.properties.height) {
          height = parseInt(smux.properties.height);
        }
        
        const item: CanvasItem = {
          id,
          type: 'button',
          x: smux.properties.x === '-' ? 0 : parseInt(smux.properties.x) || 0,
          y: smux.properties.y === '-' ? 0 : parseInt(smux.properties.y) || 0,
          scale: 1,
          content: content || 'Новый элемент',
          backgroundColor: getDefaultColorByType(widgetType),
          controlType: widgetType,
          comment: notes || '',
          width: width,
          height: height,
          parentBoxId: parentBoxId
        };
        
        // Если не указаны размеры, устанавливаем дефолтные
        if (!item.width) {
          item.width = 100;
        }
        if (!item.height) {
          item.height = item.controlType === 'Input' ? 30 : 40;
        }
        
        return item;
      }
      else if (smux.type === 'image') {
        // Image элемент
        let src = smux.properties.src;
        if (src && src.startsWith('"') && src.endsWith('"')) {
          src = src.slice(1, -1);
        }
        
        // Парсим ширину и высоту
        let width: number = 100;
        let height: number = 100;
        
        if (smux.properties.width !== '-' && smux.properties.width) {
          width = parseInt(smux.properties.width);
        }
        
        if (smux.properties.height !== '-' && smux.properties.height) {
          height = parseInt(smux.properties.height);
        }
        
        const item: CanvasItem = {
          id,
          type: 'image',
          x: smux.properties.x === '-' ? 0 : parseInt(smux.properties.x) || 0,
          y: smux.properties.y === '-' ? 0 : parseInt(smux.properties.y) || 0,
          scale: 1,
          src: src || '/imageExample.svg',
          width: width,
          height: height,
          parentBoxId: parentBoxId
        };
        
        return item;
      }
      
      // Fallback
      return {
        id,
        type: 'button',
        x: 0,
        y: 0,
        scale: 1,
        content: 'Unknown element',
        backgroundColor: '#3b82f6',
        controlType: 'Button',
        width: 100,
        height: 40,
        parentBoxId: parentBoxId
      };
    });
  };

// Вспомогательные функции для конвертации значений
export const convertFlexDirection = (dir: string): 'row' | 'column' | 'row-reverse' | 'column-reverse' => {
  switch (dir) {
    case 'row': return 'row';
    case 'column': return 'column';
    case 'row-reverse': return 'row-reverse';
    case 'column-reverse': return 'column-reverse';
    default: return 'column';
  }
};

export const convertJustifyContent = (justify: string): CanvasItem['justifyContent'] => {
  switch (justify) {
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'between': return 'space-between';
    case 'around': return 'space-around';
    default: return 'flex-start';
  }
};

export const convertAlignItems = (align: string): CanvasItem['alignItems'] => {
  switch (align) {
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'stretch': return 'stretch';
    default: return 'stretch';
  }
};

export const getDefaultColorByType = (type: ControlType): string => {
  switch (type) {
    case 'Button': return '#3b82f6';
    case 'Accordion': return '#10b981';
    case 'Checkbox': return '#8b5cf6';
    case 'Listbox': return '#f59e0b';
    case 'Input': return '#6b7280';
    default: return '#3b82f6';
  }
};