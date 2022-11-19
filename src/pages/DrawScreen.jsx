import { useLayoutEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import getStroke from 'perfect-freehand';
import { FaPencilAlt, FaPaintBrush } from 'react-icons/fa';
import { BiRectangle } from 'react-icons/bi';
import { BsFillLayersFill } from 'react-icons/bs';
import { FiMousePointer } from 'react-icons/fi';
import { GiStraightPipe } from 'react-icons/gi';

import ToolTab from '../components/ToolTab';
import ToolButton from '../components/ToolButton';
import Layer from '../components/Layer';
import ColourPicker from '../components/ColourPicker';

const createElement = (firstPoint, elementType, width, colour, isVisible) => {
    if (elementType === 'brush' || elementType === 'pencil')
        return {
            id: uuid(),
            points: [firstPoint],
            elementType,
            width,
            colour,
            isVisible,
        };

    return {
        startPoint: firstPoint,
        endPoint: firstPoint,
        elementType,
        width,
        colour,
        id: uuid(),
        isVisible,
    };
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
    let prevPoint = points[0];
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    points.forEach((point) => {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        prevPoint = point;
        putPixel(point, width / 5, colour, ctx);
    });
};

const nearPoint = (startPoint, endPoint, name) => {
    return Math.abs(startPoint.x - endPoint.x) < 5 &&
        Math.abs(startPoint.y - endPoint.y) < 5
        ? name
        : null;
};

const positionWithinElement = (x, y, element) => {
    const { startPoint, endPoint, elementType } = element;

    switch (elementType) {
        case 'rectangle':
            const topLeft = nearPoint({ x, y }, startPoint, 'tl');
            const topRight = nearPoint(
                { x, y },
                { x: endPoint.x, y: startPoint.y },
                'tr'
            );
            const bottomLeft = nearPoint(
                { x, y },
                { x: startPoint.x, y: endPoint.y },
                'bl'
            );
            const bottomRight = nearPoint({ x, y }, endPoint, 'br');
            const insideRect =
                x >= startPoint.x &&
                x <= endPoint.x &&
                y >= startPoint.y &&
                y <= endPoint.y
                    ? 'inside'
                    : null;

            return (
                topLeft || insideRect || topRight || bottomLeft || bottomRight
            );

        case 'ddaLine':
        case 'bresenhamLine':
            const p = { x, y };
            const offset =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));

            const start = nearPoint({ x, y }, startPoint, 'start');
            const end = nearPoint({ x, y }, endPoint, 'end');
            const insideLine = Math.abs(offset) < 1 ? 'inside' : null;
            return start || end || insideLine;
        case 'pencil':

        case 'brush':
            break;
        default:
            const p2 = { x, y };
            const offset2 =
                distance(startPoint, endPoint) -
                (distance(startPoint, p2) + distance(endPoint, p2));
            return Math.abs(offset2) < 1;
    }
};

const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(x, y, element),
        }))
        .find((element) => element.position !== null);
};

