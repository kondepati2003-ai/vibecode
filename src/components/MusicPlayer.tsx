import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'ERR_01: CORRUPTED_DATA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'ERR_02: MEMORY_LEAK', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'ERR_03: FATAL_EXCEPTION', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="raw-border-magenta bg-black p-6 w-full max-w-sm flex flex-col gap-6 relative">
      <div className="absolute -top-3 left-4 bg-[#ff00ff] text-black text-lg px-2 font-bold">AUDIO_SUBSYSTEM</div>
      <div className="absolute -bottom-3 right-4 bg-[#00ffff] text-black text-sm px-2 font-bold">0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}</div>
      
      <div className="flex items-center gap-4 mt-2">
        <div className={`p-2 border-2 border-[#00ffff] bg-black ${isPlaying ? 'animate-pulse' : ''}`}>
          <Music className="w-8 h-8 text-[#00ffff]" />
        </div>
        <div className="overflow-hidden">
          <h2 className="text-[#ff00ff] font-bold tracking-wider text-xl uppercase">STREAMING</h2>
          <p className="text-[#00ffff] text-2xl truncate w-48 glitch-text" data-text={currentTrack.title}>{currentTrack.title}</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between border-y-2 border-[#ff00ff] py-4">
        <button 
          onClick={skipBack}
          className="p-2 text-[#00ffff] hover:bg-[#ff00ff] hover:text-black transition-none border-2 border-transparent hover:border-[#00ffff] glitch-hover"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 border-2 border-[#00ffff] text-[#ff00ff] hover:bg-[#00ffff] hover:text-black transition-none glitch-hover"
        >
          {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
        </button>
        
        <button 
          onClick={skipForward}
          className="p-2 text-[#00ffff] hover:bg-[#ff00ff] hover:text-black transition-none border-2 border-transparent hover:border-[#00ffff] glitch-hover"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-[#00ffff]">
        <Volume2 className="w-6 h-6" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black border-2 border-[#ff00ff] appearance-none cursor-pointer accent-[#00ffff]"
        />
      </div>

      <div className="mt-2 space-y-2">
        <h3 className="text-xl text-[#ff00ff] uppercase tracking-widest mb-2 border-b-2 border-[#00ffff] inline-block">INDEX</h3>
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`text-xl cursor-pointer px-2 py-1 transition-none border-2 glitch-hover ${
              idx === currentTrackIndex 
                ? 'text-black bg-[#00ffff] border-[#ff00ff]' 
                : 'text-[#00ffff] border-transparent hover:border-[#ff00ff]'
            }`}
          >
            [{idx}] {track.title}
          </div>
        ))}
      </div>
    </div>
  );
}
