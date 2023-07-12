import { Recommendations } from './components/Recommendations';
import { SpotifyConnect } from './components/SpotifyConnect';

function App() {
  const isSignedIn = false;

  return (
    <div className="App bg-indigo-50 font-montserrat h-full w-full">
      <div className='flex justify-center items-center h-full w-full'>
        {
          isSignedIn ? <Recommendations /> : <SpotifyConnect />
        }
      </div>
    </div>
  );
}

export default App;
