import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { GamePlayService } from '../../services/game-play.service';
import { SlideInOutAnimation } from 'src/app/shared/animations';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fromStore from '../../store';

@Component({
  selector: 'app-game-over-dialog',
  templateUrl: './game-over-dialog.component.html',
  styleUrls: ['./game-over-dialog.component.scss'],
  animations: [SlideInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameOverDialogComponent implements OnInit {
  playerName: NgModel;
  correctAnswers$: Observable<number>;
  correctAnswers: number;
  numberOfQuestions$: Observable<number>;
  visible: boolean = false;
  constructor(private store$: Store<any>,
    private router: Router,
    private gamePlayService: GamePlayService,
    private ref: DynamicDialogRef,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    }, 0);

    this.correctAnswers$ = this.store$.pipe(select(fromStore.getCorrectAnswers),tap(x=>this.correctAnswers = x));
    this.numberOfQuestions$ = this.store$.pipe(select(fromStore.getCurrentQuestion));
  }
  
  addToLeaderBoard() {
    if (this.playerName) {
      // update server (local storage in our case)
      this.gamePlayService.updateLeaderBoard(this.playerName, this.correctAnswers);
      this.router.navigate(['leaders']);
      this.ref.close();
    }
  }
}