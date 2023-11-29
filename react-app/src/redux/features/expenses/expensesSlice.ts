import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ExpensesService, { Expense } from '../../../services/expensesService';
import { expenseToStateDto } from '../../../services/utils';

export interface ExpenseStateDto {
  sum: number;
  description: string;
  date: string;
  id: number;
}

interface ExpensesState {
  expenses: ExpenseStateDto[];
  editorExpenses: ExpenseStateDto[];
  loading: boolean;
  error: string | null;
  editorError: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  editorExpenses: [],
  loading: false,
  error: null,
  editorError: null,
};

// async thunk actions.
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params: {
    pageFilter: { startDate: Date; endDate: Date; searchTerm: string };
    target: 'main' | 'editor';
  }) => {
    const { pageFilter, target } = params;
    const response = await ExpensesService.getExpenses(
      pageFilter.startDate,
      pageFilter.endDate,
      pageFilter.searchTerm,
    );
    return { data: response.map(expenseToStateDto), target };
  },
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (expenseId: number, { rejectWithValue }) => {
    try {
      await ExpensesService.deleteExpense(expenseId);
      return expenseId; // return ID of deleted expense.
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense: Expense, { rejectWithValue }) => {
    try {
      const newExpense = await ExpensesService.addExpense(expense);
      return newExpense; // return added expense.
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const editExpense = createAsyncThunk(
  'expenses/editExpense',
  async (expense: Expense, { rejectWithValue }) => {
    try {
      const updatedExpense = await ExpensesService.editExpense(expense);
      return expenseToStateDto(updatedExpense.data); // return updated expense.
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Redux slice
export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.editorError = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        const { data, target } = action.payload;
        if (target === 'main') {
          state.expenses = data;
        } else if (target === 'editor') {
          state.editorExpenses = data;
        }
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch expenses';
        state.editorError =
          action.error.message || 'Failed to fetch editor expenses';
        state.loading = false;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const id = action.payload;
        state.expenses = state.expenses.filter((expense) => expense.id !== id);
        state.editorExpenses = state.editorExpenses.filter(
          (expense) => expense.id !== id,
        );
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        const newExpense = action.payload;
        state.expenses.push(expenseToStateDto(newExpense.data));
        state.expenses = state.expenses.sort((x)=>new Date(x.date).getUTCDate());
        state.editorExpenses.push(expenseToStateDto(newExpense.data));
        state.editorExpenses = state.editorExpenses.sort((x)=>new Date(x.date).getUTCDate());
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        const updatedExpense = action.payload;
        const update = (expenses: ExpenseStateDto[]) => {
          const index = expenses.findIndex(
            (expense) => expense.id === updatedExpense.id,
          );
          if (index !== -1) {
            expenses[index] = updatedExpense;
          }
        };
        update(state.editorExpenses);
      });
  },
});

export default expensesSlice.reducer;
