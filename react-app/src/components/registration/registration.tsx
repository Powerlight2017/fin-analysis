import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import apiClient from '../../services/apiClient';
import './registration.css';
import { Axios, AxiosError, AxiosResponse } from 'axios';

interface RegistrationComponentProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

interface IFormInput {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegistrationComponent: React.FC<RegistrationComponentProps> = ({
  onRegisterSuccess,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [error, setError] = useState<string | null>(null);
  const password = watch('password', '');

  const handleGoBack = () => {
    onRegisterSuccess?.(); // Back to login
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        username: data.username,
        password: data.password,
      });

      if (response.data.success) {
        onRegisterSuccess?.();
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred while registering. Please try again.');

      let axiosError = error as AxiosError;
      if (axiosError && axiosError.response && axiosError.response.data) {
        let errorString = (axiosError.response.data as any).message as string;

        if (errorString) {
          setError(errorString || 'Registration failed');
        }
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit) as unknown as any}>
        <div className="form-group">
          <label>Email:</label>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'Username is required' }}
            render={({ field }) => <input {...field} type="email" />}
          />
          {errors.username && (
            <div className="error-message">
              {errors.username.message as string}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'Password is required' }}
            render={({ field }) => <input {...field} type="password" />}
          />
          {errors.password && (
            <div className="error-message">
              {errors.password.message as string}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Repeat password:</label>
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) =>
                value === password || 'The passwords do not match',
            }}
            render={({ field }) => <input {...field} type="password" />}
          />
          {errors.confirmPassword && (
            <div className="error-message">
              {errors.confirmPassword.message as string}
            </div>
          )}
        </div>
        <button type="submit">Register</button>
        <div className="register-link" onClick={handleGoBack}>
          Go back
        </div>
      </form>
    </div>
  );
};

export default RegistrationComponent;
