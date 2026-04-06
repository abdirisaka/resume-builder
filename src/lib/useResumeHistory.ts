'use client';

import { useReducer, useCallback } from 'react';
import { ResumeData } from '@/types/resume';

interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

type HistoryAction =
  | { type: 'SET'; payload: ResumeData }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: ResumeData };

const MAX_HISTORY = 50;

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'SET': {
      // Don't record if nothing changed
      if (JSON.stringify(state.present) === JSON.stringify(action.payload)) return state;
      return {
        past: [...state.past.slice(-MAX_HISTORY), state.present],
        present: action.payload,
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case 'RESET': {
      return { past: [], present: action.payload, future: [] };
    }
    default:
      return state;
  }
}

export function useResumeHistory(initialData: ResumeData) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialData,
    future: [],
  });

  const set = useCallback((data: ResumeData) => {
    dispatch({ type: 'SET', payload: data });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const reset = useCallback((data: ResumeData) => dispatch({ type: 'RESET', payload: data }), []);

  return {
    resume: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
