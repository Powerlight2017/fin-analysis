import React, { useEffect, useMemo, useState } from 'react';
import ExpensesTable from './expenses-table/expenses-table';
import Chart from './chart';
import ExpenseBarChart from './expense-bar-chart/expense-bar-chart';
import ExpensesService, { Expense } from '../../services/expensesService';
import FilterComponent from './filter-component/filter-component';
import { getEndDate, getStartDate } from '../../services/utils';

const FinAnalysisReport: React.FC = () => {
  const [expensesData, setExpensesData] = useState<Expense[]>([]);
  const [FilterString, setFilterString] = useState<string | undefined>();

  const initialStartDate = useMemo(() => getStartDate(), []);
  const initialEndDate = useMemo(() => getEndDate(), []);

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

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
  }, [startDate, endDate, FilterString]);

  const data = expensesData.length > 0 ? expensesData : [];

  function onFilterChange(filters: {
    startDate: Date;
    endDate: Date;
    searchTerm: string;
  }): void {
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    setFilterString(filters.searchTerm);
  }

  return (
    <div className="app-container">
      <FilterComponent
        startDate={startDate}
        endDate={endDate}
        onFilterChange={onFilterChange}
      />
      <hr></hr>
      {expensesData && data.length > 0 ? (
        <>
          <Chart data={data} />
          <ExpenseBarChart data={data} />
          <ExpensesTable expenses={expensesData} editEnabled={false} />
        </>
      ) : (
        <>No data.</>
      )}
    </div>
  );
};

export default FinAnalysisReport;
