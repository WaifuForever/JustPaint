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

const isWithinElement = (x, y, element) => {
    const { startPoint, endPoint, elementType } = element;

    switch (elementType) {
        case 'rectangle':
            const minX = Math.min(startPoint.x, endPoint.x);
            const maxX = Math.max(startPoint.x, endPoint.x);
            const minY = Math.min(startPoint.y, endPoint.y);
            const maxY = Math.max(startPoint.y, endPoint.y);

            return x >= minX && x <= maxX && y >= minY && y <= maxY;

        case 'straightLine':
            const p = { x, y };
            const offset =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));
            return Math.abs(offset) < 1;

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
    console.log(elements.find((element) => isWithinElement(x, y, element)));
    return elements.find((element) => isWithinElement(x, y, element));
};

const drawElement = (element, context) => {
    switch (element.elementType) {
        case 'rectangle':
            context.beginPath();
            context.lineWidth = element.width;
            context.strokeStyle = element.colour;
            context.moveTo(element.startPoint.x, element.startPoint.y);
            context.lineTo(element.endPoint.x, element.startPoint.y);
            context.stroke();
            context.lineTo(element.endPoint.x, element.endPoint.y);
            context.stroke();
            context.lineTo(element.startPoint.x, element.endPoint.y);
            context.stroke();
            context.lineTo(element.startPoint.x, element.startPoint.y);
            context.stroke();
            break;
        case 'straightLine':
            context.beginPath();
            context.lineWidth = element.width;
            context.strokeStyle = element.colour;
            context.moveTo(element.startPoint.x, element.startPoint.y);
            context.lineTo(element.endPoint.x, element.endPoint.y);
            context.stroke();

            break;
        default:
            break;
    }
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
            console.log(elements);
            ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.width
            );

            elements.forEach((element) => {
                drawElement(element, ctx);
            });
            drewElementsRef.current = true;
        }
    }, [elements]);

    const updateElement = (element) => {
        const updatedElement = createElement(
            element.startPoint,
            element.endPoint,
            element.elementType,
            element.width,
            element.colour,
            element.id
        );
        console.log(updatedElement);
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
            event.target.style.cursor = getElementAtPosition(
                point.x,
                point.y,
                elements
            )
                ? 'move'
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
                    } border border-black`}
                    width={768}
                    height={576}
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
