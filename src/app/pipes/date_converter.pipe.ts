import { Pipe, PipeTransform } from '@angular/core';
import {date_converter} from '../utils/date_converter';

@Pipe({
    name: 'date_converter'
})
export class DateConverterPipe implements PipeTransform {
    transform(date: string): string {
        return date_converter(date);
    }
}
