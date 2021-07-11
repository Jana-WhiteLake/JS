const TILE_SIZE = 16;
const CANVAS_WIDTH = 10;
const CANVAS_HEIGHT = 10;


let snake = document.getElementsByClassName("snake-head")[0];
let body = document.getElementById("body");
let apple = document.getElementById("apple");
let canvas = document.getElementById("canvas");
let score_div = document.getElementById("score");

canvas.style.width = CANVAS_WIDTH * TILE_SIZE + "px";
canvas.style.height = CANVAS_HEIGHT * TILE_SIZE + "px";

body.addEventListener("keypress", control);

let interval = setInterval(gameCycle, 150)

console.log(interval);

let score = 0;

/* Отвечает за добавление нового сегмента
*/
let segmentToBeAddedFlag = false;
let snake_body = [{
    x: 0,
    y: 0,
    element: snake,
}
];

let direction;

/**не меняется направление в коде до тех пор, пока оно не отрисуется, 
 * т.е. чтобы нельзя было менять направление за один проход игрового цикла
*/
let flagAppliedDirection = false; 

let apple_x = Math.floor(Math.random() * CANVAS_WIDTH);
let apple_y = Math.floor(Math.random() * CANVAS_HEIGHT);

apple.style.top = apple_y * TILE_SIZE + "px";
apple.style.left = apple_x * TILE_SIZE + "px";

// слушатель клавиатуры передаёт в эту функцию нажатую кнопку
function control(event) {
    console.log(event);
    if (!flagAppliedDirection) return;
    if (event.key == "w" || event.key == "ц") {
        if (direction != "DOWN" && snake_body.length != 1 || snake_body.length == 1) {
            direction = "UP"
        }
    }
    else if (event.key == "a" || event.key == "ф") {
        if (direction != "RIGHT" && snake_body.length != 1 || snake_body.length == 1) {
            direction = "LEFT"
        }
    }
    else if (event.key == "d" || event.key == "в") {
        if (direction != "LEFT" && snake_body.length != 1 || snake_body.length == 1) {
            direction = "RIGHT"
        }
    }
    else if (event.key == "s" || event.key == "ы") {
        if (direction != "UP" && snake_body.length != 1 || snake_body.length == 1) {
            direction = "DOWN"
        }
    }
    flagAppliedDirection = false;
}

function moveFunction() {
    if (segmentToBeAddedFlag == true) {
        segmentToBeAddedFlag = false;
        addSegment();
        return;
    }
    for (let segment of snake_body.map(s => s).reverse()) {
        let index = snake_body.indexOf(segment);
        if (index != 0) {
            segment.x = snake_body[index - 1].x;
            segment.y = snake_body[index - 1].y;
        }
    }
    if (direction == "UP") {
        snake_body[0].y -= 1;
    }
    else if (direction == "LEFT") {
        snake_body[0].x -= 1;
    }
    else if (direction == "RIGHT") {
        snake_body[0].x += 1;
    }
    else if (direction == "DOWN") {
        snake_body[0].y += 1;
    }
    if (snake_body[0].x < 0) {
        snake_body[0].x = CANVAS_WIDTH - 1;
    }
    else if (snake_body[0].x > CANVAS_WIDTH - 1) {
        snake_body[0].x = 0;
    }
    else if (snake_body[0].y < 0) {
        snake_body[0].y = CANVAS_HEIGHT - 1;
    }
    else if (snake_body[0].y > CANVAS_HEIGHT - 1) {
        snake_body[0].y = 0;
    }
    flagAppliedDirection = true; 
}

function gameCycle() {
    moveFunction();
    logicFunction();
    drawFunction();
}

function logicFunction() {
    if (apple_x == snake_body[0].x && apple_y == snake_body[0].y) {
        
        do {
            apple_x = Math.floor(Math.random() * CANVAS_WIDTH);
            apple_y = Math.floor(Math.random() * CANVAS_HEIGHT);
            console.log("перерисовываю яблоко")
        } while (appleCrossesSnake())

        
        segmentToBeAddedFlag = true;

        score++;
        score_div.innerHTML = "Score: " + score;
    }
    for (let segment of snake_body) {
        let index = snake_body.indexOf(segment);
        if (index != 0) {
            if (segment.x == snake_body[0].x && segment.y == snake_body[0].y) {
                clearInterval(interval);
                alert(`GAME OVER!\n Score: ${score}`)
            }
        }
    }
}

function drawFunction() {
    apple.style.top = apple_y * TILE_SIZE + "px";
    apple.style.left = apple_x * TILE_SIZE + "px";
    for (let segment of snake_body) {
        segment.element.style.top = segment.y * TILE_SIZE + "px"; //отрисовывает позицию сегмента змейки
        segment.element.style.left = segment.x * TILE_SIZE + "px";
    }
}

function addSegment() {
    let newSegment = document.createElement('div'); //создаёт div в html
    newSegment.classList.add("snake-segment"); //добавляет в список классов указанных в теге новый класс
    newSegment.classList.add("snake-head");
    snake_body[0].element.classList.remove("snake-head");

    let newSegment_x;
    let newSegment_y;

    if (direction == "UP") {
        newSegment_x = snake_body[0].x;
        newSegment_y = snake_body[0].y - 1;
    }
    else if (direction == "LEFT") {
        newSegment_x = snake_body[0].x - 1;
        newSegment_y = snake_body[0].y;
    }
    else if (direction == "RIGHT") {
        newSegment_x = snake_body[0].x + 1;
        newSegment_y = snake_body[0].y;
    }
    else if (direction == "DOWN") {
        newSegment_x = snake_body[0].x;
        newSegment_y = snake_body[0].y + 1;
    }
    if (newSegment_x < 0) {
        newSegment_x = CANVAS_WIDTH - 1;
    }
    else if (newSegment_x > CANVAS_WIDTH - 1) {
        newSegment_x = 0;
    }
    else if (newSegment_y < 0) {
        newSegment_y = CANVAS_HEIGHT - 1;
    }
    else if (newSegment_y > CANVAS_HEIGHT - 1) {
        newSegment_y = 0;
    }

    canvas.appendChild(newSegment); //добавляем в <div id="canvas">

    snake_body.unshift({
        x: newSegment_x,
        y: newSegment_y, //координаты сегмента хвоста
        element: newSegment, //<div> - сегмент хвоста змейки
    })
}
function appleCrossesSnake() {
    for (let segment of snake_body){
        if (apple_x == segment.x && apple_y == segment.y) return true
    }
    return false;
}