import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import expensesReducer from './features/expenses/expensesSlice';
import filterReducer from './features/filter/filterSlice';

const rootReducer = combineReducers({
  user: userReducer,
  expenses: expensesReducer,
  filters: filterReducer,
});

export default rootReducer;
