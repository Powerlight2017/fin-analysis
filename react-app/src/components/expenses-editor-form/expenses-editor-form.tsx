import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { formatDate } from '../../services/utils';
import './expenses-editor-form.css';

interface Expense {
  sum: number;
  description: string;
  date: Date;
  id: number;
}

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: Expense) => void;
  handleBack: () => void;
}

const ExpenseEditorForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  handleBack,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Expense>({
    defaultValues: initialData,
  });

  const [dateStr, setDateStr] = useState<string>('');

  if (initialData && initialData.date && dateStr === '') {
    setDateStr(formatDate(initialData.date));
  }

  const onSubmitHandler = (data: Expense) => {
    const modifiedData = { ...data, date: new Date(dateStr) };
    onSubmit(modifiedData);
  };

  const changeDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDateStr(e.target.value);
    setValue('date', new Date(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="form-group">
        <label>Sum:</label>
        <Controller
          name="sum"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => <input {...field} type="number" />}
        />
        {errors.sum && <p>{errors.sum.message}</p>}
      </div>

      <div className="form-group">
        <label>Description:</label>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => <input {...field} />}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div className="form-group">
        <label>Date:</label>
        <Controller
          name="date"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              value={dateStr}
              onChange={(e) => changeDate(e)}
            />
          )}
        />
        {errors.date && <p>{errors.date.message}</p>}
      </div>

      <div className="form-group">
        <label>ID:</label>
        <span>{initialData?.id}</span>
      </div>

      <button type="submit">Save</button>
      <button onClick={() => handleBack}>Back</button>
    </form>
  );
};

export default ExpenseEditorForm;
