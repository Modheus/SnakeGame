// Criando elemento canvas e definindo contexto 2D (também pode ser 3d ou bitmap)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

// cores usadas
const snkColor = 'white';
const aplColor = 'red';

// Dimensoes do canvas
const width = canvas.width;
const height = canvas.height;

// criando a cobrinha
ctx.fillStyle = snkColor;
ctx.fillRect(50, 50, 10, 10);

// tamanho de cada bloco da cobra
const snakeSize = 20;
const spawn = 0
// Lista contendo um dicionario com as posições dos blocos da cobra
let snake = [
    {x: spawn, y: spawn}
]

// movimentos vertical e horizontal
movement = {
    dx: 0,
    dy: snakeSize, 

    up: function() {
        // Prevents turning in the opposite direction
        if (this.dy > 0) {
            return;
        }
        this.dy = snakeSize * -1; // Tornando o vetor vertical negativo
        this.dx = 0;  // Zerando dx para mover apenas verticalmente
},
    down: function () {
        if (this.dy < 0) {
            return;
        }
        this.dy = snakeSize;
        this.dx = 0;
},
    left: function () {
        if (this.dx > 0) {
            return;
        }
        this.dx = snakeSize * -1;
        this.dy = 0; 
},
    right: function() {
        if (this.dx < 0) {
            return;
        }
        this.dx = snakeSize;
        this.dy = 0;
}
}

document.addEventListener('keydown', function(event) {
    let key = event.key;

    if (key == 'ArrowLeft') {  // Para a tecla esquerda
        movement.left();
    }
    else if (key == 'ArrowUp') {  // Para a tecla para cima
        movement.up()
    } 
    else if (key == 'ArrowRight') {  // Para a tecla direita
        movement.right()
    } 
    else if (key == 'ArrowDown') {  // Para a tecla para baixo
        movement.down()
    }
})

// função de checar se valor está nos limites do canvas
function bounds(pos) {
    if (pos >= width) {
        pos = 0;
    }
    else if (pos < 0) {
        pos = width;
    }
    return pos;
}

// função de desenhar a cobra, que limpa o canvas a cada frame e preenche o canvas na posição indicada em cada elemento da lista
function drawSnake() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = snkColor;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, snakeSize, snakeSize)
    });
}

// random createApple position
function randomPos() {
    x = Math.floor(Math.random()*(width/snakeSize)) * snakeSize;
    y = Math.floor(Math.random()*(width/snakeSize)) * snakeSize;

    return {x, y};
}

function drawApple(x, y) {
    ctx.fillStyle = aplColor;
    ctx.fillRect(x, y, snakeSize, snakeSize);
}

let applePos = randomPos();

let score = 0;
function UpdateScore() {
    let ScoreDiv = document.getElementById("score");
    ScoreDiv.innerHTML = `Score: ${score+=1}`;
}

// Função de esconder o botão restart e reiniciar o jogo
function restart() {
    let restartButton = document.getElementById("restart-button");
    restartButton.style.transform = "scale(0)";
    score = 0;
    game=setInterval(gameloop, 100);
}

// Mostra o botão restart ao receber gameover 
function showRestart() {
    let restartButton = document.getElementById("restart-button");
    restartButton.style.transform = "scale(1)";
}

// função de atualizar a posição da cobra
function updateSnake() {
    // Atualiza a cabeça da cobra, ao pegar a posição atual da cabeça e somar com o vetor de direção
    const head = {x: bounds(snake[0].x + movement.dx), y: bounds(snake[0].y + movement.dy) };
    
    // Adiciona a cabeça ao inicio do array
    snake.unshift(head);

    // Colisão com self, checa todas as posições da cobra e vê se bate com a cabeça
    for (let i = 1; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            clearInterval(game);
            snake.length = 2;
            snake[0].x = spawn, snake[0].y=spawn;
            showRestart();
        }
    }
    // Remove a ultima parte da cobra
    snake.pop();

    // Cria uma nova maçã no contato, e aumenta o tamanho da cobra
    if (head.x == applePos.x && head.y == applePos.y) {
        applePos = randomPos();
        let lastSegment = snake[snake.length-1];
        let newSegment = {x: lastSegment, y: lastSegment};
        snake.push(newSegment);
        UpdateScore();
    }
}

// função principal
function gameloop() {
    drawSnake();
    drawApple(applePos.x, applePos.y);
    updateSnake();
}

game = setInterval(gameloop, 100);