export const diffInDays = (date1: Date, date2: Date) => {
    // date1 can be higher than date2
    // date2 can be higher than date1

    // To calculate the time difference of two dates
    let differenceInMilliseconds = 0;
    if (date1 >= date2) {
        differenceInMilliseconds = date1.getTime() - date2.getTime();
    } else {
        differenceInMilliseconds = date2.getTime() - date1.getTime();
    }

    // To calculate the no. of days between two dates
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return Math.floor(differenceInDays);
};

// console.log(diffInDays(new Date(), new Date("2021-06-09")));
// console.log(diffInDays(new Date("2021-06-09"), new Date()));

export const prettierNumber = (n: number) => {
    const nString = String(n);

    let finalString = "";

    if (nString.length <= 3) {
        finalString = nString;
    } else if (nString.length === 4) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "k";
    } else if ([5, 6].includes(nString.length)) {
        finalString = nString.slice(0, -3) + "k";
    } else if (nString.length === 7) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "m";
    } else if ([8, 9].includes(nString.length)) {
        finalString = nString.slice(0, -6) + "m";
    } else if (nString.length === 10) {
        finalString = nString.slice(0, 1) + "." + nString.slice(1, 2) + "b";
    } else {
        finalString = nString.slice(0, -9) + "b";
    }

    return finalString;
};

// console.log("1 --- ", prettierNumber(1));
// console.log("12 --- ", prettierNumber(12));
// console.log("123 --- ", prettierNumber(123));
// console.log("1234 --- ", prettierNumber(1234));
// console.log("12345 --- ", prettierNumber(12345));
// console.log("123456 --- ", prettierNumber(123456));
// console.log("1234567 --- ", prettierNumber(1234567));
// console.log("12345678 --- ", prettierNumber(12345678));
// console.log("123456789 --- ", prettierNumber(123456789));
// console.log("1234567890 --- ", prettierNumber(1234567890));
// console.log("12345678901 --- ", prettierNumber(12345678901));
// console.log("123456789012 --- ", prettierNumber(123456789012));
// console.log("1234567890123 --- ", prettierNumber(1234567890123));
