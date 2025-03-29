import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types';
import * as taskService from '../services/task';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await taskService.createTask(task);
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    await taskService.updateTask(taskId, updates);
    return { taskId, updates };
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    await taskService.deleteTask(taskId);
    return taskId;
  }
);

export const fetchBoardTasks = createAsyncThunk(
  'tasks/fetchBoardTasks',
  async (boardId: string) => {
    return await taskService.getBoardTasks(boardId);
  }
);

export const moveTask = createAsyncThunk(
  'tasks/moveTask',
  async ({ taskId, columnId }: { taskId: string; columnId: string }) => {
    await taskService.moveTask(taskId, columnId);
    return { taskId, columnId };
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, updates } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      })
      // Fetch Board Tasks
      .addCase(fetchBoardTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchBoardTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Move Task
      .addCase(moveTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, columnId } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].columnId = columnId;
        }
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to move task';
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer; 