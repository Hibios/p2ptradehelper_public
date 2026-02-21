import { Article, Template, Theme } from "./api";

export interface ModalContextProps {
    isOpen: boolean;
    header: string;
    body: string;
    buttonText?: string;
    inputPlaceholder?: string;
    onConfirm: ((value: string) => void) | undefined;
    onOpenChange: () => void;
    openModal: (header: string, body: string, onConfirm?: (value: string) => void, buttonText?: string, inputPlaceholder?: string) => void;
}

interface MAutocompleteProps {
    default?: CatalogProduct | undefined;
    onValueChange?: (product: CatalogProduct) => void;
}

export interface ResponseProps {
    detail: string;
    status: number;
}

export interface editThemeProps {
    theme?: Theme;
    create: boolean;
    isOpen: boolean;
    onOpenChange: () => void;
}

export interface editArticleProps {
    article?: Article;
    create: boolean;
    isOpen: boolean;
    onOpenChange: () => void;
}

export interface editTemplateProps {
    template?: Template;
    create: boolean;
    isOpen: boolean;
    onOpenChange: () => void;
}


// Если файл нужно отправлять в родительском компоненте
type UploadFileProps = {
    isOpen: boolean;
    onOpenChange: () => void; 
    file: File | null;
    setFile: (file: File | null) => void;
    uploading: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface FetchWrapperOptions extends RequestInit {
    params?: Record<string, any>;
    handleErrors?: (status: number) => void;
}


export type ControlType = 
  | 'Accordion'
  | 'Alert'
  | 'Autocomplete'
  | 'Avatar'
  | 'Badge'
  | 'Breadcrumbs'
  | 'Button'
  | 'Calendar'
  | 'Card'
  | 'Checkbox'
  | 'Checkbox Group'
  | 'Chip'
  | 'Circular Progress'
  | 'Code'
  | 'Date Input'
  | 'Date Picker'
  | 'Date Range Picker'
  | 'Divider'
  | 'Drawer'
  | 'Dropdown'
  | 'Form'
  | 'Image'
  | 'Input'
  | 'Input OTP'
  | 'Kbd'
  | 'Link'
  | 'Listbox'
  | 'Modal'
  | 'Navbar'
  | 'Number Input'
  | 'Pagination'
  | 'Popover'
  | 'Progress'
  | 'Radio Group'
  | 'Range Calendar'
  | 'Scroll Shadow'
  | 'Select'
  | 'Skeleton'
  | 'Slider'
  | 'Snippet'
  | 'Spacer'
  | 'Spinner'
  | 'Switch'
  | 'Table'
  | 'Tabs'
  | 'Textarea'
  | 'Time Input'
  | 'Toast'
  | 'Tooltip';

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';
export type ResizeState = {
  isResizing: boolean;
  handle: ResizeHandle | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startItem: CanvasItem | null;
  startItemX: number;
  startItemY: number;
};

export type DraggedItem = {
  item: CanvasItem;
  parentBoxId?: string; // ID родительского Box, если элемент вложенный
  isNew?: boolean;
};

export type CanvasItem = {
  id: string;
  type: 'button' | 'image' | 'box';
  x: number;
  y: number;
  scale: number;
  content?: string;
  src?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  backgroundColor?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  padding?: number;
  items?: CanvasItem[];
  parentBoxId?: string;
  controlType?: ControlType;
  comment?: string;
};

export type CanvasArea = {
  id: string;
  name: string;
  items: CanvasItem[];
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  showBorder: boolean;
};

export type SmuxCanvas = {
  id: string;
  name: string;
  smuxData: string;
  createdAt: Date;
  updatedAt: Date;
};
