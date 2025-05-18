import { Outlet } from "react-router";
import Footer from "#rs911/components/footer/footer";
import Navbar from "#rs911/components/navbar/navbar";
import { splitArrayByKey } from "#rs911/utils/array.utils";
import  {fetchStrapiPages, type Page} from "#rs911/utils/page.utils";
import { type Route } from "./+types";
import '#rs911/app.css';

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