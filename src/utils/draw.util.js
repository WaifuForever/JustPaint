import getStroke from 'perfect-freehand';

const hexToRGBA = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const a = hex.length > 7 ? parseInt(hex.substring(7, 9), 16) : 255;
    return [r, g, b, a];
};

const putPixel2 = (point, width, colour, ctx) => {
    ////console.log(colour, width);

    ctx.fillStyle = colour;

    ctx.roundRect(point.x, point.y, width, width);
};

const putPixel = (point, width, colour, ctx) => {
    const x = point.x - Math.floor(width / 2);
    const y = point.y - Math.floor(width / 2);

    ctx.fillStyle = colour;
    ctx.fillRect(x, y, width, width);
};

const putPixel4 = (point, width, colour, ctx) => {
    const rgbaColor = hexToRGBA(colour);
    const imageData = ctx.createImageData(width, width);
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = rgbaColor[0];
        imageData.data[i + 1] = rgbaColor[1];
        imageData.data[i + 2] = rgbaColor[2];
        imageData.data[i + 3] = rgbaColor[3];
    }
    const x = point.x - Math.floor(width / 2);
    const y = point.y - Math.floor(width / 2);
    ctx.putImageData(imageData, x, y);
};

/*const putPixel5 = (point, width, colour, ctx) => {
    const rgbaColor = hexToRGBA(colour);
    const imageData = ctx.createImageData(width, width);
    imageData.data[0] = rgbaColor[0];
    imageData.data[1] = rgbaColor[1];
    imageData.data[2] = rgbaColor[2];
    imageData.data[3] = rgbaColor[3];
    ctx.putImageData(imageData, point.x, point.y);
};*/

const putPixel6 = (point, width, colour, ctx) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, 2 * Math.PI, true);
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
};

const putPixelStroke = (point, width, colour, ctx) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, 2 * Math.PI, true);

    ctx.strokeStyle = colour;
    ctx.stroke();

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
    ////console.log(element);
    let prevPoint = points[0];
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    points.forEach((point) => {
        putPixel(point, width, colour, ctx);
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = colour;
        ctx.stroke();
        ctx.closePath();
        prevPoint = point;
    });
};

const drawAxis = (origin, canvasSize, context) => {
    drawBresenhamsLine(
        { x: origin.x, y: 0 },
        { x: origin.x, y: canvasSize.y },
        1,
        '#000000',
        context
    );

    drawBresenhamsLine(
        { x: 0, y: origin.y },
        { x: canvasSize.x, y: origin.y },
        1,
        '#000000',
        context
    );
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
    let coordinates = new Set();
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

            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsLine(
                    { ...startPoint },
                    { x: endPoint.x, y: startPoint.y },
                    width,
                    colour,
                    context
                ),
            ]);

            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsLine(
                    { x: endPoint.x, y: startPoint.y },
                    { ...endPoint },
                    width,
                    colour,
                    context
                ),
            ]);

            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsLine(
                    { ...endPoint },
                    { x: startPoint.x, y: endPoint.y },
                    width,
                    colour,
                    context
                ),
            ]);

            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsLine(
                    { x: startPoint.x, y: endPoint.y },
                    { ...startPoint },
                    width,
                    colour,
                    context
                ),
            ]);

            break;
        case 'circle':
            console.log('startPoint', startPoint);
            console.log('endPoint', endPoint);
            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsCircle(
                    { ...startPoint },
                    Math.sqrt(
                        Math.pow(endPoint.x - startPoint.x, 2) +
                            Math.pow(endPoint.y - startPoint.y, 2)
                    ),
                    width,
                    colour,
                    context
                ),
            ]);
            break;
        case 'ellipse':
            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsEllipse(
                    startPoint,
                    {
                        x: Math.abs(startPoint.x - endPoint.x),
                        y: Math.abs(startPoint.y - endPoint.y),
                    },
                    width,
                    colour,
                    context
                ),
            ]);
            break;
        case 'bresenhamLine':
            putPixel(endPoint, width, colour, context);
            coordinates = new Set([
                ...coordinates,
                ...drawBresenhamsLine(
                    { ...startPoint },
                    { ...endPoint },
                    width,
                    colour,
                    context
                ),
            ]);

            break;

        case 'ddaLine':
            putPixel(endPoint, width, colour, context);
            coordinates = new Set([
                ...coordinates,
                ...drawDdaLine(
                    { ...startPoint },
                    { ...endPoint },
                    width,
                    colour,
                    context
                ),
            ]);

            break;

        case 'pencil':
            strokeArrayPoints(context, element);
            ////console.log('pencil');
            ////console.log(element.colour);
            context.strokeStyle = element.colour;
            context.stroke();
            coordinates = new Set(element.points);
            break;
        case 'brush':
            const brushStroke = getSvgPathFromStroke(
                getStroke(element.points, { size: element.width })
            );
            ////console.log('brush');
            ////console.log(element.colour);
            context.fillStyle = element.colour;
            ////console.log(context.fillStyle);
            context.fill(new Path2D(brushStroke));
            coordinates = new Set(element.points);
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
    return coordinates;
};

