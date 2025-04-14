// sessionStore.ts - 会话信息存储服务
import { ref } from 'vue';

// 创建一个响应式的会话存储
export const activeSession = ref<{
  sessionId: string;
  type: string;
  database?: string;
  collection?: string;
} | null>(null);

// 存储会话信息
export function setActiveSession(session: any) {
  activeSession.value = session;
  // 同时保存到localStorage以便页面刷新后恢复
  localStorage.setItem('db_active_session', JSON.stringify(session));
}

// 获取会话信息
export function getActiveSession() {
  if (!activeSession.value) {
    // 尝试从localStorage恢复
    const stored = localStorage.getItem('db_active_session');
    if (stored) {
      try {
        activeSession.value = JSON.parse(stored);
      } catch (e) {
        console.error('无法解析存储的会话信息', e);
      }
    }
  }
  return activeSession.value;
}

// 清除会话信息
export function clearActiveSession() {
  activeSession.value = null;
  localStorage.removeItem('db_active_session');
} 