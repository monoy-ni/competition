import { create } from 'zustand';
import { supabase } from '@/services/supabase';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  metadata?: any;
}

interface ContentState {
  contents: ContentItem[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  fetchContents: (page?: number, pageSize?: number) => Promise<void>;
  createContent: (data: Partial<ContentItem>) => Promise<void>;
  updateContent: (id: string, data: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  searchContents: (keyword: string) => Promise<void>;
}

// Mock data for demo
const mockContents: ContentItem[] = [
  {
    id: '1',
    title: '关于优化营商环境的政策解读',
    content: '为进一步优化营商环境，提升政务服务效能，我市推出一系列创新举措...',
    type: 'text',
    status: 'approved',
    userId: 'user1',
    userName: '张编辑',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    tags: ['政策解读', '营商环境'],
  },
  {
    id: '2',
    title: '政务服务便民措施宣传海报',
    content: '设计精美的政务服务便民措施宣传海报，包含二维码和联系方式...',
    type: 'image',
    status: 'pending',
    userId: 'user2',
    userName: '李设计',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    tags: ['宣传海报', '便民服务'],
  },
  {
    id: '3',
    title: '城市绿化建设成果展示',
    content: '展示我市近年来城市绿化建设的显著成果，包括公园建设、道路绿化等...',
    type: 'video',
    status: 'draft',
    userId: 'user3',
    userName: '王记者',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    tags: ['城市建设', '绿化成果'],
  },
];

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 10,

  fetchContents: async (page = 1, pageSize = 10) => {
    set({ loading: true });
    try {
      // For demo purposes, use mock data
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedContents = mockContents.slice(start, end);
      
      set({
        contents: paginatedContents,
        total: mockContents.length,
        page,
        pageSize,
        loading: false,
      });
    } catch (error) {
      console.error('Fetch contents error:', error);
      set({ loading: false });
    }
  },

  createContent: async (data: Partial<ContentItem>) => {
    set({ loading: true });
    try {
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: data.title || '新内容',
        content: data.content || '',
        type: data.type || 'text',
        status: 'draft',
        userId: 'current-user',
        userName: '当前用户',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: data.tags || [],
      };
      
      const currentContents = get().contents;
      set({
        contents: [newContent, ...currentContents],
        total: get().total + 1,
        loading: false,
      });
    } catch (error) {
      console.error('Create content error:', error);
      set({ loading: false });
    }
  },

  updateContent: async (id: string, data: Partial<ContentItem>) => {
    set({ loading: true });
    try {
      const { contents } = get();
      const updatedContents = contents.map(content =>
        content.id === id
          ? { ...content, ...data, updatedAt: new Date().toISOString() }
          : content
      );
      
      set({ contents: updatedContents, loading: false });
    } catch (error) {
      console.error('Update content error:', error);
      set({ loading: false });
    }
  },

  deleteContent: async (id: string) => {
    set({ loading: true });
    try {
      const { contents } = get();
      const filteredContents = contents.filter(content => content.id !== id);
      
      set({
        contents: filteredContents,
        total: get().total - 1,
        loading: false,
      });
    } catch (error) {
      console.error('Delete content error:', error);
      set({ loading: false });
    }
  },

  searchContents: async (keyword: string) => {
    set({ loading: true });
    try {
      const { contents } = get();
      const filteredContents = contents.filter(content =>
        content.title.toLowerCase().includes(keyword.toLowerCase()) ||
        content.content.toLowerCase().includes(keyword.toLowerCase())
      );
      
      set({
        contents: filteredContents,
        total: filteredContents.length,
        loading: false,
      });
    } catch (error) {
      console.error('Search contents error:', error);
      set({ loading: false });
    }
  },
}));