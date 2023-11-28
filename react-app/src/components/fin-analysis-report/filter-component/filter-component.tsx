import React, { useEffect } from 'react';
import {
  setFilter,
  resetFilter,
} from '../../../redux/features/filter/filterSlice';
import './filter-component.css';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchExpenses } from '../../../redux/features/expenses/expensesSlice';
import { RootState } from '../../../redux/store';
import toast from 'react-hot-toast';
import { convertFilterStateToDto, formatDate } from '../../../services/utils';

export interface IFilterProperties {
  filterName: 'main' | 'editor';
}

const FilterComponent: React.FC<IFilterProperties> = (
  filterProperties: IFilterProperties,
) => {
  const dispatch = useAppDispatch();
  const filtersState = useAppSelector((state) => state.filters);
  let filter = filtersState.filters[filterProperties.filterName];
  const { initialStartDate, initialEndDate } = useAppSelector(
    (state: RootState) => state.filters,
  );

  const datesAreValid = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error('Start date cannot be greater than end date.');
      return false;
    }

    return true;
  };

  const handleFilterChange = (updatedFilter: {
    startDate: string;
    endDate: string;
    searchTerm: string;
  }) => {
    dispatch(
      setFilter({ page: filterProperties.filterName, filter: updatedFilter }),
    );
  };

  const handleSearchClick = () => {
    if (datesAreValid(new Date(filter.startDate), new Date(filter.endDate))) {
      dispatch(
        fetchExpenses({
          pageFilter: convertFilterStateToDto(filter),
          target: filterProperties.filterName,
        }),
      );
    }
  };

  const handleFilterReset = () => {
    dispatch(resetFilter({ page: filterProperties.filterName }));
  };

  useEffect(() => {
    if (!filter) {
      filter = {
        startDate: initialStartDate,
        endDate: initialEndDate,
        searchTerm: '',
      };
    }
    dispatch(setFilter({ page: filterProperties.filterName, filter: filter }));
  }, [filter]);

  return (
    <div className="card card-primary">
      <div className="card-body">
        <div className="date-filter form-group">
          <label htmlFor="startDate">Start date:</label>
          <input
            id="startDate"
            type="date"
            value={filter ? filter.startDate : initialStartDate}
            onChange={(e) =>
              handleFilterChange({ ...filter, startDate: e.target.value })
            }
          />
        </div>

        <div className="date-filter form-group">
          <label htmlFor="endDate">End date:</label>
          <input
            id="endDate"
            type="date"
            value={filter ? filter.endDate : initialEndDate}
            onChange={(e) =>
              handleFilterChange({ ...filter, endDate: e.target.value })
            }
          />
        </div>

        <div className="search-filter form-group">
          <label htmlFor="searchTerm">Search Term:</label>
          <input
            id="searchTerm"
            type="text"
            value={filter ? filter.searchTerm : ''}
            onChange={(e) =>
              handleFilterChange({ ...filter, searchTerm: e.target.value })
            }
          />
        </div>

        <button className="btn-search" onClick={handleSearchClick}>
          Search
        </button>
        <button onClick={handleFilterReset}>Reset</button>
      </div>
    </div>
  );
};

export default FilterComponent;
