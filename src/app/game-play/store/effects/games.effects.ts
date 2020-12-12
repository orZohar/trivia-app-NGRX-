import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadQuestions, LOAD_QUESTIONS} from '../actions/game.actions';
import * as fromActions from '../actions/game.actions';

// import {
//   AllCoursesLoaded,
// } from './course.actions';
import { GamePlayService } from '../../services/game-play.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
import { Action } from '@ngrx/store';
//import { setQuestions } from '../actions/game.actions';
import { OnInitEffects } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GameEffects implements OnInitEffects {
  constructor(private actions$: Actions, private gamePlayService: GamePlayService, private httpClient: HttpClient) { }

  ngrxOnInitEffects(): Action {
    return { type: '[GameEffects] INIT' }
  }

  @Effect()
  initQuestions$: Observable<Action> = this.actions$.pipe(
    ofType('[GameEffects] INIT'),
    mergeMap((action) => this.gamePlayService.getQuestions()),
    map((data) => new fromActions.LoadQuestionsSuccess(data as any))
    // catchError(error => of(error)))
  )

}