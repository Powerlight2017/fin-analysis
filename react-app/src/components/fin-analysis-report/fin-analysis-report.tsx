import React, { useEffect, useMemo, useState } from 'react';
import ExpensesTable from './expenses-table/expenses-table';
import Chart from './chart';
import ExpenseBarChart from './expense-bar-chart/expense-bar-chart';
import FilterComponent from './filter-component/filter-component';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { fetchExpenses } from '../../redux/features/expenses/expensesSlice';
import { convertFilterStateToDto } from '../../services/utils';

const FinAnalysisReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const expensesData = useAppSelector(
    (state: RootState) => state.expenses.expenses,
  );

  const filterName = 'main';

  const filtersState = useAppSelector((state) => state.filters);
  let filter = filtersState.filters[filterName];
  const { initialStartDate, initialEndDate } = useAppSelector(
    (state: RootState) => state.filters,
  );

  useEffect(() => {
    try {
      if (!filter) {
        filter = {
          startDate: initialStartDate,
          endDate: initialEndDate,
          searchTerm: '',
        };
      }
      dispatch(
        fetchExpenses({
          pageFilter: convertFilterStateToDto(filter),
          target: filterName,
        }),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dispatch]);

  const data = expensesData.length > 0 ? expensesData : [];

  return (
    <div className="app-container">
      <FilterComponent filterName={filterName} />
      <hr></hr>
      {expensesData && data.length > 0 ? (
        <>
          <Chart data={data} />
          <ExpenseBarChart data={data} />
          <ExpensesTable editEnabled={false} expensesDataType={filterName} />
        </>
      ) : (
        <>No data.</>
      )}
    </div>
  );
};

export default FinAnalysisReport;
