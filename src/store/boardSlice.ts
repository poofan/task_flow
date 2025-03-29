import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Board, BoardState } from '../types';
import * as boardService from '../services/board';

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await boardService.createBoard(board);
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, updates }: { boardId: string; updates: Partial<Board> }) => {
    await boardService.updateBoard(boardId, updates);
    return { boardId, updates };
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string) => {
    await boardService.deleteBoard(boardId);
    return boardId;
  }
);

export const fetchUserBoards = createAsyncThunk(
  'boards/fetchUserBoards',
  async (userId: string) => {
    return await boardService.getUserBoards(userId);
  }
);

export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (boardId: string) => {
    return await boardService.getBoardById(boardId);
  }
);

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.unshift(action.payload);
        state.currentBoard = action.payload;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create board';
      })
      // Update Board
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loading = false;
        const { boardId, updates } = action.payload;
        const boardIndex = state.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1) {
          state.boards[boardIndex] = { ...state.boards[boardIndex], ...updates };
          if (state.currentBoard?.id === boardId) {
            state.currentBoard = { ...state.currentBoard, ...updates };
          }
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update board';
      })
      // Delete Board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.filter(board => board.id !== action.payload);
        if (state.currentBoard?.id === action.payload) {
          state.currentBoard = null;
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete board';
      })
      // Fetch User Boards
      .addCase(fetchUserBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchUserBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      // Fetch Board By Id
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch board';
      });
  },
});

export const { setCurrentBoard, clearError } = boardSlice.actions;
export default boardSlice.reducer; 