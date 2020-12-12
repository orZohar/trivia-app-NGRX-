import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePlayRoutingModule } from './game-play-routing.module';
import { GameDashboardComponent } from './components/game-dashboard/game-dashboard.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {GameEffects} from './store';
//import { reducers } from './';
import { effects } from './store';
import { SharedModule } from '../shared/shared.module';
import { GameOverDialogComponent } from './components/game-over-dialog/game-over-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuestionTimerComponent} from './components/question-timer/question-timer.component';
import { gameReducer } from './store/reducers/game.reducers';

@NgModule({
  declarations: [GameDashboardComponent, GameOverDialogComponent, QuestionTimerComponent],
  imports: [
    CommonModule,
    GamePlayRoutingModule,
    SharedModule,
    EffectsModule.forFeature(effects),
    //StoreModule.forFeature('game', reducers ) // multiple reducers handling
    StoreModule.forFeature('game', gameReducer)

  ],
  providers :[DialogService]
})
export class GamePlayModule { }
