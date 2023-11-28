import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getEndDate, getStartDate } from '../../../services/utils';

// Reducer interface
export interface PageFilter {
  startDate: string;
  endDate: string;
  searchTerm: string;
}

export interface PageFilterDto {
  startDate: Date;
  endDate: Date;
  searchTerm: string;
}

interface FiltersStore {
  [page: string]: PageFilter;
}

interface FilterState {
  initialStartDate: string;
  initialEndDate: string;

  filters: FiltersStore;
}

const initialState: FilterState = {
  initialStartDate: getStartDate().toISOString().split('T')[0],
  initialEndDate: getEndDate().toISOString().split('T')[0],
  filters: {},
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ page: string; filter: PageFilter }>,
    ) => {
      const { startDate, endDate, searchTerm } = action.payload.filter;
      const page = action.payload.page;

      // Create object for page if is not created before
      if (!state.filters[page]) {
        state.filters[page] = {
          startDate,
          endDate,
          searchTerm,
        };
      } else {
        // Update fiter values
        state.filters[page].startDate = startDate;
        state.filters[page].endDate = endDate;
        state.filters[page].searchTerm = searchTerm;
      }
    },
    resetFilter: (state, action: PayloadAction<{ page: string }>) => {
      const { page } = action.payload;

      // Set default values.
      state.filters[page] = {
        startDate: initialState.initialStartDate,
        endDate: initialState.initialEndDate,
        searchTerm: '',
      };
    },
  },
});

export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
