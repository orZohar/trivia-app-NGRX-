import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, timer } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { GameQuestion } from 'src/app/shared/models/game-question.model';
import { setCorrectAnswers, setCurrentQuestion, setLives } from '../../actions/game.actions';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
import { TrackByService } from '../../../core/services/trackby.service';
import { fadeInOut } from 'src/app/shared/animations';

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
  nextQuestionTimer = timer(3000);
  destroy$ = new Subject();
  startQuestionCheckingProcess: boolean = false; // boolean for disable/enable timer 
  questions$: Observable<GameQuestion[]>;

  constructor(private store$: Store<any>, public dialogService: DialogService, public trackbyService: TrackByService) { }

  ngOnInit(): void {
    this.store$.pipe(select('game', 'currentQuestion'), take(1)).subscribe(result => {
      this.currentQuestion = result;
    })

    this.store$.pipe(select('game', 'lives'), take(1)).subscribe(result => {
      this.livesLeft = result;
    })

    this.questions$ = this.store$.pipe(
      select('game', 'questions'),
      tap(questionsArray => {
        // assign all the answers to matrix of answers and shuffle every array
        this.answersMatrix = [];
        this.assignAnswersToMatrix(questionsArray);
      })
    )
  }

  updateAnswer(isCorrect, timeIsUp, skipQuestion) {
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
    if (this.answersMatrix.length-1 === this.currentQuestion || this.livesLeft === 0) {
      this.finishTheGame();
    }
  }

  assignAnswersToMatrix(questionsArray) {
    var tempArray = [];
    for (let question of Object.values(questionsArray)) {
      tempArray = tempArray.concat(question['incorrect_answers']);
      tempArray.push(question['correct_answer']);
      tempArray = this.shuffleAnswers(tempArray);
      this.answersMatrix.push(tempArray);
      tempArray = [];
    }
  }


  handleSkippedQuestion() {
    this.livesLeft--;
    // when user has no lives
    if (this.livesLeft !== 0) {
      this.currentQuestion++;
    }
    this.currQuestionIndex++;
    this.store$.dispatch(setLives({ lives: this.livesLeft }));
    this.store$.dispatch(setCorrectAnswers({ correctAnswers: this.correctAnswers }));
    this.store$.dispatch(setCurrentQuestion({ currentQuestion: this.currentQuestion }));
  }

  runQuestionTimer() {
    this.nextQuestionTimer.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.prepareNextQuestionMsg = ""
      this.currQuestionIndex++;
      this.startQuestionCheckingProcess = false;
      if (this.gameIsRunning) {
        this.currentQuestion++;
        this.store$.dispatch(setCurrentQuestion({ currentQuestion: this.currentQuestion }));
      }
    })
  }

  handleAnswer(isCorrect, timeIsUp) {
    if (isCorrect) {
      this.correctAnswers++;
      this.prepareNextQuestionMsg = "GOOD JOB!!! Prepare for the next question...";
      this.store$.dispatch(setCorrectAnswers({ correctAnswers: this.correctAnswers }));
    } else {
      this.livesLeft--;
      this.store$.dispatch(setLives({ lives: this.livesLeft }));
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