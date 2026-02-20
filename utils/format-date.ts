export function formatTime(date: Date | string | number) {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const strHours = hours < 10 ? `0${hours}` : hours;
    const strMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${strHours}:${strMinutes} ${ampm}`;
}
