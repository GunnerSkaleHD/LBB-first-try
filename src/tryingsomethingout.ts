const date: Date = new Date();

console.log(date.getHours());
const realDate: Date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
);
console.log(realDate);
// const dateTime: number = date.getTime();
// console.log(dateTime);
// const testDate = new Date(dateTime);
// console.log(testDate);
