import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { cumulativeAverageExpense, formatDate } from '../../services/utils';
import { ExpenseStateDto } from '../../redux/features/expenses/expensesSlice';

interface ChartProps {
  data: ExpenseStateDto[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const sortedData = data
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const startDate = sortedData[0].date;
  const endDate = sortedData[sortedData.length - 1].date;

  const dates = cumulativeAverageExpense(
    data,
    new Date(startDate),
    new Date(endDate),
  );

  const uniqueDays = Array.from(
    new Set(dates.map((entry) => formatDate(entry.date))),
  );

  const chartOptions = {
    title: {
      text: 'Average expenses graph',
    },

    yAxis: {
      title: {
        text: 'Average amount',
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: 'Current dates',
      },
      categories: uniqueDays,
    },

    legend: {
      enabled: false, // off legend
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },

    series: [
      {
        name: 'Average expense',
        data: dates.map((entry) => {
          return entry.expense;
        }),
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
        },
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ className: 'expense-chart' }}
      options={chartOptions}
    />
  );
};

export default Chart;
