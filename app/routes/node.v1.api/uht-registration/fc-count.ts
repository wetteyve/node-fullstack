import axios, { type AxiosRequestConfig } from 'axios';

export const loader = async () => {
  const url = `${ENV.UHT_CMS_API}/registrations`;
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };
  const registrations: { attributes: { faesslicup: boolean } }[] = (await axios.get(url, config)).data.data;
  const fcCount = registrations.filter((registration) => registration.attributes.faesslicup).length;
  return fcCount;
};
