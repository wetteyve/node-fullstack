import Axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export abstract class AxiosBaseService {
  protected instance: AxiosInstance;

  protected responseBody = (response: AxiosResponse): any => {
    return response.data;
  };

  protected errorHandling = (error: any): void => {
    const response = error.response;
    console.error(response);
    throw error;
  };

  constructor(baseUrl = 'https://yveswetter-remix-production.up.railway.app') {
    this.instance = Axios.create({
      timeout: 15000,
      baseURL: baseUrl,
    });
  }
}
