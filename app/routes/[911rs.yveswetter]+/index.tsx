import axios from "axios";
import { splitArrayByKey } from "#app/utils/911rs/array.utils";
import { type Page } from "#app/utils/911rs/page.type";

const fetchStrapiPages = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env['VITE_RS911_API_URL']}/pages?sort[0]=linkage:desc&sort[1]=linkage_position`,
    headers: {
      Authorization: `Bearer ${import.meta.env['VITE_RS911_API_KEY']}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {

    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      console.log(page.attributes.linkage);
      const pageObject: Page = page.attributes;
      acc[page.attributes.slug] = pageObject;
      return acc;
    }, {});
  });
};


export const loader= async() => {
    const pages: {[key: string]: Page}= await fetchStrapiPages();
    const [navbarEntries, footerEntries] = splitArrayByKey(Object.values(pages), 'linkage');
    return { navbarEntries, footerEntries }
};