import { Controls } from "./components/player";
import { PlaylistCarousel } from "./components/playlist";
import "./App.css"
import { Header } from "./components/header";

function App() {
  return (
      <main className="relative h-screen w-screen flex flex-col font-[roboto] font-bold ">
        <header>
          <Header></Header>
        </header>
        <section className='flex flex-col flex-1 w-full overflow-hidden justify-center items-center' >
          <PlaylistCarousel></PlaylistCarousel>
        </section>
        <div className=''>
          <Controls></Controls>
        </div>
      </main>
  );
}

export default App;
