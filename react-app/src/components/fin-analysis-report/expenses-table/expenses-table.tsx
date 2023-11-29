import React, { useState } from 'react';
import { RootState } from '../../../redux/store';
import './expenses-table.css';
import {
  editExpense,
  deleteExpense,
  ExpenseStateDto,
} from '../../../redux/features/expenses/expensesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import ExpenseEditorForm from '../../expenses-editor-form/expenses-editor-form';
import { expenseStateDtoToExpense } from '../../../services/utils';

interface ExpensesTableProps {
  editEnabled: boolean;
  expensesDataType: 'editor' | 'main';
}
const ExpensesTable: React.FC<ExpensesTableProps> = ({
  editEnabled,
  expensesDataType,
}) => {
  const dispatch = useAppDispatch();

  const expenses = useAppSelector((state: RootState) =>
    expensesDataType == 'main'
      ? state.expenses.expenses
      : state.expenses.editorExpenses,
  ); 
  const [editingExpense, setEditingExpense] = useState<ExpenseStateDto | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 items per page.

  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousClick = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextClick = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  const displayedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleEdit = (expense: ExpenseStateDto | null) => {
    setEditingExpense(expense);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure to delete this expense?")){
      dispatch(deleteExpense(id));
    }
  };

  const handleSave = (editedExpense: ExpenseStateDto) => {
    dispatch(editExpense(expenseStateDtoToExpense(editedExpense)));
    setEditingExpense(null);
  };

  const handleBack = () => {
    setEditingExpense(null);
  };

  function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Estimage columns length.
  const gridTemplateColumns = calculateColumnStyle();

  const renderNoData = (
    <>
      <div className="no-data"> No data. </div>
    </>
  );

  if (displayedExpenses.length == 0) {
    return renderNoData;
  } else
    return (
      <>
        {editingExpense ? (
          <ExpenseEditorForm
            initialData={editingExpense}
            onSubmit={handleSave}
            handleBack={handleBack}
          />
        ) : (
          <>
            <div className="expenses-grid" style={{ gridTemplateColumns }}>
              <div className="grid-header">Date</div>
              <div className="grid-header">Description</div>
              <div className="grid-header">Sum</div>
              {editEnabled && <div className="grid-header">Actions</div>}

              {displayedExpenses.map((expense, index) => (
                <React.Fragment key={index}>
                  <div
                    className={
                      index % 2 === 0
                        ? 'grid-item even-row'
                        : 'grid-item odd-row'
                    }
                  >
                    {formatDate(new Date(expense.date))}
                  </div>
                  <div
                    className={
                      index % 2 === 0
                        ? 'grid-item even-row'
                        : 'grid-item odd-row'
                    }
                  >
                    {expense.description}
                  </div>
                  <div
                    className={
                      index % 2 === 0
                        ? 'grid-item even-row'
                        : 'grid-item odd-row'
                    }
                  >
                    {expense.sum}
                  </div>

                  {editEnabled && (
                    <div className="action-cell">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

              <div className="pagination-area">
                <button
                  onClick={handlePreviousClick}
                  disabled={currentPage === 1}
                >
                  Back
                </button>
                Page {currentPage} of {totalPages}
                <button
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages}
                >
                  Forward
                </button>
              </div>
          </>
        )}
      </>
    );

  function calculateColumnStyle() {
    const dateColumnWidth = '120px'; 
    const sumColumnWidth = '100px'; 
    const descriptionColumnWidth = '1fr'; 
    const actionColumnWidth = editEnabled ? 'auto' : '';

    // Generate style for grid-template-columns
    const gridTemplateColumns = `${dateColumnWidth} ${descriptionColumnWidth} ${sumColumnWidth} ${actionColumnWidth}`;
    return gridTemplateColumns;
  }
};

export default ExpensesTable;
