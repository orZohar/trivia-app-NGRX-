import { Action, createReducer, on } from '@ngrx/store';
import { GameQuestion } from 'src/app/shared/models/game-question.model';
import * as fromActions from '../actions/game.actions';

export interface GameState {
  questions: GameQuestion[];
  lives: number;
  correctAnswers: number;
  currentQuestion: number;
}

export const initialState: GameState = {
  questions: [],
  lives: 3, // init lives for every user starting the game
  correctAnswers: 0,
  currentQuestion: 1
};
export function gameReducer(state = initialState, action) {
  switch (action.type) {

    case fromActions.LOAD_QUESTIONS_SUCCESS: {
      return {
        ...state,
        questions: [...action.payload],
      }
    }
    case fromActions.SET_LIVES: {
      return {
        ...state,
        lives: action.payload
      }
    }
    case fromActions.SET_CORRECT_ANSWERS: {
      return {
        ...state,
        correctAnswers: action.payload
      }
    }
    case fromActions.SET_CURRENT_QUESTION: {
      return {
        ...state,
        currentQuestion: action.payload
      }
    }
    case fromActions.SET_INIT_DATA: {
      return {
        ...state,
        questions: initialState.questions,
        lives: initialState.lives,
        correctAnswers: initialState.correctAnswers,
        currentQuestion: initialState.currentQuestion,
      }
    }
  }

  return state;
}
// on(LOAD_QUESTIONS, (state: State, action: any) => {
//   return {
//     ...state,
//     questions: action
//   }
// }),
// on(setLives, (state: State, action: any) => {
//   return {
//     ...state,
//     lives: action.lives
//   }
// }),
// on(setCorrectAnswers, (state: State, action: any) => {
//   return {
//     ...state,
//     correctAnswers: action.correctAnswers
//   }
// }),
// on(setCurrentQuestion, (state: State, action: any) => {
//   return {
//     ...state,
//     currentQuestion: action.currentQuestion
//   }
// }),
// on(setInitData, (state: State, action: any) => {
//   return {
//     ...state,
//     questions:initialState.questions,
//     lives: initialState.lives,
//     correctAnswers: initialState.correctAnswers,
//     currentQuestion: initialState.currentQuestion,
//   }
// }),
// );

// export function reducer(state: State | undefined, action: Action) {
//   return gameReducer(state, action);
// }

export const getQuestions = (state: GameState) => state.questions;
export const getLives = (state: GameState) => state.lives;
export const getCorrectAnswers = (state: GameState) => state.correctAnswers;
export const getCurrentQuestion = (state: GameState) => state.currentQuestion;