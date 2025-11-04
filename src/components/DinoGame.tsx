import { useState, useEffect, useRef, useCallback } from 'react';

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

const DinoGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameStateRef = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    frameCount: 0,
    gameSpeed: 6,
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 200;
  const DINO_WIDTH = 40;
  const DINO_HEIGHT = 43;
  const GROUND_HEIGHT = 20;
  const DINO_GROUND_Y = CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;

  const drawDino = useCallback((ctx: CanvasRenderingContext2D, y: number, frame: number) => {
    ctx.fillStyle = '#535353';
    
    ctx.fillRect(60 + 6, y, 22, 22);
    ctx.fillRect(60 + 6, y + 22, 28, 16);
    ctx.fillRect(60 + 6 + 15, y + 38, 8, 5);
    ctx.fillRect(60 + 6 + 25, y + 38, 8, 5);

    ctx.fillRect(60 + 6 + 17, y + 6, 5, 5);
    ctx.fillRect(60 + 6 + 13, y + 10, 6, 3);

    if (!gameStateRef.current.isJumping && frame % 10 < 5) {
      ctx.clearRect(60 + 6 + 15, y + 38, 8, 5);
      ctx.fillRect(60 + 6 + 15, y + 35, 8, 3);
    }
  }, []);

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    ctx.fillStyle = '#535353';
    
    const segments = 3;
    const segmentWidth = 8;
    const segmentGap = 4;
    
    for (let i = 0; i < segments; i++) {
      ctx.fillRect(
        obstacle.x + i * (segmentWidth + segmentGap),
        CANVAS_HEIGHT - GROUND_HEIGHT - obstacle.height,
        segmentWidth,
        obstacle.height
      );
      
      ctx.fillRect(
        obstacle.x + i * (segmentWidth + segmentGap) + 2,
        CANVAS_HEIGHT - GROUND_HEIGHT - obstacle.height - 8,
        4,
        8
      );
    }
  }, []);

  const checkCollision = useCallback((dinoY: number, obstacles: Obstacle[]): boolean => {
    const dinoLeft = 60;
    const dinoRight = dinoLeft + DINO_WIDTH;
    const dinoTop = dinoY;
    const dinoBottom = dinoY + DINO_HEIGHT;

    for (const obstacle of obstacles) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = CANVAS_HEIGHT - GROUND_HEIGHT - obstacle.height;
      const obstacleBottom = CANVAS_HEIGHT - GROUND_HEIGHT;

      if (
        dinoRight > obstacleLeft + 10 &&
        dinoLeft < obstacleRight - 10 &&
        dinoBottom > obstacleTop + 5 &&
        dinoTop < obstacleBottom
      ) {
        return true;
      }
    }
    return false;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#535353';
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, 2);

    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, CANVAS_HEIGHT - GROUND_HEIGHT + 10, 2, 2);
    }

    if (state.isJumping || state.dinoY < DINO_GROUND_Y) {
      state.dinoVelocity += GRAVITY;
      state.dinoY += state.dinoVelocity;

      if (state.dinoY >= DINO_GROUND_Y) {
        state.dinoY = DINO_GROUND_Y;
        state.dinoVelocity = 0;
        state.isJumping = false;
      }
    }

    drawDino(ctx, state.dinoY, state.frameCount);

    state.frameCount++;
    if (state.frameCount % 90 === 0) {
      state.obstacles.push({
        x: CANVAS_WIDTH,
        width: 40,
        height: 40,
      });
    }

    state.obstacles = state.obstacles.filter(obstacle => {
      obstacle.x -= state.gameSpeed;
      return obstacle.x > -50;
    });

    state.obstacles.forEach(obstacle => {
      drawObstacle(ctx, obstacle);
    });

    if (checkCollision(state.dinoY, state.obstacles)) {
      setGameOver(true);
      setGameStarted(false);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    setScore(Math.floor(state.frameCount / 10));

    if (state.frameCount % 200 === 0) {
      state.gameSpeed += 0.5;
    }
  }, [drawDino, drawObstacle, checkCollision, score, highScore]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameStarted, gameLoop]);

  const jump = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.isJumping && state.dinoY === DINO_GROUND_Y) {
      state.isJumping = true;
      state.dinoVelocity = JUMP_STRENGTH;
    }
  }, []);

  const startGame = useCallback(() => {
    gameStateRef.current = {
      dinoY: DINO_GROUND_Y,
      dinoVelocity: 0,
      isJumping: false,
      obstacles: [],
      frameCount: 0,
      gameSpeed: 6,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted || gameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, startGame, jump]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mb-8 text-center">
        <div className="flex gap-8 justify-center mb-4 font-mono text-lg">
          <div className="text-gray-700">
            Счёт: <span className="font-bold text-gray-900">{score}</span>
          </div>
          <div className="text-gray-700">
            Рекорд: <span className="font-bold text-gray-900">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-gray-800 rounded-lg shadow-2xl bg-white cursor-pointer"
          onClick={() => {
            if (!gameStarted || gameOver) {
              startGame();
            } else {
              jump();
            }
          }}
        />
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-4">🦖</div>
              <div className="text-xl font-mono text-gray-700 mb-2">Нажми ПРОБЕЛ</div>
              <div className="text-sm font-mono text-gray-600">чтобы начать</div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
            <div className="text-center bg-white px-8 py-6 rounded-lg shadow-xl border-2 border-gray-800">
              <div className="text-3xl font-bold text-gray-800 mb-2">GAME OVER</div>
              <div className="text-lg font-mono text-gray-700 mb-4">Счёт: {score}</div>
              <div className="text-sm font-mono text-gray-600">Нажми ПРОБЕЛ для рестарта</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DinoGame;
