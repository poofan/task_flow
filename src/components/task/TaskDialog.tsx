import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createTask, updateTask, clearError } from '../../store/taskSlice';
import { Task, Label, RootState } from '../../types';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  columnId: string;
  task?: Task;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  boardId,
  columnId,
  task,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabel, setNewLabel] = useState({ text: '', color: '#1976d2' });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDeadline(task.deadline ? dayjs(task.deadline) : null);
      setLabels(task.labels);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(null);
      setLabels([]);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      title,
      description,
      deadline: deadline?.toDate(),
      labels,
      boardId,
      columnId,
      comments: [],
      history: [],
    };

    if (task) {
      await dispatch(updateTask({ taskId: task.id, updates: taskData }));
    } else {
      await dispatch(createTask(taskData));
    }

    onClose();
  };

  const handleAddLabel = () => {
    if (newLabel.text) {
      setLabels([...labels, { id: Date.now().toString(), ...newLabel }]);
      setNewLabel({ text: '', color: '#1976d2' });
    }
  };

  const handleDeleteLabel = (labelId: string) => {
    setLabels(labels.filter(label => label.id !== labelId));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue: dayjs.Dayjs | null) => setDeadline(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Labels
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {labels.map((label) => (
                  <Chip
                    key={label.id}
                    label={label.text}
                    sx={{ bgcolor: label.color, color: 'white' }}
                    onDelete={() => handleDeleteLabel(label.id)}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="New Label"
                  value={newLabel.text}
                  onChange={(e) => setNewLabel({ ...newLabel, text: e.target.value })}
                  fullWidth
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={newLabel.color}
                    label="Color"
                    onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  >
                    <MenuItem value="#1976d2">Blue</MenuItem>
                    <MenuItem value="#2e7d32">Green</MenuItem>
                    <MenuItem value="#ed6c02">Orange</MenuItem>
                    <MenuItem value="#d32f2f">Red</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleAddLabel}
                  disabled={!newLabel.text}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog; 