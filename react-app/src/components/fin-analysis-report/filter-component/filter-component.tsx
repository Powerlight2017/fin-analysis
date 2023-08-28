import React, { useState } from 'react';
import './filter-component.css';
import { formatDate } from '../../../services/utils';

interface Props {
  startDate: Date;
  endDate: Date;
  onFilterChange: (filters: {
    startDate: Date;
    endDate: Date;
    searchTerm: string;
  }) => void;
}

const FilterComponent: React.FC<Props> = ({
  onFilterChange,
  startDate,
  endDate,
}) => {
  const [startDateVal, setStartDateVal] = useState<Date>(startDate);
  const [endDateVal, setEndDateVal] = useState<Date>(endDate);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleFilterChange = () => {
    onFilterChange({
      startDate: startDateVal,
      endDate: endDateVal,
      searchTerm,
    });
  };

  const handleFilterReset = () => {
    setSearchTerm('');

    onFilterChange({
      startDate: startDateVal,
      endDate: endDateVal,
      searchTerm: '',
    });
  };

  return (
    <div className="card card-primary">
      <div className="card-body">
        <div className="date-filter form-group">
          <label htmlFor="startDate">Start date:</label>
          <input
            id="startDate"
            type="date"
            value={formatDate(startDateVal)}
            onChange={(e) => setStartDateVal(new Date(e.target.value))}
          />
        </div>

        <div className="date-filter form-group">
          <label htmlFor="endDate">End date:</label>
          <input
            id="endDate"
            type="date"
            value={formatDate(endDateVal)}
            onChange={(e) => setEndDateVal(new Date(e.target.value))}
          />
        </div>

        <div className="search-filter form-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={handleFilterChange}>Search</button>
        <button onClick={handleFilterReset}>Reset</button>
      </div>
    </div>
  );
};

export default FilterComponent;
