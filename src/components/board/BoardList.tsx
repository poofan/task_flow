import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchUserBoards, deleteBoard, setCurrentBoard } from '../../store/boardSlice';
import CreateBoardDialog from './CreateBoardDialog';
import { RootState, Board } from '../../types';

const BoardList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { boards, currentBoard, loading } = useAppSelector((state: RootState) => state.boards);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBoards(user.id));
    }
  }, [dispatch, user]);

  const handleBoardSelect = (boardId: string) => {
    dispatch(setCurrentBoard(boardId));
  };

  const handleDeleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      await dispatch(deleteBoard(boardId));
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Boards</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setCreateDialogOpen(true)}
          disabled={loading}
        >
          New Board
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {boards.map((board: Board) => (
            <ListItem
              key={board.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => handleDeleteBoard(board.id, e)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={currentBoard?.id === board.id}
                onClick={() => handleBoardSelect(board.id)}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary={board.title}
                  secondary={board.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <CreateBoardDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
};

export default BoardList; 