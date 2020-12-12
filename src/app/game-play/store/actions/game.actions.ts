import { Action, createAction, props } from '@ngrx/store';
import { GameQuestion } from '../../../shared/models/game-question.model';


export const LOAD_QUESTIONS = '[Questions] load questions'
export const LOAD_QUESTIONS_SUCCESS = '[Questions] load questions success'
export const SET_LIVES = '[Questions] set lives'
export const SET_CORRECT_ANSWERS = '[Questions] set correct answers'
export const SET_CURRENT_QUESTION = '[Questions] set current question'
export const SET_INIT_DATA = '[Questions] set init data'


export class LoadQuestions implements Action {
  readonly type = LOAD_QUESTIONS;
}

export class LoadQuestionsSuccess implements Action {
  readonly type = LOAD_QUESTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class SetLives implements Action {
  readonly type = SET_LIVES;
  constructor(public payload: number) {}
}
export class setCorrectAnswers implements Action {
  readonly type = SET_CORRECT_ANSWERS;
  constructor(public payload: number) {}
}
export class setCurrentQuestion implements Action {
  readonly type = SET_CURRENT_QUESTION;
  constructor(public payload: number) {}
}
export class setInitData implements Action {
  readonly type = SET_INIT_DATA;
  constructor() {}
}

// exporting a custom type
export type GameActions = LoadQuestions | SetLives | setCorrectAnswers | setCurrentQuestion;





// export class LoadQuestions implements Action {
//   readonly type = LOAD_QUESTIONS;
//   constructor(public payload: GameQuestion) {}
// }


// export const setQuestions = createAction(
//   '[Questions] All Questions Loaded',
//   props<{questions: any[]}>()
// );

// export const setLives = createAction(
//   '[Lives] Amout of lives left',
//   props<{lives: number}>()
// );

// export const setCorrectAnswers = createAction(
//   '[CorrectAnswers] Amout of correct answers',
//   props<{correctAnswers: number}>()
// );

// export const setCurrentQuestion = createAction(
//   '[CurrentQuestion] Question number',
//   props<{currentQuestion: number}>()
// );

// export const setInitData = createAction(
//   '[CurrentQuestion] Reset data',
// );


// // todo.actions.ts
// import { Action } from '@ngrx/store';

// export const ADD_TODO = '[Todo] Add Todo';
// export const REMOVE_TODO = '[Todo] Remove Todo';

// export class AddTodo implements Action {
//   readonly type = ADD_TODO;
//   constructor(public payload: Todo) {}
// }

// export class RemoveTodo implements Action {
//   readonly type = REMOVE_TODO;
//   constructor(public payload: Todo) {}
// }

