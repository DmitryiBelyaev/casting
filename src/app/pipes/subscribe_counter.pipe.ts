import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'subscribe_counter',
})
export class Subscribe_counterPipe implements PipeTransform {
  transform(value: number, tittle: any): number {
    tittle = ['день', 'дня', 'дней'];
    if (value < 15) {
      if (value === 0) {
        return tittle[2];
      } else if (value <= 1 ) {
        return tittle[0];
      } else if (value > 1 && value <= 4 ) {
        return tittle[1];
      } else if (value >= 5 && value <= 9) {
        return tittle[2];
      } else if (value === 10)  {
        return tittle[2];
      } else if (value === 11)  {
        return tittle[2];
      } else if (value === 12)  {
        return tittle[2];
      } else if (value === 13)  {
        return tittle[2];
      } else if (value === 14)  {
        return tittle[2];
      } } else if (value >= 15) {
      const lastValue: any = value.toString().substr(-1);
      console.log(typeof +lastValue, 'qqq');
      if (+lastValue === 0) {
        return tittle[2];
      } else if (+lastValue === 1 ) {
        console.log(+lastValue, 'qqq');
        return tittle[0];
      } else if (+lastValue > 1 && +lastValue <= 4) {
        return tittle[1];
      } else if (+lastValue >= 5 && +lastValue <= 9) {
        return tittle[2];
      }
    }

  }
}
