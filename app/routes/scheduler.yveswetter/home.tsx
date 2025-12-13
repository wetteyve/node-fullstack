import { resourceBase } from '#app/utils/app-paths';
import { getGlobalMetaTags } from '#app/utils/meta.utils';
import { type Route } from './+types/home';

const arr = [{}, 1, 'hello', true];

// SSR Metadata
export const loader = async () => {
  const resourceBasePath = ENV.MODE !== 'development' ? resourceBase : '';
  const faviconUrl = `${resourceBasePath}/favicon.ico`;
  return {
    meta: [
      ...getGlobalMetaTags(),
      {
        tagname: 'link',
        rel: 'icon',
        href: faviconUrl,
      },
    ],
  };
};

// Setup WASM in client browser
export const clientLoader = async ({ serverLoader }: Route.ClientLoaderArgs) => {
  const [serverData, wasm] = await Promise.all([serverLoader(), import('@wetteyve/scheduler')]);
  return { ...serverData, wasm };
};
clientLoader.hydrate = true as const;

const App = ({ loaderData: { wasm } }: Route.ComponentProps) => {
  const handleClick = () => window.alert(`Hello from napi-rs: ${wasm.getArrayLength(arr)}`);

  return (
    <div>
      <button onClick={handleClick}>PUSH FOR WASM!</button>
    </div>
  );
};

export default App;

export const HydrateFallback = () => <p>Loading...</p>;
