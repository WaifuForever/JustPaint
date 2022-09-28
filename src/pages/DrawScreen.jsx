import { useLayoutEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { BiRectangle } from 'react-icons/bi';
import { GiStraightPipe } from 'react-icons/gi';
import ToolButton from '../components/ToolButton';

const createElement = (startPoint, endPoint, elementType, width, colour) => {
    return { startPoint, endPoint, elementType, width, colour };
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

    const canvasRef = useRef(null);

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
        const ctx = canvasRef.current.getContext('2d');

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.width);

        elements.forEach((element) => {
            drawElement(element, ctx);
        });
    }, [elements]);

    const handleMouseDown = (event) => {
        setIsDrawing(true);

        const point = computePointInCanvas(
            event.clientX,
            event.clientY,
            canvasRef.current
        );

        const element = createElement(point, point, elementType, 2, '#000000');

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
            '#000000'
        );

        const elementsCopy = [...elements];
        elementsCopy[index] = updatedElement;
        setElements(elementsCopy);
    };

    const handleMouseUp = (event) => {
        setIsDrawing(false);
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex justify-center items-center ">
                <ToolButton
                    icon={<FaPencilAlt />}
                    selected={elementType === 'pencil'}
                    action={() => {
                        setElementType('pencil');
                    }}
                />
                <ToolButton
                    icon={<GiStraightPipe />}
                    selected={elementType === 'straightLine'}
                    action={() => {
                        setElementType('straightLine');
                    }}
                />
                <ToolButton
                    icon={<BiRectangle />}
                    selected={elementType === 'rectangle'}
                    action={() => {
                        setElementType('rectangle');
                    }}
                />
            </div>
            <div className="mx-4 overflow-y-auto">
                <canvas
                    className={`bg-red-900 border border-black`}
                    width={768}
                    height={576}
                    ref={setCanvasRef}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                ></canvas>
            </div>

            <div className="flex flex-col">
                <span>layer 1</span>
                <span>layer 2</span>
            </div>
        </div>
    );
};

export default DrawScreen;
