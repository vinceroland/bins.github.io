const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let circles = [];
let selectedCircle = null;
let isDragging = false;

canvas.addEventListener('click', function (e) {
    const { x, y } = getMousePos(e);
    const clicked = circles.find(c => isInsideCircle(x, y, c));

    if (clicked) {
        selectedCircle = clicked;
        selectedCircle.color = 'red';
        circles.forEach(c => {
            if (c !== selectedCircle) c.color = 'blue';
        });
    } else {
        circles.forEach(c => c.color = 'blue');
        circles.push({ x, y, r: 20, color: 'blue' });
        selectedCircle = null;
    }
    draw();
});

canvas.addEventListener('mousedown', function (e) {
    const { x, y } = getMousePos(e);
    if (selectedCircle && isInsideCircle(x, y, selectedCircle)) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (isDragging && selectedCircle) {
        const { x, y } = getMousePos(e);
        selectedCircle.x = x;
        selectedCircle.y = y;
        draw();
    }
});

canvas.addEventListener('mouseup', function () {
    isDragging = false;
});

canvas.addEventListener('wheel', function (e) {
    if (selectedCircle) {
        e.preventDefault();
        selectedCircle.r += e.deltaY < 0 ? 2 : -2;
        if (selectedCircle.r < 5) selectedCircle.r = 5;
        draw();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Delete' && selectedCircle) {
        circles = circles.filter(c => c !== selectedCircle);
        selectedCircle = null;
        draw();
    }
});

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function isInsideCircle(x, y, circle) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    return Math.sqrt(dx * dx + dy * dy) < circle.r;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const c of circles) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.stroke();
    }
}