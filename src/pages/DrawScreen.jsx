import { useLayoutEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FaPencilAlt } from 'react-icons/fa';
import { BiRectangle } from 'react-icons/bi';
import { BsFillLayersFill } from 'react-icons/bs';
import { GiStraightPipe } from 'react-icons/gi';

import ToolTab from '../components/ToolTab';
import ToolButton from '../components/ToolButton';
import Layer from '../components/Layer';
import ColourPicker from '../components/ColourPicker';

const createElement = (startPoint, endPoint, elementType, width, colour) => {
    let id = uuid();
    return { startPoint, endPoint, elementType, width, colour, id };
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
        console.log(elements);
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

    const handleMouseDown = (event) => {
        setIsDrawing(true);

        const point = computePointInCanvas(
            event.clientX,
            event.clientY,
            canvasRef.current
        );

        const element = createElement(point, point, elementType, 2, colour);

        setElements((prevState) => [...prevState, element]);
    };

    const handleMouseMove = (event) => {
        if (!isDrawing) return;

        const index = elements.length - 1;

        const point = computePointInCanvas(
            event.clientX,
            event.clientY,
            canvasRef.current
        );

        const updatedElement = createElement(
            elements[index].startPoint,
            point,
            elementType,
            2,
            colour
        );

        const elementsCopy = [...elements];
        elementsCopy[index] = updatedElement;
        setElements(elementsCopy);
        drewElementsRef.current = false;
    };

    const handleMouseUp = (event) => {
        setIsDrawing(false);
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex flex-col items-center gap-3 ">
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
