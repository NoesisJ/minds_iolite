// types/index.ts
export interface Message {
  id: number;
  content: string;
  sender: "user" | "assistant" | "system";
  timestamp: string;
  type?: "info" | "error";
}

export interface ChatSession {
  id: string;
  title: string;
}

export interface ChatMessage {
  stream: boolean;
  session_id: string;
  message: string;
}
