export function date_converter(date: string){
    let months = {
        '01': 'января',
        '02': 'февраля',
        '03': 'марта',
        '04': 'апреля',
        '05': 'мая',
        '06': 'июня',
        '07': 'июля',
        '08': 'августа',
        '09': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря',
    };
    let splitted = date.split("-", 3);
    let date_string: string = '';
    date_string += splitted[2];
    date_string += ' ';
    date_string += months[splitted[1]];
    return date_string;
}
