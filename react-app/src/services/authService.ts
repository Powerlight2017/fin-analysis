import apiClient from './apiClient';

class AuthService {
  async logout(): Promise<void> {
    // Delete token from headers
    localStorage.removeItem('authToken');

    // Delete auth headers.
    delete apiClient.defaults.headers['Authorization'];

    return Promise.resolve();
  }

  async login(username: string, password: string): Promise<string> {
    try {
      const response = await apiClient.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // store token into localStorage.
        localStorage.setItem('authToken', response.data.token);

        // Set token and headers for future requests.
        apiClient.defaults.headers['Authorization'] =
          'Bearer ' + response.data.token;

        return Promise.resolve(response.data.token);
      } else {
        return Promise.reject('Invalid username or password');
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response: { status: number; message?: string };
        };

        switch (axiosError.response.status) {
          case 401:
            this.logout();
            return Promise.reject('Unauthorized: Invalid username or password');
            break;
          case 500:
            return Promise.reject(
              'Internal Server Error: Please try again later',
            );
            break;
          default:
            return Promise.reject(
              'An error occurred: ' + axiosError.response.message,
            );
        }
      } else {
        return Promise.reject(
          'An error occurred while logging in. Please try again.',
        );
      }
    }
  }
}

export default new AuthService();
