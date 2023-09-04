import { rockPaperScissors } from '../rule';

describe("rule check", () => {
    test('good - a is rock, b is paper, result is W', () => {
        //Arrange
        let a = 1;
        let b = 2;
        let output = 'L';
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toEqual(output);
    });
    test('good - a is scissors, b is paper, result is W', () => {
        //Arrange
        let a = 3;
        let b = 2;
        let output = 'W';
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toEqual(output);
    });
    test('good - a is rock, b is rock, result is W', () => {
        //Arrange
        let a = 1;
        let b = 1;
        let output = 'T';
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toEqual(output);
    });
    test('bad - a is not undefined', () => {
        //Arrange
        let a = 5;
        let b = 1;
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toBeFalsy();
    });
    test('bad - b is not undefined', () => {
        //Arrange
        let a = 1;
        let b = 5;
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toBeFalsy();
    });
    test('bad - a and b is not undefined', () => {
        //Arrange
        let a = 'a';
        let b = 5;
        //Act
        let result = rockPaperScissors(a, b);
        //Assert
        expect(result).toBeFalsy();
    });
});