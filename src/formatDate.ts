export function formatDate(date: Date) {
    let year: number = date.getFullYear();
    let month: number = date.getMonth() + 1; //month is 0-indexed
    let day: number = date.getDate();
    let hour: number = date.getHours();
    let monthZero: string = "";
    let dayZero: string = "";
    let hourZero: string = "";

    if (month.toString().length === 1) {
        monthZero = "0";
    }
    if (day.toString().length === 1) {
        dayZero = "0";
    }
    if (hour.toString().length === 1) {
        hourZero = "0";
    }

    return (
        year.toString()[year.toString().length - 2] +
        year.toString()[year.toString().length - 1] +
        monthZero +
        month.toString() +
        dayZero +
        day.toString() +
        "/" +
        hourZero +
        hour.toString()
    );
}
