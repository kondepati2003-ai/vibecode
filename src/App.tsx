import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-mono flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="static-noise"></div>
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      <div className="screen-tear w-full flex flex-col items-center">
        <header className="mb-12 text-center z-10 relative">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter glitch-text mb-2" data-text="SYS.SNAKE">
            SYS.SNAKE
          </h1>
          <p className="text-[#ff00ff] tracking-widest uppercase text-2xl font-bold bg-black inline-block px-2 border border-[#00ffff]">
            // OVERRIDE_PROTOCOL_INITIATED<span className="animate-pulse">_</span>
          </p>
        </header>

        <main className="flex flex-col xl:flex-row gap-16 xl:gap-24 w-full max-w-7xl items-center xl:items-start justify-center z-10">
          <div className="w-full xl:w-auto flex justify-center order-2 xl:order-1">
            <MusicPlayer />
          </div>
          
          <div className="w-full xl:w-auto flex justify-center order-1 xl:order-2">
            <SnakeGame />
          </div>
        </main>
      </div>
    </div>
  );
}
