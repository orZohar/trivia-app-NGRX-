import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TrackByService } from 'src/app/core/services/trackby.service';
import * as fromActions from '../../../game-play/store/actions/game.actions';

@Component({
  selector: 'app-leader-board-page',
  templateUrl: './leader-board-page.component.html',
  styleUrls: ['./leader-board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderBoardPageComponent implements OnInit {
  leaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));

  constructor(public trackbyService: TrackByService, private store$: Store, private router: Router) { }
  ngOnInit(): void {}
  startNewGame() {
    // init store state before starting a new game
    this.store$.dispatch(new fromActions.setInitData());
    this.store$.dispatch({ type: '[GameEffects] INIT' });
    this.router.navigate(['gameplay']);
  }
}