import { ExpenseStateDto } from '../redux/features/expenses/expensesSlice';
import {
  PageFilter,
  PageFilterDto,
} from '../redux/features/filter/filterSlice';
import {
  AverageExpenseInfo,
  AverageTotalsInfo,
  Expense,
} from './expensesService';

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

export const expenseToStateDto = (expense: Expense): ExpenseStateDto => {
  return {
    sum: expense.sum,
    description: expense.description,
    date: expense.date.toISOString().split('T')[0],
    id: expense.id,
  };
};

export const expenseStateDtoToExpense = (expense: ExpenseStateDto): Expense => {
  return {
    sum: expense.sum,
    description: expense.description,
    date: new Date(expense.date),
    id: expense.id,
  };
};

export function getStartDate(): Date {
  const currentDate = new Date();

  const utcMilliseconds = Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    1,
  );
  return new Date(utcMilliseconds);
}

export function getEndDate(): Date {
  const currentDate = new Date();

  // Create date for first day of next month.
  const nextMonthStart = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1),
  );

  // Cutting one millisecond (cutting one day).
  // to get last day of month.
  nextMonthStart.setUTCDate(nextMonthStart.getUTCDate() - 1);

  return nextMonthStart;
}

export function getStartDateString(): string {
  return getStartDate().toISOString().split('T')[0];
}

export function getEndDateString(): string {
  return getEndDate().toISOString().split('T')[0];
}

export function getDatesRange(start: Date, end: Date): Date[] {
  const dates = [];
  let currentDate = new Date(start); // create a copy of start date

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function cumulativeAverageExpense(
  data: ExpenseStateDto[],
  startDate: Date,
  endDate: Date,
): AverageExpenseInfo[] {
  const dates = getDatesRange(startDate, endDate);

  let totalExpense = 0;
  let count = 0;

  const averagedData = dates.map((date) => {
    // Calculating expenses for specific date.
    const expensesOnDate = data
      .filter((entry) => new Date(entry.date).getTime() == date.getTime())
      .reduce((sum, entry) => sum + entry.sum, 0);

    totalExpense += expensesOnDate;
    count++;

    return {
      date,
      expense: totalExpense / count,
    };
  });

  return averagedData;
}

export function calculateAverageExpenseForActualDays(
  expenses: Expense[],
  startDate: Date,
  endDate: Date,
): number {
  const dateRange = getDatesRange(startDate, endDate);
  const daysWithData = new Set(
    expenses.map((expense) => expense.date.getTime()),
  );
  const totalSum = expenses.reduce((acc, expense) => acc + expense.sum, 0);

  const daysWithDataCount = dateRange.filter((date) =>
    daysWithData.has(date.getTime()),
  ).length;

  if (daysWithDataCount === 0) {
    return 0; // To avoid division by zero.
  }

  return totalSum / daysWithDataCount;
}

export function convertFilterStateToDto(filter: PageFilter): PageFilterDto {
  return {
    startDate: new Date(filter.startDate),
    endDate: new Date(filter.endDate),
    searchTerm: filter.searchTerm,
  };
}

export function cumulativeAverageExpenseForMonth(
  data: Expense[],
  startDate: Date,
  endDate: Date,
): AverageTotalsInfo {
  const dates = getDatesRange(startDate, endDate);

  let totalExpense = 0;
  let count = 0;

  dates.map((date) => {
    // Calculating expenses for specific date.
    const expensesOnDate = data
      .filter((entry) => entry.date.getTime() === date.getTime())
      .reduce((sum, entry) => sum + entry.sum, 0);

    totalExpense += expensesOnDate;
    count++;
  });

  return {
    total: totalExpense,
    expense: totalExpense / count,
    totalDays: count,
  } as AverageTotalsInfo;
}
