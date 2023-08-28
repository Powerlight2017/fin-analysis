import React, { useState } from 'react';
import './expenses-table.css';

interface Expense {
  sum: number;
  description: string;
  date: Date;
  id: number;
}

interface ExpensesTableProps {
  expenses: Expense[];
  editEnabled: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAdd?: () => void;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  editEnabled,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 10 items per page.

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

  function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  }

  return (
    <>
      {editEnabled && (
        <button className="btn-add" onClick={onAdd}>
          Add
        </button>
      )}
      <table className="expenses-table table table-bordered table-striped table-responsive table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Sum</th>
            {editEnabled && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayedExpenses.map((expense: Expense, index: number) => (
            <tr key={index}>
              <td>{formatDate(expense.date)}</td>
              <td>{expense.description}</td>
              <td>{expense.sum}</td>
              {editEnabled && (
                <td>
                  <button onClick={() => onEdit?.(expense.id)}>Edit</button>
                  <button onClick={() => onDelete?.(expense.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousClick} disabled={currentPage === 1}>
          Back
        </button>
        <span>
          Pages {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextClick} disabled={currentPage === totalPages}>
          Forward
        </button>
      </div>
    </>
  );
};

export default ExpensesTable;
