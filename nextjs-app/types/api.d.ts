export interface Template {
    id: number;
    name: string;
    template: string;
}

export interface TemplateInfo {
    id: number;
    name: string;
}

export interface Session {
    sessionId: string;
    createDt: string;
    ucpId: string;
    theme: number;
    code: string;
    user: string;
    userDivisionCode: string;
}

export interface Theme {
    id: number;
    parent_id: number | null;
    code: string;
    name: string;
    template_info: TemplateInfo;
    useGigachatOnlyWithKnowledgebase: boolean;
    nepoiskErrorText: string;
    uncensoredAnswers: boolean;
}

export interface StatusHistory {
    status: string;
    timestamp: string;
    timestampEnd: string;
    publishedDate: string;
    deactivatedDate: string;
    transitionUser: string;
}

export interface Article {
    articleId: string;
    content: string;
    title: string;
    topic: string;
    topicCode: string;
    chunkNumber: number;
    currentStatus: string;
    publishedDate: string;
    deactivatedDate: string;
    statusHistory: StatusHistory[];
    fileName: string;
    chunks: string[];
    author: string;
}

export interface NewArticle {
    title: string;
    topicCode: string;
    topicName: string;
    publishedDate?: string;
    deactivatedDate?: string; 
    file: File;
}

export interface Status {
    id: string;
    name: string;
}

export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
}

export interface ArticlesResp {
    articles: Article[];
    pagination: Pagination;
}