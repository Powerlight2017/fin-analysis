import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './expenses-editor-form.css';
import { ExpenseStateDto } from '../../redux/features/expenses/expensesSlice';

interface ExpenseFormProps {
  initialData?: ExpenseStateDto;
  onSubmit: (data: ExpenseStateDto) => void;
  handleBack: () => void;
}

const ExpenseEditorForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  handleBack,
}) => {
  const {
    handleSubmit,
    trigger,
    control,
    formState: { errors },
    setValue,
  } = useForm<ExpenseStateDto>({
    defaultValues: initialData,
  });

  const [dateStr, setDateStr] = useState<string>('');

  const processBack = () => {
    trigger(); // reset form errors.
    handleBack(); // do back.
  };

  if (initialData && initialData.date && dateStr === '') {
    setDateStr(initialData.date);
  }

  const onSubmitHandler = (data: ExpenseStateDto) => {
    const modifiedData = { ...data, date: dateStr };
    onSubmit(modifiedData);
  };

  const changeDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDateStr(e.target.value);
    setValue('date', e.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
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

      <div className="form-group limited-length-field">
        <label>Sum:</label>
        <Controller
          name="sum"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => <input {...field} type="number" />}
        />
        {errors.sum && <p>{errors.sum.message}</p>}
      </div>

      <div className="form-group limited-length-field">
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

      <button className="btn-submit" type="submit">
        Save
      </button>
      <button onClick={processBack}>Back</button>
    </form>
  );
};

export default ExpenseEditorForm;
