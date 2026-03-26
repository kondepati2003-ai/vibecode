import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { motion } from 'motion/react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 200);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    // Speed increases slightly as score goes up
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 30) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, score, highScore, generateFood]);

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-12 w-full max-w-5xl">
      {/* Mobile Top Bar (Score & High Score) */}
      <div className="flex md:hidden w-full justify-between items-end px-4">
        <div className="flex flex-col">
          <span className="text-[#ff00ff] text-xl font-bold tracking-widest uppercase">Score</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.5, color: '#ff00ff' }}
            animate={{ scale: 1, color: '#00ffff' }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            className="text-4xl font-black text-[#00ffff] glitch-text inline-block"
            data-text={score}
          >
            {score}
          </motion.span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ff00ff] text-xl font-bold tracking-widest uppercase flex items-center gap-1">
            <Trophy className="w-5 h-5" /> High Score
          </span>
          <span className="text-3xl font-bold text-[#00ffff] glitch-text" data-text={highScore}>{highScore}</span>
        </div>
      </div>

      {/* Desktop Left Sidebar (Score) */}
      <div 
        className="hidden md:flex flex-col justify-end pb-2 min-w-[120px]"
        style={{ height: 'calc(min(80vw, 500px) + 16px)' }}
      >
        <span className="text-[#ff00ff] text-xl font-bold tracking-widest uppercase mb-1">Score</span>
        <motion.span 
          key={score}
          initial={{ scale: 1.5, color: '#ff00ff', x: -10 }}
          animate={{ scale: 1, color: '#00ffff', x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          className="text-6xl font-black text-[#00ffff] glitch-text inline-block origin-left"
          data-text={score}
        >
          {score}
        </motion.span>
      </div>

      <div 
        ref={gameAreaRef}
        tabIndex={0}
        className={`relative raw-border-cyan bg-black p-2 outline-none ${isShaking ? 'animate-[glitch-box_0.1s_infinite]' : ''}`}
      >
        <div 
          className="grid bg-black border-2 border-[#00ffff]/30"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 500px)',
            height: 'min(80vw, 500px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full border-[0.5px] border-[#00ffff]/10 ${
                  isSnakeHead ? 'bg-[#00ffff] z-10' :
                  isSnakeBody ? 'bg-[#00ffff]/80 animate-pulse' :
                  isFood ? 'bg-[#ff00ff] animate-pulse scale-75 border-2 border-[#00ffff] rotate-45' :
                  ''
                }`}
              />
            );
          })}
        </div>

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 overflow-hidden">
            {gameOver ? (
              <>
                <div className="absolute top-4 left-4 text-[#ff00ff] text-xs opacity-50 font-mono whitespace-pre-wrap">
                  {Array.from({ length: 10 }).map(() => Math.random().toString(16).substr(2, 8).toUpperCase()).join('\n')}
                </div>
                <div className="absolute bottom-4 right-4 text-[#00ffff] text-xs opacity-50 font-mono whitespace-pre-wrap text-right">
                  {Array.from({ length: 10 }).map(() => Math.random().toString(16).substr(2, 8).toUpperCase()).join('\n')}
                </div>
                <h2 className="text-6xl font-black text-[#ff00ff] mb-2 glitch-text" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-[#00ffff] mb-8 text-2xl bg-[#ff00ff]/20 px-4 py-1 border border-[#00ffff]">SCORE_DUMP: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none uppercase tracking-widest font-bold text-xl relative group glitch-hover"
                >
                  <span className="absolute -top-2 -left-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <span className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <RotateCcw className="w-6 h-6" /> REBOOT_SYS
                </button>
              </>
            ) : !hasStarted ? (
              <>
                <h2 className="text-6xl font-black text-[#00ffff] mb-8 glitch-text tracking-widest" data-text="SNAKE.EXE">SNAKE.EXE</h2>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-4 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none uppercase tracking-widest font-bold text-2xl relative group glitch-hover"
                >
                  <span className="absolute -top-2 -left-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <span className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <Play className="w-8 h-8" /> INIT_SEQ
                </button>
                <p className="mt-8 text-[#ff00ff] text-lg border-b border-[#00ffff] pb-1">INPUT: [ARROWS] OR [WASD]</p>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black text-[#00ffff] mb-8 tracking-widest glitch-text" data-text="SUSPENDED">SUSPENDED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none uppercase tracking-widest font-bold text-xl relative group glitch-hover"
                >
                  <span className="absolute -top-2 -left-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <span className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#ff00ff] group-hover:bg-black"></span>
                  <Play className="w-6 h-6" /> RESUME_OP
                </button>
                <p className="mt-6 text-[#ff00ff] text-lg border-b border-[#00ffff] pb-1">INPUT: [SPACE] TO TOGGLE</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop Right Sidebar (High Score) */}
      <div 
        className="hidden md:flex flex-col items-end pt-2 min-w-[120px]"
        style={{ height: 'calc(min(80vw, 500px) + 16px)' }}
      >
        <span className="text-[#ff00ff] text-xl font-bold tracking-widest uppercase flex items-center gap-1 mb-1">
          <Trophy className="w-5 h-5" /> High Score
        </span>
        <span className="text-5xl font-bold text-[#00ffff] glitch-text" data-text={highScore}>{highScore}</span>
      </div>
    </div>
  );
}
