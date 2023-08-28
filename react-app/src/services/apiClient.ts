import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:44379',
  timeout: 10000,
});

apiClient.interceptors.response.use((response) => {
  const transformDateFields = (data: any) => {
    if (!data || typeof data !== 'object') return data;

    for (const key of Object.keys(data)) {
      if (
        typeof data[key] === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/.test(data[key])
      ) {
        const match = data[key].match(
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
        );
        if (match) {
          data[key] = new Date(
            Date.UTC(
              +match[1],
              +match[2] - 1,
              +match[3],
              +match[4],
              +match[5],
              +match[6],
            ),
          );
        }
      } else if (
        typeof data[key] === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(data[key])
      ) {
        const [year, month, day] = data[key]
          .split('-')
          .map((x: string | number) => +x);
        data[key] = new Date(Date.UTC(year, month - 1, day));
      } else if (typeof data[key] === 'object') {
        transformDateFields(data[key]);
      }
    }
  };

  transformDateFields(response.data);
  return response;
});

export default apiClient;
