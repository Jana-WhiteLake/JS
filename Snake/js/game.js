let snake = document.getElementsByClassName("snake-head")[0];
let body = document.getElementById("body");
let apple = document.getElementById("apple");
let canvas = document.getElementById("canvas");
let score_div = document.getElementById("score");

body.addEventListener("keypress", callback);

setInterval(gameCycle, 150)

let score = 0;
let appleFlag = false;
let snake_body = [{
    x: 0,
    y: 0,
    element: snake,
}
];

let direction;

let apple_x = Math.floor(Math.random() * 20) * 16;
let apple_y = Math.floor(Math.random() * 25) * 16;

apple.style.top = apple_y + "px";
apple.style.left = apple_x + "px";

// слушатель клавиатуры передаёт в эту функцию нажатую кнопку
function callback(event) {
    console.log(event);
    if (event.key == "w") {
        direction = "UP"
    }
    else if (event.key == "a") {
        direction = "LEFT"
    }
    else if (event.key == "d") {
        direction = "RIGHT"
    }
    else if (event.key == "s") {
        direction = "DOWN"
    }
}

function moveFunction() {
    if (appleFlag == true) {
        appleFlag = false;
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
        snake_body[0].y -= 16;
    }
    else if (direction == "LEFT") {
        snake_body[0].x -= 16;
    }
    else if (direction == "RIGHT") {
        snake_body[0].x += 16;
    }
    else if (direction == "DOWN") {
        snake_body[0].y += 16;
    }
    if (snake_body[0].x < 0) {
        snake_body[0].x = 304;
    }
    else if (snake_body[0].x > 304) {
        snake_body[0].x = 0;
    }
    else if (snake_body[0].y < 0) {
        snake_body[0].y = 384;
    }
    else if (snake_body[0].y > 384) {
        snake_body[0].y = 0;
    }
}

function gameCycle() {
    moveFunction();
    logicFunction();
    drawFunction();
}

function logicFunction() {
    if (apple_x == snake_body[0].x && apple_y == snake_body[0].y) {
        apple_x = Math.floor(Math.random() * 20) * 16;
        apple_y = Math.floor(Math.random() * 25) * 16;

        appleFlag = true;

        score++;
        score_div.innerHTML = "Score: " + score;
    }
}

function drawFunction() {
    apple.style.top = apple_y + "px";
    apple.style.left = apple_x + "px";
    for (let segment of snake_body) {
        segment.element.style.top = segment.y + "px"; //отрисовывает позицию сегмента змейки
        segment.element.style.left = segment.x + "px";
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
        newSegment_y = snake_body[0].y - 16;
    }
    else if (direction == "LEFT") {
        newSegment_x = snake_body[0].x - 16;
        newSegment_y = snake_body[0].y;
    }
    else if (direction == "RIGHT") {
        newSegment_x = snake_body[0].x + 16;
        newSegment_y = snake_body[0].y;
    }
    else if (direction == "DOWN") {
        newSegment_x = snake_body[0].x;
        newSegment_y = snake_body[0].y + 16;
    }
    if (newSegment_x < 0) {
        newSegment_x = 304;
    }
    else if (newSegment_x > 304) {
        newSegment_x = 0;
    }
    else if (newSegment_y < 0) {
        newSegment_y = 384;
    }
    else if (newSegment_y > 384) {
        newSegment_y = 0;
    }

    canvas.appendChild(newSegment); //добавляем в <div id="canvas">

    snake_body.unshift({
        x: newSegment_x,
        y: newSegment_y, //координаты сегмента хвоста
        element: newSegment, //<div> - сегмент хвоста змейки
    })
}