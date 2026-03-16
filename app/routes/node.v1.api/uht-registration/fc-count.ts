import { type AxiosRequestConfig } from 'axios';
import { axiosInstance } from '#app/utils/axios-instance.utils';

export const loader = async () => {
  const url = `${ENV.UHT_CMS_API}/registrations`;
  const config: AxiosRequestConfig = {
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };
  const response = await axiosInstance.get<{ data: { attributes: { faesslicup: boolean } }[] }>(url, config);
  const registrations = response.data.data;
  const fcCount = registrations.filter((registration) => registration.attributes.faesslicup).length;
  return fcCount;
};
