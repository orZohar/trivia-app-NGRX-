import { ActionReducerMap, createFeatureSelector , createSelector} from '@ngrx/store';

import * as fromGame from './game.reducers';

export interface GameState { 
    game: fromGame.GameState;
}

export const reducers : ActionReducerMap<GameState> = {
    game: fromGame.gameReducer
}

// selectors

// reference to the module state
export const getGamesState = createFeatureSelector<GameState>('game');

// game state
export const getCurrentState = createSelector(
    getGamesState,
    // since we have a single reducer this is state if we had multiple it had to create the selector like this (state: any) => state.gameplay) to point it's gameplay reducer inside game feature state
    (state: any) => state)

export const getAllQuestions = createSelector(getCurrentState, fromGame.getQuestions);  
export const getLives = createSelector(getCurrentState, fromGame.getLives);  
export const getCorrectAnswers = createSelector(getCurrentState, fromGame.getCorrectAnswers);  
export const getCurrentQuestion = createSelector(getCurrentState, fromGame.getCurrentQuestion);  