const putPixel = (point, width, colour, ctx) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, 2 * Math.PI, true);
    ctx.fillStyle = colour;
    ctx.fill();

    ctx.closePath();
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
        let e2 = 2 * err;

        if (e2 > -dy) {
            err -= dy;
            startPoint.x += sx;
        }
        if (e2 < dx) {
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
            context.beginPath();
            context.lineWidth = width;
            context.strokeStyle = colour;
            context.strokeRect(
                startPoint.x,
                startPoint.y,
                endPoint.x - startPoint.x,
                endPoint.y - startPoint.y
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
            context.strokeStyle = element.colour;
            context.stroke();

            break;
        case 'brush':
            const brushStroke = getSvgPathFromStroke(
                getStroke(element.points, { size: element.width })
            );
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

const adjustElementCoordinates = (element) => {
    const { elementType, startPoint, endPoint } = element;
    switch (elementType) {
        case 'parallelogram':
        case 'rectangle':
            const minX = Math.min(startPoint.x, endPoint.x);
            const maxX = Math.max(startPoint.x, endPoint.x);
            const minY = Math.min(startPoint.y, endPoint.y);
            const maxY = Math.max(startPoint.y, endPoint.y);

            return {
                startPoint: { x: minX, y: minY },
                endPoint: { x: maxX, y: maxY },
            };
        case 'bresenhamLine':
            if (
                startPoint.x < endPoint.x ||
                (startPoint.x === endPoint.x && startPoint.y < endPoint.y)
            ) {
                return { startPoint, endPoint };
            } else {
                return {
                    startPoint: { ...endPoint },
                    endPoint: { ...startPoint },
                };
            }
        default:
            throw new Error(`Type not recognised: ${elementType}`);
    }
};

const drawSelection = (element) => {
    const { startPoint, endPoint, width, elementType } = element;

    const newElement = {
        colour: '#3474eb',
        width: 1,
        id: 'default',
        elementType: elementType,
    };

    switch (elementType) {
        case 'rectangle':
            newElement.startPoint = {
                x: startPoint.x - width,
                y: startPoint.y - width,
            };
            newElement.endPoint = {
                x: endPoint.x + width,
                y: endPoint.y + width,
            };
            break;

        case 'ddaLine':
        case 'bresenhamLine':
            newElement.startPoint = {
                x: startPoint.x - width + 0.5,
                y: startPoint.y - 1,
            };
            newElement.endPoint = {
                x: endPoint.x + width - 0.5,
                y: endPoint.y + 1,
            };
            newElement.length = width + 1;
            break;
        case 'brush':
            console.log('here');
        case 'pencil':
            throw new Error(
                `Not implemented yet: draw ${elementType} selection`
            );
        default:
            throw new Error(`Type not recognised: ${elementType}`);
    }

    return newElement;
};

const cursorForPosition = (position) => {
    let positions = ['tl', 'br', 'start', 'end', 'tr', 'bl'];
    return positions.includes(position) ? 'nesw-resize' : 'move';
};

const computePointInCanvas = (canvasRef, clientX, clientY) => {
    if (!canvasRef.current) {
        return null;
    }
    const boundingRect = canvasRef.current.getBoundingClientRect();

    return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
    };
};

const DrawScreen = () => {
    const [lastElement, setLastElement] = useState(null);
    const [elements, setElements] = useState([]);
    const [elementType, setElementType] = useState('brush');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [displayCanvas, setDisplayCanvas] = useState(true);
    const [colour, setColour] = useState('#000000');

    const canvasRef = useRef(null);
    const drewElementsRef = useRef(false);

    const setCanvasRef = (ref) => {
        canvasRef.current = ref;
    };

    useLayoutEffect(() => {
        if (!drewElementsRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.width
            );

            elements.forEach((element) => {
                if (selectedElement) {
                    if (element.id === selectedElement.id) {
                        drawElement(drawSelection(element), ctx);
                    }
                }

                drawElement(element, ctx);
            });
            drewElementsRef.current = true;
        }
    }, [elements, selectedElement]);

    const updateElement = (element) => {
        const elementsCopy = [...elements];

        elementsCopy[elementsCopy.findIndex((e) => e.id === element.id)] =
            element;
        setElements(elementsCopy);
    };

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;
        setIsDrawing(true);
        const point = computePointInCanvas(canvasRef, clientX, clientY);

        if (elementType === 'select') {
            const element = getElementAtPosition(point.x, point.y, elements);

            if (!element) return;

            const offset = element.points
                ? { ...point }
                : {
                      x: point.x - element.startPoint.x,
                      y: point.y - element.startPoint.y,
                  };
            setLastElement(element);
            setSelectedElement({
                ...element,
                offset,
            });
        } else {
            const element = createElement(point, elementType, 2, colour, true);

            drewElementsRef.current = false;
            setLastElement(element);
            setElements((prevState) => [...prevState, element]);
        }
    };

    const handleMouseMove = (event) => {
        if (!isDrawing) {
            event.target.style.cursor = 'default';

            return;
        }
        const { clientX, clientY } = event;
        const index = elements.length - 1;
        const point = computePointInCanvas(canvasRef, clientX, clientY);

        if (elementType === 'select') {
            const element = getElementAtPosition(point.x, point.y, elements);

            event.target.style.cursor = element
                ? cursorForPosition(element.position)
                : 'default';

            if (!selectedElement) return;
            if (selectedElement.points) {
                const {
                    points,
                    width,
                    colour,
                    id,
                    offset,
                    elementType,
                    isVisible,
                } = selectedElement;

                updateElement({
                    points: points.map((item) => {
                        return { x: item.x - offset.x, y: item.y - offset.y };
                    }),
                    elementType,
                    width,
                    colour,
                    isVisible,
                    id,
                });
            } else {
                const {
                    startPoint,
                    endPoint,
                    width,
                    colour,
                    id,
                    elementType,
                    isVisible,
                    offset,
                } = selectedElement;

                const correctedPosition = {
                    x: point.x - offset.x,
                    y: point.y - offset.y,
                };

                updateElement({
                    startPoint: {
                        x: correctedPosition.x,
                        y: correctedPosition.y,
                    },
                    endPoint: {
                        x: correctedPosition.x + endPoint.x - startPoint.x,
                        y: correctedPosition.y + endPoint.y - startPoint.y,
                    },
                    elementType,
                    isVisible,
                    width,
                    colour,
                    id,
                });
            }
        } else {
            if (elements[index].points) {
                updateElement({
                    points: [...elements[index].points, point],
                    elementType: elementType,
                    width: 2,
                    colour,
                    isVisible: elements[index].isVisible,
                    id: elements[index].id,
                });
            } else
                updateElement({
                    startPoint: elements[index].startPoint,
                    endPoint: point,
                    elementType: elementType,
                    width: 2,
                    colour,
                    isVisible: elements[index].isVisible,
                    id: elements[index].id,
                });
        }
        drewElementsRef.current = false;
    };
    console.log('mounted');
    console.log(elements);

    const handleMouseUp = (event) => {
        setSelectedElement(null);
        setIsDrawing(false);
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex flex-col flex-wrap items-center gap-3 ">
                <ToolTab
                    title={'Title'}
                    tools={[
                        <ToolButton
                            icon={<FaPencilAlt />}
                            selected={elementType === 'pencil'}
                            action={() => {
                                setElementType('pencil');
                            }}
                        />,
                        <ToolButton
                            icon={<FaPaintBrush />}
                            selected={elementType === 'brush'}
                            action={() => {
                                setElementType('brush');
                            }}
                        />,
                        <ToolButton
                            icon={<GiStraightPipe />}
                            selected={elementType === 'bresenhamLine'}
                            action={() => {
                                setElementType('bresenhamLine');
                            }}
                        />,
                        <ToolButton
                            icon={<GiStraightPipe />}
                            selected={elementType === 'ddaLine'}
                            action={() => {
                                setElementType('ddaLine');
                            }}
                        />,
                        <ToolButton
                            icon={<BiRectangle />}
                            selected={elementType === 'rectangle'}
                            action={() => {
                                setElementType('rectangle');
                            }}
                        />,
                        <ToolButton
                            icon={<FiMousePointer />}
                            selected={elementType === 'select'}
                            action={() => {
                                setElementType('select');
                            }}
                        />,
                    ]}
                />
                <ToolTab
                    title={'Colours'}
                    tools={[
                        <ColourPicker
                            action={setColour}
                            currentColour={colour}
                        />,
                    ]}
                />
            </div>
            <div className="mx-4 overflow-y-auto">
                <canvas
                    className={`${
                        displayCanvas ? '' : 'hidden'
                    } border border-black object-contain`}
                    width={'768px'}
                    height={'576px'}
                    ref={setCanvasRef}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                ></canvas>
            </div>

            <div className="flex flex-col">
                <Layer
                    icon={<BsFillLayersFill />}
                    currentTitle="History"
                    elements={elements}
                    selectedElement={
                        elementType === 'select' && selectedElement
                            ? selectedElement
                            : lastElement
                    }
                    setElements={setElements}
                    drewElements={drewElementsRef}
                />
            </div>
        </div>
    );
};

export default DrawScreen;
