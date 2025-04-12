// types/index.ts
export interface Message {
  id: number;
  content: string;
  sender: "user" | "ai" | "system";
  timestamp: string;
  type?: "info" | "error";
}

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
}

export interface ChatMessage {
  stream: boolean;
  session_id: string;
  message: string;
}