const drawCircle = (xc, yc, x, y, width, colour, ctx) => {
    const coordinates = [
        { x: xc + x, y: yc + y },
        { x: xc - x, y: yc + y },
        { x: xc + x, y: yc - y },
        { x: xc - x, y: yc - y },
        { x: xc + y, y: yc + x },
        { x: xc - y, y: yc + x },
        { x: xc + y, y: yc - x },
        { x: xc - y, y: yc - x },
    ];

    const setCoordinates = new Set();
    coordinates.forEach((pixel) => {
        putPixel(pixel, width, colour, ctx);

        setCoordinates.add(JSON.stringify(pixel));
    });
    return setCoordinates;
};

const drawBresenhamsCircle = (startPoint, radius, width, colour, ctx) => {
    console.log(typeof radius, radius);
  
    let x = 0,
        y = radius,
        r = y;

    let d = 3 - 2 * r;

    let coordinates = drawCircle(
        startPoint.x,
        startPoint.y,
        0,
        r,
        width,
        colour,
        ctx
    );
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
        coordinates = new Set([
            ...coordinates,
            ...drawCircle(startPoint.x, startPoint.y, x, y, width, colour, ctx),
        ]);
    }
    return coordinates;
};

const drawBresenhamsEllipse = (
    centrePoint,
    radiusPoint,
    width,
    colour,
    ctx
) => {
    const coordinates = new Set();
    const plotPoints = (x, y) => {
        const points = [
            { x: x + centrePoint.x, y: y + centrePoint.y },
            { x: -x + centrePoint.x, y: y + centrePoint.y },
            { x: x + centrePoint.x, y: -y + centrePoint.y },
            { x: -x + centrePoint.x, y: -y + centrePoint.y },
        ];
        points.forEach((point) => {
            coordinates.add(JSON.stringify(point));
            putPixel(point, width, colour, ctx);
        });
    };

    let dx, dy, d1, d2, x, y;
    x = 0;
    y = radiusPoint.y;
    // Initial decision parameter of region 1
    d1 =
        radiusPoint.y * radiusPoint.y -
        radiusPoint.y * radiusPoint.x * radiusPoint.y +
        0.25 * radiusPoint.x * radiusPoint.x;
    dx = 2 * radiusPoint.y * radiusPoint.y * x;
    dy = 2 * radiusPoint.x * radiusPoint.x * y;

    // For region 1
    while (dx < dy) {
        // Print points based on 4-way symmetradiusPoint.y
        plotPoints(x, y);

        // Checking and updating value of
        // decision parameter based on algorithm
        if (d1 < 0) {
            x++;
            dx = dx + 2 * radiusPoint.y * radiusPoint.y;
            d1 = d1 + dx + radiusPoint.y * radiusPoint.y;
        } else {
            x++;
            y--;
            dx = dx + 2 * radiusPoint.y * radiusPoint.y;
            dy = dy - 2 * radiusPoint.x * radiusPoint.x;
            d1 = d1 + dx - dy + radiusPoint.y * radiusPoint.x;
        }
    }

    // Decision parameter of region 2
    d2 =
        radiusPoint.y * radiusPoint.y * ((x + 0.5) * (x + 0.5)) +
        radiusPoint.x * radiusPoint.x * ((y - 1) * (y - 1)) -
        radiusPoint.x * radiusPoint.x * radiusPoint.y * radiusPoint.y;

    // Plotting points of region 2
    while (y >= 0) {
        plotPoints(x, y);

        // Checking and updating parameter
        // value based on algorithm
        if (d2 > 0) {
            y--;
            dy = dy - 2 * radiusPoint.x * radiusPoint.x;
            d2 = d2 + radiusPoint.x * radiusPoint.x - dy;
        } else {
            y--;
            x++;
            dx = dx + 2 * radiusPoint.y * radiusPoint.y;
            dy = dy - 2 * radiusPoint.x * radiusPoint.x;
            d2 = d2 + dx - dy + radiusPoint.x * radiusPoint.x;
        }
    }
    return coordinates;
};

const drawBresenhamsLine = (startPoint, endPoint, width, colour, ctx) => {
    let dx = Math.abs(endPoint.x - startPoint.x);
    let dy = Math.abs(endPoint.y - startPoint.y);

    let sy = startPoint.y < endPoint.y ? 1 : -1;
    let sx = startPoint.x < endPoint.x ? 1 : -1;
    let err = dx - dy;
    const points = new Set();
    while (true) {
        points.add(JSON.stringify(startPoint));
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
    return points;
};

const drawDdaLine = (startPoint, endPoint, width, colour, ctx) => {
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;

    let steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    let xInc = dx / steps;
    let yInc = dy / steps;

    let i = 0;
    let coordinates = new Set();
    while (i < steps) {
        coordinates.add(JSON.stringify(startPoint));
        putPixel(startPoint, width, colour, ctx);

        startPoint.x += xInc;
        startPoint.y += yInc;

        i++;
    }
    return coordinates;
};

export { drawElement, putPixel, drawAxis };
