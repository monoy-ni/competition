import { config } from '@/config';

// Mock Supabase client for demo purposes
const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock login - accept any credentials for demo
      return { data: { user: { id: '1', email } }, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: { id: '1', email: 'admin@gov.cn' } }, error: null };
    }
  },
  from: (table: string) => ({
    select: () => ({
      range: () => ({
        order: async () => {
          return { data: [], error: null };
        }
      })
    }),
    insert: async (data: any) => {
      return { data: null, error: null };
    },
    update: (data: any) => ({
      eq: async () => {
        return { data: null, error: null };
      }
    }),
    delete: () => ({
      eq: async () => {
        return { data: null, error: null };
      }
    })
  })
};

// Use mock client for demo
export const supabase = mockSupabase as any;

// 用户认证相关
export const auth = {
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getCurrentUser: () => supabase.auth.getUser(),
};

// 内容管理相关
export const content = {
  getList: (page: number, pageSize: number) =>
    supabase
      .from('contents')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false }),
  
  create: (data: any) =>
    supabase.from('contents').insert(data),
  
  update: (id: string, data: any) =>
    supabase.from('contents').update(data).eq('id', id),
  
  delete: (id: string) =>
    supabase.from('contents').delete().eq('id', id),
};

// 模拟数据服务（用于demo演示）
export const mockService = {
  // 获取内容列表
  getContentList: async () => {
    return {
      data: [
        {
          id: '1',
          title: '政策解读：关于优化营商环境的若干措施',
          content: '为进一步优化营商环境，提升政务服务效能...',
          type: 'text',
          status: 'approved',
          created_at: '2024-01-15T10:30:00Z',
          user_id: 'user1'
        },
        {
          id: '2',
          title: '民生科普：冬季安全用电指南',
          content: '冬季是用电高峰期，为了保障居民用电安全...',
          type: 'text',
          status: 'pending',
          created_at: '2024-01-14T14:20:00Z',
          user_id: 'user2'
        }
      ],
      error: null
    };
  },

  // 获取统计数据
  getStats: async () => {
    return {
      data: {
        totalContents: 156,
        pendingReviews: 12,
        publishedContents: 89,
        thisMonthContents: 23
      },
      error: null
    };
  }
};