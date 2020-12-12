import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, timer } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { GameQuestion } from 'src/app/shared/models/game-question.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
import { TrackByService } from '../../../core/services/trackby.service';
import { fadeInOut } from 'src/app/shared/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as fromActions from '../../store/actions/game.actions';
import * as fromStore from '../../store';

@Component({
  selector: 'app-game-dashboard',
  templateUrl: './game-dashboard.component.html',
  styleUrls: ['./game-dashboard.component.scss'],
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameDashboardComponent implements OnInit {
  currQuestionIndex: number = 0; // index for traversing the questions in the view
  correctAnswers: number = 0;
  livesLeft: number;
  answersMatrix: any = [];
  currentQuestion: number;
  ref: DynamicDialogRef;
  clickToggle: boolean = false;
  gameIsRunning: boolean = true;
  prepareNextQuestionMsg: string = "";
 // newQuestionStarted = true;
  nextQuestionTimer = timer(3000);
  destroy$ = new Subject();
  startQuestionCheckingProcess: boolean = false; // boolean for disable/enable timer 
  questions$: Observable<GameQuestion[]>;

  constructor(private store$: Store<fromStore.GameState>, public dialogService: DialogService, public trackbyService: TrackByService) { }

  ngOnInit(): void {
    this.store$.pipe(select(fromStore.getCurrentQuestion), take(1)).subscribe(result => {
      this.currentQuestion = result;
    })

    this.store$.pipe(select(fromStore.getLives), take(1)).subscribe(result => {
      this.livesLeft = result;
    })

    this.questions$ = this.store$.pipe(
      select(fromStore.getAllQuestions),
      tap(questionsArray => {
        // assign all the answers to matrix of answers and shuffle every array
        this.answersMatrix = [];
        this.assignAnswersToMatrix(questionsArray);
      })
    )
  }

  updateAnswer(isCorrect, timeIsUp, skipQuestion) {
    //this.newQuestionStarted = false;

    if (skipQuestion) {
      this.handleSkippedQuestion();
    } else {
      // disable user clicking untill passing to next question ( we don't do that on skip )
      this.startQuestionCheckingProcess = true;

      // timer of 3 seconds before passing to the next question
      this.runQuestionTimer();
      this.handleAnswer(isCorrect, timeIsUp);
    }

    // if user ended his lives or finished all the questions
    if (this.answersMatrix.length === this.currentQuestion || this.livesLeft === 0) {
      this.finishTheGame();
    }
  }

  assignAnswersToMatrix(questionsArray) {
    var tempArray = [];
    for (let question of questionsArray) {
      tempArray = tempArray.concat(question['incorrect_answers']);
      tempArray.push(question['correct_answer']);
      tempArray = this.shuffleAnswers(tempArray);
      this.answersMatrix.push(tempArray);
      tempArray = [];
    }
  }

  handleSkippedQuestion() {
    this.livesLeft--;
    // if user is out of life don't go to next question
    if (this.livesLeft !== 0) {
      this.currentQuestion++;
    }
    this.currQuestionIndex++; // it doesn't matter whether i will update the index because i ngIf all of this section

    // this.store$.dispatch(setLives({ lives: this.livesLeft }));
    this.store$.dispatch(new fromActions.SetLives(this.livesLeft));
    this.store$.dispatch(new fromActions.setCorrectAnswers(this.livesLeft));
    this.store$.dispatch(new fromActions.setCurrentQuestion(this.currentQuestion));
  }

  runQuestionTimer() {
    this.nextQuestionTimer.pipe(takeUntil(this.destroy$)).subscribe(val => {
      // take down the message 
      this.prepareNextQuestionMsg = ""
      // move to the next question
      this.currQuestionIndex++;
     // this.newQuestionStarted = true;

      this.startQuestionCheckingProcess = false;
      // if game is not running anymore don't go forward with the questions and don't update the store
      if (this.gameIsRunning) {
        this.currentQuestion++;
        this.store$.dispatch(new fromActions.setCurrentQuestion(this.currentQuestion));
      }
    })
  }

  handleAnswer(isCorrect, timeIsUp) {
    if (isCorrect) {
      this.correctAnswers++;
      this.prepareNextQuestionMsg = "GOOD JOB!!! Prepare for the next question...";
      this.store$.dispatch(new fromActions.setCorrectAnswers(this.correctAnswers));
    } else {
      this.livesLeft--;
      this.store$.dispatch(new fromActions.SetLives(this.livesLeft));

      this.prepareNextQuestionMsg = timeIsUp ? "TIMES UP :( Prepare for the next question..." : "WRONG!!! Prepare for the next question...";
    }
  }

  finishTheGame() {
    this.gameIsRunning = false;
    this.ref = this.dialogService.open(GameOverDialogComponent, {
      width: '100%',
      height: '100%',
      closable: false
    });
  }

  shuffleAnswers(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  addAnswerBorder(isCorrect) {
    if (this.startQuestionCheckingProcess && isCorrect) {
      return 'add-green-border';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    if (this.ref) {
      this.ref.close();
    }
  }
}