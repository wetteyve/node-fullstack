import axios from "axios";
import { Outlet } from "react-router";
import Footer from "#app/components/911rs/footer/footer";
import Navbar from "#app/components/911rs/navbar/navbar";
import { splitArrayByKey } from "#app/utils/911rs/array.utils";
import { type Page } from "#app/utils/911rs/page.type";
import { type Route } from "./+types";

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

const Page = ({loaderData: {navbarEntries,footerEntries}}:Route.ComponentProps)=> (
  <div className='flex h-svh w-screen flex-col justify-between overflow-x-hidden'>
      <div className='flex flex-col justify-start'>
        <Navbar navbarEntries={navbarEntries} footerEntries={footerEntries} />
        <div className='app-container h-full'>
          <Outlet />
        </div>
      </div>
      <Footer footerEntries={footerEntries} />
    </div>
);
export default Page;