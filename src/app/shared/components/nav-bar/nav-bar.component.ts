import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GameQuestion } from '../../models/game-question.model';
import * as fromStore from '../../../game-play/store';
@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit {

  faHeart = faHeart;
  currQuestionNumber: number = 1;
  livesLeft: number;
  convertToPoints: number = 100;

  lives$: Observable<number> = this.store$.pipe(
    select(fromStore.getLives),
    tap(x => { this.livesLeft = x })
  )

  correctAnswers$: Observable<number> = this.store$.pipe(
    select(fromStore.getCorrectAnswers),
    map(answers => this.convertToPoints * answers),
  )
  questions$: Observable<GameQuestion[]> = this.store$.pipe(
    select(fromStore.getAllQuestions),
  )
  currentQuestion$: Observable<number> = this.store$.pipe(
    select(fromStore.getCurrentQuestion),
  )

  constructor(private httpClient: HttpClient, private store$: Store<any>) { }
  ngOnInit(): void {

  }
}