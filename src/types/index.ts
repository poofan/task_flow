export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Label {
  id: string;
  color: string;
  text: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  labels: Label[];
  deadline?: Date;
  comments: Comment[];
  history: {
    action: string;
    userId: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  members: {
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  boards: BoardState;
  tasks: TaskState;
} 