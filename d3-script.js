// Константи для масштабування
const SCALE = 2;
const TIME_STEP = 0.1;
const MAX_TIME = 10;
const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = 40;

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

// Створення SVG контейнера
const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

// Створення груп для осей та графіка
const g = svg.append('g')
    .attr('transform', `translate(${MARGIN},${HEIGHT - MARGIN})`);

// Функція для малювання осей
function drawAxes() {
    // Очищення попередніх осей
    g.selectAll('.axis').remove();

    // Створення осей
    const xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([-WIDTH/2/SCALE, WIDTH/2/SCALE])
            .range([0, WIDTH - 2*MARGIN]));

    const yAxis = d3.axisLeft()
        .scale(d3.scaleLinear()
            .domain([-HEIGHT/2/SCALE, HEIGHT/2/SCALE])
            .range([HEIGHT - 2*MARGIN, 0]));

    // Додавання осей
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${(HEIGHT - 2*MARGIN)/2})`)
        .call(xAxis);

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${(WIDTH - 2*MARGIN)/2},0)`)
        .call(yAxis);
}

// Функція для малювання траєкторії
function drawTrajectory() {
    // Очищення попередньої траєкторії
    g.selectAll('.trajectory').remove();
    g.selectAll('.point').remove();

    // Отримання значень з форми
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const v0 = parseFloat(document.getElementById('v0').value);
    const a = parseFloat(document.getElementById('acceleration').value);
    const color = document.getElementById('color').value;

    // Створення даних для траєкторії
    const data = [];
    for (let t = 0; t <= MAX_TIME; t += TIME_STEP) {
        data.push(calculatePosition(x0, y0, v0, angle, a, t));
    }

    // Створення лінії
    const line = d3.line()
        .x(d => (WIDTH - 2*MARGIN)/2 + d.x * SCALE)
        .y(d => (HEIGHT - 2*MARGIN)/2 - d.y * SCALE);

    // Малювання траєкторії
    g.append('path')
        .datum(data)
        .attr('class', 'trajectory')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);

    // Малювання початкової точки
    g.append('circle')
        .attr('class', 'point')
        .attr('cx', (WIDTH - 2*MARGIN)/2 + x0 * SCALE)
        .attr('cy', (HEIGHT - 2*MARGIN)/2 - y0 * SCALE)
        .attr('r', 4)
        .attr('fill', color);
}

// Обробники подій
document.getElementById('draw').addEventListener('click', drawTrajectory);
document.getElementById('clear').addEventListener('click', () => {
    g.selectAll('.trajectory').remove();
    g.selectAll('.point').remove();
});

// Початкове малювання осей
drawAxes(); 