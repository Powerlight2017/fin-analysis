// Mock the Redux hooks and external handler
jest.mock('../../redux/hooks', () => ({
    useAppDispatch: jest.fn(),
  }));
  
  jest.mock('../../handlers/authHandlers', () => ({
    handleLoginClick: jest.fn(),
  }));
  
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginComponent from './login';
import { handleLoginClick } from '../../handlers/authHandlers';

// Mock the Redux dispatch and external handler
jest.mock('../../redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock('../../handlers/authHandlers', () => ({
  handleLoginClick: jest.fn(),
}));

describe('LoginComponent', () => {
  beforeEach(() => {
    render(<LoginComponent />);
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/e-mail:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/or register new account/i)).toBeInTheDocument();
  });

  test('allows input to be entered into form fields', () => {
    userEvent.type(screen.getByLabelText(/e-mail:/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password:/i), 'password123');

    expect(screen.getByLabelText(/e-mail:/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password:/i)).toHaveValue('password123');
  });

  test('calls handleLoginClick on login button click', () => {
    const email = 'test@example.com';
    const password = 'password123';
    userEvent.type(screen.getByLabelText(/e-mail:/i), email);
    userEvent.type(screen.getByLabelText(/password:/i), password);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(handleLoginClick).toHaveBeenCalledWith(expect.any(Function), email, password);
  });

  test('switches to registration view', () => {
    fireEvent.click(screen.getByText(/or register new account/i));
    
    // Verify that the registration component is rendered
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Go back/i)).toBeInTheDocument();
  });
});
