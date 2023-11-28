import {
  calculateAverageExpenseForActualDays,
  cumulativeAverageExpense,
  cumulativeAverageExpenseForMonth,
  expenseToStateDto,
  formatDate,
  getDatesRange,
} from './utils';

// Mock the current date to a fixed value
jest
  .spyOn(global.Date, 'now')
  .mockImplementation(() => new Date('2023-01-01T00:00:00Z').valueOf());

describe('Date utils', () => {
  it('should correctly format date', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });

  it('should correctly get dates range', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-03');
    const range = getDatesRange(start, end);
    expect(range.length).toBe(3);
    expect(range[0].getDate()).toBe(1);
    expect(range[2].getDate()).toBe(3);
  });
});

describe('Expense utils', () => {
  it('should correctly calculate cumulative average expenses', () => {
    const expenses = [
      { sum: 100, date: new Date('2023-01-01'), description: '', id: 1 },
      { sum: 200, date: new Date('2023-01-02'), description: '', id: 2 },
    ];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-02');
    const result = cumulativeAverageExpense(
      expenses.map(expenseToStateDto),
      startDate,
      endDate,
    );
    expect(result.length).toBe(2);
    expect(result[0].expense).toBe(100);
    expect(result[1].expense).toBe(150);
  });

  it('should correctly calculate average expenses for actual days', () => {
    const expenses = [
      { sum: 100, date: new Date('2023-01-01'), description: '', id: 1 },
      { sum: 200, date: new Date('2023-01-02'), description: '', id: 2 },
    ];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-02');
    const average = calculateAverageExpenseForActualDays(
      expenses,
      startDate,
      endDate,
    );
    expect(average).toBe(150);
  });

  it('should correctly calculate cumulative average expenses for the month', () => {
    const expenses = [
      { sum: 100, date: new Date('2023-01-01'), description: '', id: 1 },
      { sum: 200, date: new Date('2023-01-02'), description: '', id: 2 },
    ];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');
    const result = cumulativeAverageExpenseForMonth(
      expenses,
      startDate,
      endDate,
    );
    expect(result.total).toBe(300);
    expect(result.expense).toBeCloseTo(9.6774, 4); // 300/31
    expect(result.totalDays).toBe(31);
  });
});
