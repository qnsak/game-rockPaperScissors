export const  rockPaperScissors = (a, b) => {
    //1-rock, 2-paper, 3-scissors
    console.log(a, b)
    const types = [1, 2, 3];

    if (!types.includes(a) ||
        !types.includes(b)
    ){
        return false;
    }

    //tie
    if (a == b) {
        return 'T';
    }

    if ((a == 1 && b == 3) ||
        (a == 2 && b == 1) ||
        (a == 3 && b == 2)
    ){
        return 'W';
    } else {
        return 'L';
    }
}