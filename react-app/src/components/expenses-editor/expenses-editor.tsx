import React, { useState, useEffect, useMemo } from 'react';
import ExpensesService, { Expense } from '../../services/expensesService';
import { getEndDate, getStartDate } from '../../services/utils';
import FilterComponent from '../fin-analysis-report/filter-component/filter-component';
import ExpensesTable from '../fin-analysis-report/expenses-table/expenses-table';
import ExpenseEditorForm from '../expenses-editor-form/expenses-editor-form';
import './expenses-editor.css';
import expensesService from '../../services/expensesService';

const PAGE_SIZE = 10;

export const ExpenseEditor: React.FC = () => {
  const [expensesData, setExpensesData] = useState<Expense[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const initialStartDate = useMemo(() => getStartDate(), []);
  const initialEndDate = useMemo(() => getEndDate(), []);
  const [triggerReload, setTriggerReload] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [FilterString, setFilterString] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ExpensesService.getExpenses(
          startDate,
          endDate,
          FilterString,
        );
        setExpensesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, FilterString, triggerReload]);

  function onFilterChange(filters: {
    startDate: Date;
    endDate: Date;
    searchTerm: string;
  }): void {
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    setFilterString(filters.searchTerm);
  }

  const handleEdit = (id: number) => {
    const expenseToEdit = expensesData?.find((e) => e.id === id) || null;
    setEditingExpense(expenseToEdit);
  };

  const handleAdd = () => {
    const expenseToEdit = {} as Expense;
    setEditingExpense(expenseToEdit);
  };

  const handleDelete = (id: number) => {
    expensesService
      .deleteExpense(id)
      .catch((result) => {
        // showError
      })
      .finally(() => {
        setEditingExpense(null);
        setTriggerReload(!triggerReload);
      });
  };

  const handleSave = (editedExpense: Expense) => {
    expensesService
      .editExpense(editedExpense.id, editedExpense)
      .catch((result) => {
        // showError
      })
      .finally(() => {
        setEditingExpense(null);
        setTriggerReload(!triggerReload);
      });
  };

  const handleBack = () => {
    setEditingExpense(null);
  };

  return (
    <div>
      <h2>Expense Editor</h2>

      {editingExpense ? (
        <ExpenseEditorForm
          initialData={editingExpense}
          onSubmit={handleSave}
          handleBack={handleBack}
        />
      ) : (
        <>
          <FilterComponent
            startDate={startDate}
            endDate={endDate}
            onFilterChange={onFilterChange}
          />
          <hr></hr>
          {expensesData && expensesData.length > 0 ? (
            <>
              <ExpensesTable
                expenses={expensesData!}
                editEnabled={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            </>
          ) : (
            <>
              <div>
                {
                  <button className="btn-add" onClick={handleAdd}>
                    Add
                  </button>
                }
              </div>
              <div>No data.</div>
            </>
          )}
        </>
      )}
    </div>
  );
};
