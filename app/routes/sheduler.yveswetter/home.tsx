import { getArrayLength } from '@wetteyve/scheduler';

const arr = [{}, 1, 'hello', true];

const App = () => {
  const handleClick = () => window.alert(`Hello from napi-rs: ${getArrayLength(arr)}`);
  return (
    <div>
      <button onClick={handleClick}>{'PUSH FOR WASM!'}</button>
    </div>
  );
};

export default App;
