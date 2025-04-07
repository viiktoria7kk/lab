// Отримання елементів DOM
const canvas = document.getElementById('trajectoryCanvas');
const ctx = canvas.getContext('2d');
const drawButton = document.getElementById('draw');
const clearButton = document.getElementById('clear');

// Константи для масштабування
const SCALE = 2; // Масштаб для кращої видимості
const POINT_RADIUS = 4;
const TIME_STEP = 0.1;
const MAX_TIME = 10;

// Функція для переведення градусів в радіани
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Функція для обчислення координат точки в момент часу t
function calculatePosition(x0, y0, v0, angle, a, t) {
    const alpha = degreesToRadians(angle);
    const x = x0 + v0 * Math.cos(alpha) * t + 0.5 * a * Math.cos(alpha) * t * t;
    const y = y0 + v0 * Math.sin(alpha) * t + 0.5 * a * Math.sin(alpha) * t * t;
    return { x, y };
}

// Функція для масштабування координат
function scaleCoordinates(x, y) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    return {
        x: centerX + x * SCALE,
        y: centerY - y * SCALE // Інвертуємо Y для правильного відображення
    };
}

// Функція для малювання осей координат
function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // Вісь X
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);

    // Вісь Y
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);

    ctx.stroke();
}

// Функція для малювання траєкторії
function drawTrajectory() {
    // Очищення canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();

    // Отримання значень з форми
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const v0 = parseFloat(document.getElementById('v0').value);
    const a = parseFloat(document.getElementById('acceleration').value);
    const color = document.getElementById('color').value;

    // Налаштування стилю лінії
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Малювання траєкторії
    for (let t = 0; t <= MAX_TIME; t += TIME_STEP) {
        const pos = calculatePosition(x0, y0, v0, angle, a, t);
        const scaledPos = scaleCoordinates(pos.x, pos.y);

        if (t === 0) {
            ctx.moveTo(scaledPos.x, scaledPos.y);
        } else {
            ctx.lineTo(scaledPos.x, scaledPos.y);
        }
    }

    ctx.stroke();

    // Малювання початкової точки
    const startPos = scaleCoordinates(x0, y0);
    ctx.beginPath();
    ctx.arc(startPos.x, startPos.y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

// Обробники подій
drawButton.addEventListener('click', drawTrajectory);
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
});

// Початкове малювання осей
drawAxes(); 