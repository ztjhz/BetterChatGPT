export type Role = 'user' | 'assistant' | 'system';
export const roles: Role[] = ['user', 'assistant', 'system'];

export interface MessageInterface {
  role: Role;
  content: string;
}

export interface ChatInterface {
  title: string;
  messages: MessageInterface[];
  config: ConfigInterface;
}

export interface ConfigInterface {
  temperature: number;
  presence_penalty: number;
}
