import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Expense } from '../../../services/expensesService';
import { formatDate } from '../../../services/utils';

interface ExpenseBarChartProps {
  data: Expense[];
}

const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ data }) => {
  // Get unique dates.
  const uniqueDays = Array.from(
    new Set(data.map((entry) => formatDate(entry.date))),
  );

  // Calculating expenses for specific day.
  const expensesPerDay: { [key: string]: number } = {};

  data.forEach((entry) => {
    const day = formatDate(entry.date);
    expensesPerDay[day] = (expensesPerDay[day] || 0) + entry.sum;
  });

  // Prepare data for HighCharts
  const chartData = uniqueDays.map((day) => expensesPerDay[day] || 0);

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Expenses by days',
    },
    xAxis: {
      categories: uniqueDays,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Expenses',
      },
    },
    series: [
      {
        name: 'Expenses',
        data: chartData,
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ className: 'expense-bar-chart' }}
      options={options}
    />
  );
};

export default ExpenseBarChart;
