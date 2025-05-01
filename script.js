// --- LOADING SCREEN ---
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 2000); // Matches CSS fade-out timing
  });
  
  // --- KEYBOARD NAVIGATION (Arrow keys or WASD) ---
  const sections = document.querySelectorAll('main section');
  let currentSection = 0;
  
  function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
      currentSection = index;
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  document.addEventListener('keydown', (e) => {
    if (['ArrowDown', 's'].includes(e.key)) {
      scrollToSection(currentSection + 1);
    } else if (['ArrowUp', 'w'].includes(e.key)) {
      scrollToSection(currentSection - 1);
    } else if (e.key.toLowerCase() === 'g') {
      toggleGame();
    }
  });
  
  // --- FLAPPY BIRD MINI-GAME ---
  let gameVisible = false;
  
  function toggleGame() {
    if (!document.getElementById('flappy-container')) {
      createGameCanvas();
    }
    const game = document.getElementById('flappy-container');
    gameVisible = !gameVisible;
    game.style.display = gameVisible ? 'block' : 'none';
  }
  
  // Basic canvas setup
  function createGameCanvas() {
    const container = document.createElement('div');
    container.id = 'flappy-container';
    container.style.position = 'fixed';
    container.style.top = '10vh';
    container.style.left = '240px';
    container.style.zIndex = '999';
    container.style.border = '2px solid #8deaff';
    container.style.background = '#000';
    container.innerHTML = '<canvas id="flappy" width="300" height="400"></canvas>';
    document.body.appendChild(container);
    startFlappyGame();
  }
  
  // Minimal Flappy Bird logic
  function startFlappyGame() {
    const canvas = document.getElementById('flappy');
    const ctx = canvas.getContext('2d');
    let birdY = 150, gravity = 1.5, velocity = 0;
  
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') velocity = -10;
    });
  
    function gameLoop() {
      ctx.clearRect(0, 0, 300, 400);
      velocity += gravity;
      birdY += velocity;
      ctx.fillStyle = '#ff8dd0';
      ctx.fillRect(50, birdY, 20, 20); // the "bird"
  
      if (birdY > 400 || birdY < 0) birdY = 150; // reset if out of bounds
  
      requestAnimationFrame(gameLoop);
    }
  
    gameLoop();
  }
  