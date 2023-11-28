import { configureStore } from '@reduxjs/toolkit';
import filterSlice from '../redux/features/filter/filterSlice';
import expensesSlice from '../redux/features/expenses/expensesSlice';

export const createTestStore = () => {
  return configureStore({
    reducer: {
      filters: filterSlice,
      expenses: expensesSlice,
    },
  });
};
