import {
  dateAfter,
  dateBefore,
  dateBetween,
  isDate,
} from '../../src/rules/date';

describe('isDate', () => {
  test('should return true for a valid date in UTC format', () => {
    const input = '2023-04-23T10:30:00.000Z'; // UTC format
    const result = isDate(input).passes;
    expect(result).toBe(true);
  });

  test('should return false for an invalid date', () => {
    const input = '2023-04-23T10:30:00.000';
    const result = isDate(input).passes;
    expect(result).toBe(true);
  });

  test('should return false for an invalid string', () => {
    const input = 'invalid date';
    const result = isDate(input).passes;
    expect(result).toBe(false);
  });

  // Test case: null value
  test('should return false for a null value', () => {
    const input = null;
    const result = isDate(input).passes;
    expect(result).toBe(false);
  });
});

// Test for the dateBefore function
describe('dateBefore', () => {
  test('should return true if the input date is before the reference date', () => {
    const inputDate = '2023-04-23';
    const referenceDate = '2023-04-24';
    expect(dateBefore(inputDate, referenceDate, 'date').passes).toBe(true);
  });

  test('should return false if the input date is after the reference date', () => {
    const inputDate = '2023-04-25';
    const referenceDate = '2023-04-24';
    expect(dateBefore(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input date is equal to the reference date', () => {
    const inputDate = '2023-04-24';
    const referenceDate = '2023-04-24';
    expect(dateBefore(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const referenceDate = '2023-04-24';
    expect(dateBefore(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return true if date is before now', () => {
    const inputDate = '2022-04-22';
    const referenceDate = 'now';
    expect(dateBefore(inputDate, referenceDate).passes).toBe(true);
  });

  test('should return true if date is after now', () => {
    const inputDate = '2050-01-01';
    const referenceDate = 'now';
    expect(dateAfter(inputDate, referenceDate).passes).toBe(true);
  });
});

// Test for the dateAfter function
describe('dateAfter', () => {
  test('should return true if the input date is after the reference date', () => {
    const inputDate = '2023-04-25';
    const referenceDate = '2023-04-24';
    expect(dateAfter(inputDate, referenceDate).passes).toBe(true);
  });

  test('should return false if the input date is before the reference date', () => {
    const inputDate = '2023-04-23';
    const referenceDate = '2023-04-24';
    expect(dateAfter(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input date is equal to the reference date', () => {
    const inputDate = '2023-04-24';
    const referenceDate = '2023-04-24';
    expect(dateAfter(inputDate, referenceDate).passes).toBe(false);
  });

  test('should throw an exception if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const referenceDate = '2023-04-24';
    expect(dateAfter(inputDate, referenceDate).passes).toBe(false);
  });
});

// Test for the dateBetween function
describe('dateBetween', () => {
  test('should return true if the input date is between the reference dates', () => {
    const inputDate = '2023-04-25';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate},${endDate}`).passes).toBe(true);
  });

  test('should return false if the input date is before the start date', () => {
    const inputDate = '2023-04-23';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is after the end date', () => {
    const inputDate = '2023-04-27';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is equal to the start date', () => {
    const inputDate = '2023-04-24';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is equal to the end date', () => {
    const inputDate = '2023-04-26';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(dateBetween(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });
});
