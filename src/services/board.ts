import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Board } from '../types';

export const createBoard = async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<Board> => {
  const docRef = await addDoc(collection(db, 'boards'), {
    ...board,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    ...board,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateBoard = async (boardId: string, updates: Partial<Board>): Promise<void> => {
  const boardRef = doc(db, 'boards', boardId);
  await updateDoc(boardRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  const boardRef = doc(db, 'boards', boardId);
  await deleteDoc(boardRef);
};

export const getUserBoards = async (userId: string): Promise<Board[]> => {
  const boardsQuery = query(
    collection(db, 'boards'),
    where('members', 'array-contains', { userId, role: 'owner' }),
    orderBy('updatedAt', 'desc')
  );

  const querySnapshot = await getDocs(boardsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Board[];
};

export const getBoardById = async (boardId: string): Promise<Board | null> => {
  const boardRef = doc(db, 'boards', boardId);
  const boardDoc = await getDoc(boardRef);
  
  if (!boardDoc.exists()) {
    return null;
  }

  const data = boardDoc.data();
  return {
    id: boardDoc.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Board;
}; 