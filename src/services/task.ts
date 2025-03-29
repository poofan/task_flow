import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types';

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    ...task,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const getBoardTasks = async (boardId: string): Promise<Task[]> => {
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('boardId', '==', boardId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(tasksQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deadline: doc.data().deadline?.toDate(),
  })) as Task[];
};

export const moveTask = async (taskId: string, columnId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    columnId,
    updatedAt: Timestamp.now(),
  });
}; 