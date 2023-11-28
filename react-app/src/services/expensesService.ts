import apiClient from './apiClient';

export interface Expense {
  sum: number;
  description: string;
  date: Date;
  id: number;
}

export interface ExpensesEditResponse {
  message: string;
  success: boolean;
  data: Expense;
}

export interface AverageExpenseInfo {
  date: Date;
  expense: number;
}

export interface AverageTotalsInfo {
  total: number;
  totalDays: number;
  expense: number;
}

class ExpensesService {
  // Getting expenses date
  async getExpenses(
    startDate: Date,
    endDate: Date,
    filter?: string,
  ): Promise<Expense[]> {
    try {
      const response = await apiClient.get<Expense[]>(
        `/api/Expenses/GetExpenses`,
        {
          params: {
            startDate: startDate.toISOString().split('T')[0], // Convert date to YYYY-MM-DD
            endDate: endDate.toISOString().split('T')[0], // Convert date to YYYY-MM-DD
            filter: filter,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return Promise.reject('Error fetching expenses:' + error);
    }
  }
  async editExpense(expense: Expense): Promise<ExpensesEditResponse> {
    try {
      const response = await apiClient.put<ExpensesEditResponse>(
        `/api/Expenses`,
        expense,
      );
      return response.data;
    } catch (error) {
      console.error('Error editing expenses:', error);
      return Promise.reject('Error editing expenses:' + error);
    }
  }

  async addExpense(expense: Expense): Promise<ExpensesEditResponse> {
    try {
      const response = await apiClient.post<ExpensesEditResponse>(
        `/api/Expenses`,
        expense,
      );
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      return Promise.reject('Error adding expenses:' + error);
    }
  }

  async deleteExpense(id: number): Promise<ExpensesEditResponse> {
    try {
      const response = await apiClient.delete<ExpensesEditResponse>(
        `/api/Expenses/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return Promise.reject('Error editing expenses:' + error);
    }
  }
}

export default new ExpensesService();
