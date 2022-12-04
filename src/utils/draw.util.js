import getStroke from 'perfect-freehand';

const putPixel = (point, width, colour, ctx) => {
    console.log(colour, width);

    ctx.fillStyle = colour;

    ctx.fillRect(point.x, point.y, width, width);
};

const putPixel2 = (point, width, colour, ctx) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, width, 0, 2 * Math.PI, true);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath();
};
const average = (a, b) => (a + b) / 2;

const getSvgPathFromStroke = (points, closed = true) => {
    const len = points.length;

    if (len < 4) {
        return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
        2
    )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
        b[1],
        c[1]
    ).toFixed(2)} T`;

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += `${average(a[0], b[0]).toFixed(2)},${average(
            a[1],
            b[1]
        ).toFixed(2)} `;
    }

    if (closed) {
        result += 'Z';
    }

    return result;
};

const strokeArrayPoints = (ctx, element) => {
    const { points, colour, width } = element;
    console.log(element);
    let prevPoint = points[0];
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    points.forEach((point) => {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
        prevPoint = point;
        putPixel(point, width, colour, ctx);
    });
};

const drawCircle = (xc, yc, x, y, width, colour, ctx) => {
    putPixel({ x: xc + x, y: yc + y }, width, colour, ctx);
    putPixel({ x: xc - x, y: yc + y }, width, colour, ctx);
    putPixel({ x: xc + x, y: yc - y }, width, colour, ctx);
    putPixel({ x: xc - x, y: yc - y }, width, colour, ctx);
    putPixel({ x: xc + y, y: yc + x }, width, colour, ctx);
    putPixel({ x: xc - y, y: yc + x }, width, colour, ctx);
    putPixel({ x: xc + y, y: yc - x }, width, colour, ctx);
    putPixel({ x: xc - y, y: yc - x }, width, colour, ctx);
};

const drawElement = (element, context) => {
    const {
        width,
        elementType,
        colour,
        startPoint,
        endPoint,
        length,
        isVisible,
    } = element;

    if (!isVisible) return;

    switch (elementType) {
        case 'rectangle':
            putPixel(endPoint, width, colour, context);

            /*
            context.beginPath();
            context.lineWidth = width;
            context.strokeStyle = colour;
            context.strokeRect(
                startPoint.x,
                startPoint.y,
                endPoint.x - startPoint.x,
                endPoint.y - startPoint.y
            );
            */

            drawBresenhamsLine(
                { ...startPoint },
                { x: endPoint.x, y: startPoint.y },
                width,
                colour,
                context
            );

            drawBresenhamsLine(
                { x: endPoint.x, y: startPoint.y },
                { ...endPoint },
                width,
                colour,
                context
            );

            drawBresenhamsLine(
                { ...endPoint },
                { x: startPoint.x, y: endPoint.y },
                width,
                colour,
                context
            );

            drawBresenhamsLine(
                { x: startPoint.x, y: endPoint.y },
                { ...startPoint },
                width,
                colour,
                context
            );

            break;
        case 'circle':
            putPixel(endPoint, width, colour, context);
            drawBresenhamsCircle(
                { ...startPoint },
                { ...endPoint },
                width,
                colour,
                context
            );
            break;
        case 'bresenhamLine':
            putPixel(endPoint, width, colour, context);
            drawBresenhamsLine(
                { ...startPoint },
                { ...endPoint },
                width,
                colour,
                context
            );

            break;

        case 'ddaLine':
            putPixel(endPoint, width, colour, context);
            drawDdaLine(
                { ...startPoint },
                { ...endPoint },
                width,
                colour,
                context
            );

            break;

        case 'pencil':
            strokeArrayPoints(context, element);
            console.log('pencil');
            console.log(element.colour);
            context.strokeStyle = element.colour;
            context.stroke();

            break;
        case 'brush':
            const brushStroke = getSvgPathFromStroke(
                getStroke(element.points, { size: element.width })
            );
            console.log('brush');
            console.log(element.colour);
            context.fillStyle = element.colour;
            context.fill(new Path2D(brushStroke));

            break;

        case 'parallelogram:':
            putPixel(endPoint, width, colour, context);
            const figureWidth = length
                ? length
                : (endPoint.x - startPoint.x) / 3;
            context.beginPath();
            context.lineWidth = width;
            context.strokeStyle = colour;

            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(startPoint.x + figureWidth, startPoint.y);
            context.stroke();
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
            context.lineTo(endPoint.x - figureWidth, endPoint.y);
            context.stroke();
            context.lineTo(startPoint.x, startPoint.y);
            context.stroke();
            break;

        default:
            throw new Error(`Type not recognised: ${elementType}`);
    }
};

const drawBresenhamsCircle = (startPoint, endPoint, width, colour, ctx) => {
    let x = 0,
        y = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) +
                Math.pow(endPoint.y - startPoint.y, 2)
        ),
        r = y;

    let d = 3 - 2 * r;

    drawCircle(startPoint.x, startPoint.y, 0, r, width, colour, ctx);
    while (y >= x) {
        // for each pixel we will
        // draw all eight pixels

        x++;

        // check for decision parameter
        // and correspondingly
        // update d, x, y
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else d = d + 4 * x + 6;
        drawCircle(startPoint.x, startPoint.y, x, y, width, colour, ctx);
    }
};

const drawBresenhamsLine = (startPoint, endPoint, width, colour, ctx) => {
    let dx = Math.abs(endPoint.x - startPoint.x);
    let dy = Math.abs(endPoint.y - startPoint.y);

    let sy = startPoint.y < endPoint.y ? 1 : -1;
    let sx = startPoint.x < endPoint.x ? 1 : -1;
    let err = dx - dy;

    while (true) {
        putPixel(startPoint, width, colour, ctx);

        if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) break;
        let p = 2 * err;

        if (p > -dy) {
            err -= dy;
            startPoint.x += sx;
        }

        if (p < dx) {
            err += dx;
            startPoint.y += sy;
        }
    }
};

const drawDdaLine = (startPoint, endPoint, width, colour, ctx) => {
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;

    let steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    let xInc = dx / steps;
    let yInc = dy / steps;

    let i = 0;

    while (i < steps) {
        putPixel(startPoint, width, colour, ctx);

        startPoint.x += xInc;
        startPoint.y += yInc;

        i++;
    }
};

export {
    drawElement,
    drawDdaLine,
    drawBresenhamsCircle,
    drawBresenhamsLine,
    putPixel,
};
