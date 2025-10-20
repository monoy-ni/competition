import { create } from 'zustand';

export interface HotTopic {
  id: string;
  title: string;
  category: string;
  heat: number;
  trend: 'up' | 'down' | 'stable';
  mentions: number;
}

export interface ContentStats {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  byType: {
    text: number;
    image: number;
    video: number;
  };
}

export interface UserBehavior {
  date: string;
  views: number;
  shares: number;
  likes: number;
  comments: number;
}

interface AnalysisState {
  hotTopics: HotTopic[];
  contentStats: ContentStats | null;
  userBehaviors: UserBehavior[];
  loading: boolean;
  fetchHotTopics: () => Promise<void>;
  fetchContentStats: () => Promise<void>;
  fetchUserBehaviors: () => Promise<void>;
}

// Mock data for demo
const mockHotTopics: HotTopic[] = [
  {
    id: '1',
    title: '营商环境优化',
    category: '政策解读',
    heat: 95,
    trend: 'up',
    mentions: 1250,
  },
  {
    id: '2',
    title: '便民服务措施',
    category: '民生服务',
    heat: 88,
    trend: 'stable',
    mentions: 980,
  },
  {
    id: '3',
    title: '城市建设成果',
    category: '城市发展',
    heat: 82,
    trend: 'up',
    mentions: 756,
  },
  {
    id: '4',
    title: '环保政策宣传',
    category: '环境保护',
    heat: 76,
    trend: 'down',
    mentions: 642,
  },
  {
    id: '5',
    title: '教育改革创新',
    category: '教育事业',
    heat: 71,
    trend: 'up',
    mentions: 534,
  },
];

const mockContentStats: ContentStats = {
  total: 156,
  published: 89,
  pending: 34,
  rejected: 33,
  byType: {
    text: 89,
    image: 45,
    video: 22,
  },
};

const mockUserBehaviors: UserBehavior[] = [
  { date: '2024-01-01', views: 1200, shares: 89, likes: 234, comments: 45 },
  { date: '2024-01-02', views: 1350, shares: 95, likes: 267, comments: 52 },
  { date: '2024-01-03', views: 1180, shares: 78, likes: 198, comments: 38 },
  { date: '2024-01-04', views: 1420, shares: 112, likes: 289, comments: 67 },
  { date: '2024-01-05', views: 1680, shares: 134, likes: 345, comments: 78 },
  { date: '2024-01-06', views: 1590, shares: 128, likes: 312, comments: 71 },
  { date: '2024-01-07', views: 1720, shares: 145, likes: 378, comments: 89 },
];

export const useAnalysisStore = create<AnalysisState>((set) => ({
  hotTopics: [],
  contentStats: null,
  userBehaviors: [],
  loading: false,

  fetchHotTopics: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ hotTopics: mockHotTopics, loading: false });
    } catch (error) {
      console.error('Fetch hot topics error:', error);
      set({ loading: false });
    }
  },

  fetchContentStats: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ contentStats: mockContentStats, loading: false });
    } catch (error) {
      console.error('Fetch content stats error:', error);
      set({ loading: false });
    }
  },

  fetchUserBehaviors: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ userBehaviors: mockUserBehaviors, loading: false });
    } catch (error) {
      console.error('Fetch user behaviors error:', error);
      set({ loading: false });
    }
  },
}));