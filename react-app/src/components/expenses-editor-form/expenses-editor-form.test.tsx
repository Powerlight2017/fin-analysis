import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import ExpenseEditorForm from './expenses-editor-form';
import { ExpenseStateDto } from '../../redux/features/expenses/expensesSlice';

describe('ExpenseEditorForm', () => {
  const mockOnSubmit = jest.fn();
  const mockHandleBack = jest.fn();

  const initialData: ExpenseStateDto = {
    id: 1,
    description: 'Test Description',
    sum: 100,
    date: '2021-01-01',
  };

  beforeEach(() => {
    render(
      <ExpenseEditorForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        handleBack={mockHandleBack}
      />
    );
  });

  test('renders with initial data', () => {
    expect(screen.getByLabelText(/description/i)).toHaveValue(initialData.description);
    expect(screen.getByLabelText(/sum/i)).toHaveValue(initialData.sum);
    expect(screen.getByLabelText(/date/i)).toHaveValue(initialData.date);
  });

  test('submits correct values', async () => {
    const updatedDescription = 'Updated Description';
    const updatedSum = '200';
    const updatedDate = '2021-02-01';

    await userEvent.clear(screen.getByLabelText(/description/i));
    await userEvent.type(screen.getByLabelText(/description/i), updatedDescription);
    await userEvent.type(screen.getByLabelText(/sum/i), `{selectall}${updatedSum}`);
    await userEvent.type(screen.getByLabelText(/date/i), updatedDate);

    userEvent.click(screen.getByText(/save/i));
    await new Promise((r) => setTimeout(r, 100));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...initialData,
      description: updatedDescription,
      sum: updatedSum,
      date: updatedDate,
    });
  });

  test('shows validation errors', async () => {
    userEvent.clear(screen.getByLabelText(/description/i));
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => expect(screen.getByText('This field is required')).toBeInTheDocument())
  });

  test('calls handleBack on back button click', () => {
    userEvent.click(screen.getByText(/back/i));
    expect(mockHandleBack).toHaveBeenCalled();
  });

});
