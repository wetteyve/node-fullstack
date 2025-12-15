import { debounce } from '@tanstack/pacer';
import { useState } from 'react';
import { resourceBase } from '#app/utils/app-paths';
import { getGlobalMetaTags } from '#app/utils/meta.utils';
import { type Route } from './+types/home';
import '#app/styles/tailwind.css';

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
  const [serverData, rusty] = await Promise.all([serverLoader(), import('@wetteyve/rusty')]);
  return { ...serverData, rusty };
};
clientLoader.hydrate = true as const;

const App = ({ loaderData: { rusty } }: Route.ComponentProps) => {
  const [fibonacci, setFibonacci] = useState('Type a number!');
  const lazyFibonacci = debounce(
    (input: number) => {
      if (input <= 200000) setFibonacci(`${input}-th fibonacci is: ${rusty.fibonacci(input)}`);
    },
    { wait: 300 }
  );

  return (
    <div className='flex flex-col gap-4 py-4 items-center'>
      <h1>WASM in action</h1>
      <button className='bg-blue-500 rounded-sm cursor-pointer w-2xs' onClick={() => window.alert(rusty.helloNapi())}>
        Hello napi!
      </button>
      <button className='bg-blue-500 rounded-sm cursor-pointer w-2xs' onClick={() => window.alert(rusty.helloNapi('rusty'))}>
        Hello rusty!
      </button>
      <button
        className='bg-blue-500 rounded-sm cursor-pointer w-2xs'
        onClick={() => {
          const confirmed = window.confirm('Please make sure the browser console is visible. Click OK if the console is open.');
          if (confirmed) {
            rusty.guessingGame();
          }
        }}
      >
        Guess the number! (console game)
      </button>
      <div>
        <input
          placeholder='Fibonacci'
          className='border rounded-sm'
          type='number'
          onChange={(e) => lazyFibonacci(Number(e.target.value))}
        />
        <span className='wrap-anywhere px-4'>{fibonacci}</span>
      </div>
    </div>
  );
};

export default App;

export const HydrateFallback = () => <p>Loading...</p>;
