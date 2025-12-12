import { getArrayLength } from '@wetteyve/scheduler';
import { type Route } from './+types/home';

const arr = [{}, 1, 'hello', true];

export const loader = () => ({ napi: getArrayLength(arr) });

const App = ({ loaderData: { napi } }: Route.ComponentProps) => {
  const handleClick = () => window.alert(`Hello from napi-rs: ${napi}`);
  return (
    <div>
      <button onClick={handleClick}>{'PUSH FOR RUST!'}</button>
    </div>
  );
};

export default App;
