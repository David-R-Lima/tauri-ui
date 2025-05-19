import { Controls } from "./components/player";
import { PlaylistCarousel } from "./components/playlist/playlist";
import "./App.css"
import { Header } from "./components/header";
import { useState } from "react";
import { HeaderState } from "./enums/header";

function App() {
  const [state, setState] = useState<HeaderState>(HeaderState.LISTPLAYLIST)
  return (
      <main className="relative h-screen w-screen flex flex-col font-[roboto] font-bold ">
        <header>
          <Header state={state} setHeaderState={setState}></Header>
        </header>
        <section className='flex flex-col flex-1 w-full h-[85vh] overflow-hidden justify-center items-center p-10' >
          {state === HeaderState.HOME && (
            <div></div>
          )}
          {state === HeaderState.LISTPLAYLIST && (
            <PlaylistCarousel></PlaylistCarousel>
          )}
          {state === HeaderState.SETTINGS && (
            <div></div>
          )}
        </section>
        <div className='w-full'>
          <Controls></Controls>
        </div>
      </main>
  );
}

export default App;
