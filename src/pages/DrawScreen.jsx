import { useEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { GiStraightPipe } from 'react-icons/gi';
import ToolButton from '../components/ToolButton';

const DrawScreen = () => {
    const [elements, setElements] = useState([]);
    const [elementType, setElementType] = useState('pencil');
    const onDraw = (ctx, point, prevPoint) => {
        drawLine(prevPoint, point, ctx, '#000000', 2);
    };

    const computePointInCanvas = (clientX, clientY, canvasRef) => {
        if (!canvasRef.current) {
            return null;
        }
        const boundingRect = canvasRef.current.getBoundingClientRect();

        return {
            x: clientX - boundingRect.left,
            y: clientY - boundingRect.top,
        };
    };

    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const prevPointRef = useRef(null);

    const mouseMoveListenerRef = useRef(null);
    //const mouseDownListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    const setCanvasRef = (ref) => {
        canvasRef.current = ref;
    };

    const onCanvasMouseDown = (event) => {
        isDrawingRef.current = true;
        setElements((prevState) => [
            ...prevState,
            [
                computePointInCanvas(event.clientX, event.clientY, canvasRef),
                elementType,
            ],
        ]);
    };

    useEffect(() => {
        const initMouseMoveListener = () => {
            const listener = (e) => {
                if (!isDrawingRef.current || !canvasRef.current) return;
                switch (elementType) {
                    case 'pencil':
                        console.log('pencil');
                        const point = computePointInCanvas(
                            e.clientX,
                            e.clientY,
                            canvasRef
                        );
                        const head = elements.slice(0, elements.length - 1);
                        const tail = elements[elements.length - 1];

                        tail.push(point);
                        head.push(tail);
                        console.log({ tail });
                        setElements(head);

                        const ctx = canvasRef.current.getContext('2d');
                        if (onDraw) onDraw(ctx, point, prevPointRef.current);
                        prevPointRef.current = point;
                        console.log({ elements });
                        break;

                    case 'line':
                        console.log('line');
                        break;

                    default:
                        break;
                }
            };
            mouseMoveListenerRef.current = listener;
            window.addEventListener('mousemove', listener);
        };

        const initMouseUpListener = () => {
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            };
            mouseUpListenerRef.current = listener;
            window.addEventListener('mouseup', listener);
        };

        const removeListeners = () => {
            if (mouseMoveListenerRef.current)
                window.removeEventListener(
                    'mousemove',
                    mouseMoveListenerRef.current
                );
            if (mouseUpListenerRef.current)
                window.removeEventListener(
                    'mouseup',
                    mouseUpListenerRef.current
                );
        };

        initMouseMoveListener();
        initMouseUpListener();
        return () => {
            removeListeners();
        };
    }, [onDraw, elements]);

    const drawLine = (start, end, ctx, colour, width) => {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = colour;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex justify-center items-center ">
                <ToolButton
                    icon={<FaPencilAlt />}
                    action={() => {
                        setElementType('pencil');
                        console.log(elementType);
                    }}
                />
                <ToolButton
                    icon={<GiStraightPipe />}
                    action={() => {
                        setElementType('line');
                        console.log(elementType);
                    }}
                />
            </div>
            <div className="mx-4 overflow-y-auto">
                <canvas
                    className={`bg-red-900 border border-black`}
                    width={768}
                    height={576}
                    ref={setCanvasRef}
                    onMouseDown={onCanvasMouseDown}
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
