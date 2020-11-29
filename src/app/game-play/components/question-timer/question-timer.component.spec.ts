import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTimerComponent } from './question-timer.component';

describe('QuestionTimerComponent', () => {
  let component: QuestionTimerComponent;
  let fixture: ComponentFixture<QuestionTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
