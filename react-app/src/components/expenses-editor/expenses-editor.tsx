import React, { useEffect } from 'react';
import { RootState } from '../../redux/store';
import {
  fetchExpenses,
  deleteExpense,
  addExpense,
  editExpense,
  ExpenseStateDto,
} from '../../redux/features/expenses/expensesSlice';
import ExpensesTable from '../fin-analysis-report/expenses-table/expenses-table';
import ExpenseEditorForm from '../expenses-editor-form/expenses-editor-form';
import './expenses-editor.css';
import FilterComponent from '../fin-analysis-report/filter-component/filter-component';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  convertFilterStateToDto,
  expenseStateDtoToExpense,
} from '../../services/utils';

const ExpenseEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(
    (state: RootState) => state.expenses,
  );
  const [editingExpense, setEditingExpense] =
    React.useState<ExpenseStateDto | null>(null);

  const filterName = 'editor';

  const filtersState = useAppSelector((state) => state.filters);
  let filter = filtersState.filters[filterName];
  const { initialStartDate, initialEndDate } = useAppSelector(
    (state: RootState) => state.filters,
  );

  if (!filter) {
    filter = {
      startDate: initialStartDate,
      endDate: initialEndDate,
      searchTerm: '',
    };
  }

  useEffect(() => {
    dispatch(
      fetchExpenses({
        pageFilter: convertFilterStateToDto(filter),
        target: 'editor',
      }),
    );
  }, [dispatch]);

  const handleSave = (expense: ExpenseStateDto) => {
    if (editingExpense && editingExpense.id) {
      dispatch(editExpense(expenseStateDtoToExpense(expense)));
    } else {
      dispatch(addExpense(expenseStateDtoToExpense(expense)));
    }
    setEditingExpense(null);
  };

  const handleBack = () => {
    setEditingExpense(null);
  };

  const handleAddNewExpense = () => {
    setEditingExpense({ id: 0, description: '', sum: 0, date: '' });
  };

  return (
    <div className="expense-editor">
      <h2>Expense Editor</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {editingExpense ? (
        <ExpenseEditorForm
          initialData={editingExpense}
          onSubmit={handleSave}
          handleBack={handleBack}
        />
      ) : (
        <>
          <FilterComponent filterName={filterName} />
          <button className="add-expense-button" onClick={handleAddNewExpense}>
            Add New Expense
          </button>
          <ExpensesTable editEnabled={true} expensesDataType={filterName} />
        </>
      )}
    </div>
  );
};

export default ExpenseEditor;
