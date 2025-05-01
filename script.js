// --- LOADING SCREEN DISMISSAL ---
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 2000);
});

// --- KONAMI CODE TO START GAME ---
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      launchSnakeGame();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// --- SNAKE GAME LAUNCHER ---
function launchSnakeGame() {
  if (document.getElementById('snake-game')) return;

  const gameWrapper = document.createElement('div');
  gameWrapper.id = 'snake-game';
  gameWrapper.style.position = 'fixed';
  gameWrapper.style.top = '0';
  gameWrapper.style.left = '220px'; // leave sidebar visible
  gameWrapper.style.width = 'calc(100% - 220px)';
  gameWrapper.style.height = '100vh';
  gameWrapper.style.background = '#000';
  gameWrapper.style.zIndex = '9999';

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  const ctx = canvas.getContext('2d');

  gameWrapper.appendChild(canvas);
  document.body.appendChild(gameWrapper);
  canvas.focus();

  // ESC to exit
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(gameWrapper);
    }
  });

  // Game variables
  const box = 20;
  let snake = [{ x: 9 * box, y: 10 * box }];
  let direction = null;
  let food = randomPosition();
  let score = 0;

  // Arrow key controls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  });

  function randomPosition() {
    return {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  }

  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "#ff8dd0" : "#8deaff";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(food.x, food.y, box, box);

    // Move head
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'LEFT') headX -= box;
    if (direction === 'RIGHT') headX += box;
    if (direction === 'UP') headY -= box;
    if (direction === 'DOWN') headY += box;

    // Collision
    if (
      headX < 0 || headY < 0 ||
      headX >= canvas.width || headY >= canvas.height ||
      snake.slice(1).some(seg => seg.x === headX && seg.y === headY)
    ) {
      const prevHigh = parseInt(sessionStorage.getItem('highScore') || '0');
      if (score > prevHigh) sessionStorage.setItem('highScore', score);
      direction = null;
      snake = [{ x: 9 * box, y: 10 * box }];
      food = randomPosition();
      score = 0;
      return;
    }

    // Move snake
    const newHead = { x: headX, y: headY };
    snake.unshift(newHead);

    if (headX === food.x && headY === food.y) {
      food = randomPosition();
      score++;
    } else {
      snake.pop();
    }

    // Score Display
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px DotGothic16, sans-serif";
    ctx.fillText(`Score: ${score}`, 10, 20);
    const high = sessionStorage.getItem('highScore') || 0;
    ctx.fillText(`High: ${high}`, 10, 40);

    requestAnimationFrame(draw);
  }

  draw();
}
