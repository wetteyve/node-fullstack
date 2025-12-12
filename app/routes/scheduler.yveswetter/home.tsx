import { useClientOnlyModule } from '#app/utils/client-only-module.utils';

const arr = [{}, 1, 'hello', true];

const App = () => {
  const wasm = useClientOnlyModule(() => import('@wetteyve/scheduler'));

  const handleClick = () => window.alert(`Hello from napi-rs: ${wasm?.getArrayLength(arr)}`);
  return (
    <div>
      <button disabled={!wasm} onClick={handleClick}>
        {wasm ? 'PUSH FOR WASM!' : 'Loading...'}
      </button>
    </div>
  );
};

export default App;
