import { useLayoutEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FaPencilAlt } from 'react-icons/fa';
import { BiRectangle } from 'react-icons/bi';
import { BsFillLayersFill } from 'react-icons/bs';
import { FiMousePointer } from 'react-icons/fi';
import { GiStraightPipe } from 'react-icons/gi';

import ToolTab from '../components/ToolTab';
import ToolButton from '../components/ToolButton';
import Layer from '../components/Layer';
import ColourPicker from '../components/ColourPicker';

const createElement = (
    startPoint,
    endPoint,
    elementType,
    width,
    colour,
    id
) => {
    id = id ?? uuid();
    return { startPoint, endPoint, elementType, width, colour, id };
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

        case 'straightLine':
            const p = { x, y };
            const offset =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));

            const start = nearPoint({ x, y }, startPoint, 'start');
            const end = nearPoint({ x, y }, endPoint, 'end');
            const insideLine = Math.abs(offset) < 1 ? 'inside' : null;
            return start || end || insideLine;

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
    //console.log(elements.find((element) => positionWithinElement(x, y, element)));
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(x, y, element),
        }))
        .find((element) => element.position !== null);
};

const drawLine = (startPoint, endPoint, width, colour, ctx) => {
    let dx = Math.abs(endPoint.x - startPoint.x);
    let dy = Math.abs(endPoint.y - startPoint.y);
    let p = 2 * dx - dy;

    ctx.beginPath();
    let sy = startPoint.y < endPoint.y ? 1 : -1;
    let sx = startPoint.x < endPoint.x ? 1 : -1;
    let err = dx - dy;
    console.log(startPoint, endPoint);

    while (true) {
        ctx.arc(startPoint.x, startPoint.y, width / 2, 0, 2 * Math.PI, true);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.closePath();

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

const drawElement = (element, context) => {
    const { width, elementType, colour, startPoint, endPoint, length } =
        element;
    /*
        startPoint.x = startPoint.x;
        startPoint.y = startPoint.y;
        endPoint.x = endPoint.x;
        endPoint.y = endPoint.y;
    */
    switch (elementType) {
        case 'rectangle':
            context.beginPath();
            context.lineWidth = width;
            context.strokeStyle = colour;
            context.strokeRect(
                startPoint.x,
                startPoint.y,
                endPoint.x - startPoint.x,
                endPoint.y - startPoint.y
            );
            /*context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, startPoint.y);
            context.stroke();
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
            context.lineTo(startPoint.x, endPoint.y);
            context.stroke();
            context.lineTo(startPoint.x, startPoint.y);
            context.stroke();
            */
            break;
        case 'straightLine':
            let biggerPoint, smallerPointer;
            if (startPoint.x <= endPoint.x) {
                biggerPoint = endPoint;
                smallerPointer = startPoint;
            } else {
                biggerPoint = startPoint;
                smallerPointer = endPoint;
            }
            drawLine(
                { ...startPoint },
                { ...endPoint },
                width,
                colour,
                context
            );

            break;
        case 'parallelogram:':
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
            break;
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
        case 'straightLine':
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
            break;
    }
};

const drawSelection = (element) => {
    const newElement = {
        colour: '#3474eb',
        width: 1,
        id: 'default',
    };

    switch (element.elementType) {
        case 'rectangle':
            newElement.elementType = 'rectangle';
            newElement.startPoint = {
                x: element.startPoint.x - element.width,
                y: element.startPoint.y - element.width,
            };
            newElement.endPoint = {
                x: element.endPoint.x + element.width,
                y: element.endPoint.y + element.width,
            };
            break;
        case 'straightLine':
            newElement.elementType = 'parallelogram:';
            newElement.startPoint = {
                x: element.startPoint.x - element.width + 0.5,
                y: element.startPoint.y - 1,
            };
            newElement.endPoint = {
                x: element.endPoint.x + element.width - 0.5,
                y: element.endPoint.y + 1,
            };
            newElement.length = element.width + 1;
            break;

        default:
            break;
    }
    //console.log(newElement);
    return newElement;
};

const cursorForPosition = (position) => {
    let positions = ['tl', 'br', 'start', 'end', 'tr', 'bl'];
    return positions.includes(position) ? 'nesw-resize' : 'move';
};

const DrawScreen = () => {
    const [elements, setElements] = useState([]);
    const [elementType, setElementType] = useState('rectangle');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [displayCanvas, setDisplayCanvas] = useState(true);
    const [colour, setColour] = useState('#000000');

    const canvasRef = useRef(null);
    const drewElementsRef = useRef(false);

    const computePointInCanvas = (clientX, clientY) => {
        if (!canvasRef.current) {
            return null;
        }
        const boundingRect = canvasRef.current.getBoundingClientRect();

        return {
            x: clientX - boundingRect.left,
            y: clientY - boundingRect.top,
        };
    };

    const setCanvasRef = (ref) => {
        canvasRef.current = ref;
    };

    useLayoutEffect(() => {
        if (!drewElementsRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            //ctx.scale(dpi, dpi);

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
            console.log(elements);
        }
    }, [elements, selectedElement]);

    const updateElement = (element) => {
        const updatedElement = createElement(
            element.startPoint,
            element.endPoint,
            element.elementType,
            element.width,
            element.colour,
            element.id
        );
        //console.log(updatedElement);
        const elementsCopy = [...elements];

        elementsCopy[elementsCopy.findIndex((e) => e.id === element.id)] =
            updatedElement;
        setElements(elementsCopy);
    };

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;
        setIsDrawing(true);
        const point = computePointInCanvas(clientX, clientY, canvasRef.current);
        if (elementType === 'select') {
            const element = getElementAtPosition(point.x, point.y, elements);
            //console.log(element);
            if (!element) return;

            const offsetX = point.x - element.startPoint.x;
            const offsetY = point.y - element.startPoint.y;

            setSelectedElement({
                ...element,
                offset: { x: offsetX, y: offsetY },
            });
        } else {
            const element = createElement(point, point, elementType, 2, colour);

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
        const point = computePointInCanvas(clientX, clientY, canvasRef.current);

        if (elementType === 'select') {
            const element = getElementAtPosition(point.x, point.y, elements);

            event.target.style.cursor = element
                ? cursorForPosition(element.position)
                : 'default';

            if (!selectedElement) return;
            const { startPoint, endPoint, id, offset } = selectedElement;

            const width = endPoint.x - startPoint.x;
            const height = endPoint.y - startPoint.y;

            const correctedPosition = {
                x: point.x - offset.x,
                y: point.y - offset.y,
            };

            updateElement({
                startPoint: { x: correctedPosition.x, y: correctedPosition.y },
                endPoint: {
                    x: correctedPosition.x + width,
                    y: correctedPosition.y + height,
                },
                elementType: selectedElement.elementType,
                width: selectedElement.width,
                colour: selectedElement.colour,
                id,
            });
        } else {
            updateElement({
                startPoint: elements[index].startPoint,
                endPoint: point,
                elementType: elementType,
                width: 2,
                colour,
                id: elements[index].id,
            });
        }
        drewElementsRef.current = false;
    };

    const handleMouseUp = (event) => {
        const lastElement = elements[elements.length - 1];
        const { startPoint, endPoint } = lastElement;

        if (isDrawing) {
            updateElement({
                startPoint,
                endPoint,
                elementType: lastElement.elementType,
                colour: lastElement.colour,
                width: lastElement.width,
                id: lastElement.id,
            });
        }
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
                            icon={<GiStraightPipe />}
                            selected={elementType === 'straightLine'}
                            action={() => {
                                setElementType('straightLine');
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
                    currentTitle="Layer"
                    isShown={displayCanvas}
                    setIsShown={() => setDisplayCanvas(!displayCanvas)}
                    elements={elements}
                    setElements={setElements}
                    drewElements={drewElementsRef}
                />
            </div>
        </div>
    );
};

export default DrawScreen;
