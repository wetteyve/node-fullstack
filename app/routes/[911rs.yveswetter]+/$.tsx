import axios from "axios";
import { Fragment } from "react/jsx-runtime";
import { type Page } from "#app/utils/911rs/page.type";
import { type Route } from "./+types/$";

const fetchStrapiPages = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env['VITE_RS911_API_URL']}/pages?sort[0]=linkage:desc&sort[1]=linkage_position&populate[content][populate]=*`,
    headers: {
      Authorization: `Bearer ${import.meta.env['VITE_RS911_API_KEY']}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {

    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = {
        ...page.attributes,
        content: (page.attributes.content[0]) || {},
      };

      acc[page.attributes.slug] = pageObject;
      return acc;
    }, {});
  });
};

export const loader= async({params}: Route.LoaderArgs) => {
    const pages= await fetchStrapiPages();
    const page: Page = pages[params['*']];
    if (!page) {
        throw new Response('Not Found', {
            status: 404,
        });
    }
    return { page }
};

const Page = ({loaderData: {page}}: Route.ComponentProps) => {
    return (<Fragment>{page.navigation_title}</Fragment>)
}

export default Page;