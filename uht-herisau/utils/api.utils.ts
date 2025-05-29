import { type AxiosRequestConfig, type Method } from 'axios';

export const getReqConfig = (path: string, params: object = {}, method: Method = 'GET'): AxiosRequestConfig => {
  return {
    method: method,
    maxBodyLength: Infinity,
    url: `${ENV.UHT_CMS_API}/${path}`,
    params: { populate: 'deep', ...params },
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };
};
