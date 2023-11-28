import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import FilterComponent from './filter-component';
import { createTestStore } from '../../../utils/testUtils';

describe('FilterComponent', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  test('renders correctly', () => {
    const { getByLabelText, getByTestId } = render(
      <Provider store={store}>
        <FilterComponent filterName="main" />
      </Provider>
    );

    expect(getByLabelText(/start date/i)).toBeInTheDocument();
    expect(getByLabelText(/end date/i)).toBeInTheDocument();
    expect(getByTestId('button-search')).toBeInTheDocument();
  });

  test('updates store on filter change', async () => {
    const { getByLabelText, getByTestId } = render(
      <Provider store={store}>
        <FilterComponent filterName="main" />
      </Provider>
    );

    fireEvent.change(getByLabelText(/start date/i), { target: { value: '2020-01-01' } });
    fireEvent.change(getByLabelText(/end date/i), { target: { value: '2020-01-31' } });
    fireEvent.change(getByLabelText(/search term/i), { target: { value: 'test' } });
    fireEvent.click(getByTestId('button-search'));

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.filters.main.startDate).toBe('2020-01-01');
      expect(state.filters.filters.main.endDate).toBe('2020-01-31');
      expect(state.filters.filters.main.searchTerm).toBe('test');
    });
  });
});
