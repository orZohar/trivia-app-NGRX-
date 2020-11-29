import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        transition(':enter', [
          style({ transform: 'translateY(-100%)' }),
          animate('1200ms ease-in', style({ transform: 'translateY(0%)' }))
        ]),
      ])
]

export const fadeInOut = [
    trigger('fadeInOut', [
        transition(':enter', [ 
            style({ opacity: 0 }),
            animate(1500, style({ opacity: 1 }))
        ]),
    ])
]