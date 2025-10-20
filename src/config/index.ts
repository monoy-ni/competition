export const config = {
  appName: '政务新媒体AI内容工厂',
  version: '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-for-demo',
  },
  ai: {
    openaiKey: import.meta.env.VITE_OPENAI_KEY || '',
    baiduAIKey: import.meta.env.VITE_BAIDU_AI_KEY || '',
  },
};