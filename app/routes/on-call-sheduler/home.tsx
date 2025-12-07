import type * as WASM from 'on-call-sheduler';
import { useClientOnlyModule } from '#app/utils/client-only-module.utils';

const App = () => {
  const wasm = useClientOnlyModule<typeof WASM>(() => import('on-call-sheduler'));

  const handleClick = () => {
    if (wasm) {
      wasm.greet("Rusty dev's");
    } else {
      console.log('WASM not yet loaded!');
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={!wasm}>
        {wasm ? 'PUSH FOR WASM!' : 'Loading WASM...'}
      </button>
    </div>
  );
};

export default App;
