import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { formatDate } from '../../../services/utils';
import FilterComponent from './filter-component';

const mockOnFilterChange = jest.fn();

describe('FilterComponent', () => {
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');

  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <FilterComponent
        startDate={startDate}
        endDate={endDate}
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect((getByLabelText(/start date/i) as HTMLInputElement).value).toBe(
      formatDate(startDate),
    );
    expect((getByLabelText(/end date/i) as HTMLInputElement).value).toBe(
      formatDate(endDate),
    );
    expect(getByText(/search/i)).toBeInTheDocument();
    expect(getByText(/reset/i)).toBeInTheDocument();
  });

  it('calls onFilterChange with correct values when search is clicked', () => {
    const { getByLabelText, getByText } = render(
      <FilterComponent
        startDate={startDate}
        endDate={endDate}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.change(getByLabelText(/start date/i), {
      target: { value: '2023-01-02' },
    });
    fireEvent.change(getByLabelText(/end date/i), {
      target: { value: '2023-12-30' },
    });

    fireEvent.click(getByText(/search/i));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      startDate: new Date('2023-01-02'),
      endDate: new Date('2023-12-30'),
      searchTerm: '',
    });
  });

  it('calls onFilterChange with default values when reset is clicked', () => {
    const { getByText } = render(
      <FilterComponent
        startDate={startDate}
        endDate={endDate}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(getByText(/reset/i));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      startDate,
      endDate,
      searchTerm: '',
    });
  });
});
