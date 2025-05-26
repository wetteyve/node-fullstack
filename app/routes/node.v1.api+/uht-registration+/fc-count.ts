import axios, { type AxiosRequestConfig } from 'axios';

export const loader = async () => {
  const url = `${ENV.UHT_CMS_API}/registrations`;
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };
  const registrations: { attributes: { category: string } }[] = (await axios.get(url, config)).data.data;
  const fcCount = registrations.filter((registration) => registration.attributes.category.includes('FC')).length;
  return { fcCount };
};
