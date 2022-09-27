import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { GiStraightPipe } from 'react-icons/gi';
import ToolButton from '../components/ToolButton';

const DrawScreen = () => {
    const [elements, setElements] = useState([]);
    const [elementType, setElementType] = useState('pencil');
    const onDraw = useCallback((ctx, point, prevPoint) => {
        drawLine(prevPoint, point, ctx, '#000000', 2);
    }, []);

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
                [computePointInCanvas(event.clientX, event.clientY, canvasRef)],
                elementType,
            ],
        ]);
    };

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        elements.forEach((element) => {
            switch (element[1]) {
                case 'pencil':
                    for (let i = 0; i < element[0].length - 1; i++) {
                        onDraw(ctx, element[0][i + 1], element[0][i]);
                    }
                    console.log(
                        element[0][element.length - 1],
                        element[0][element.length - 2]
                    );
                    onDraw(
                        ctx,
                        element[0][element.length - 1],
                        element[0][element.length - 2]
                    );

                    break;

                case 'line':
                    onDraw(ctx, element[0][0], element[0][1]);
                    break;

                default:
                    break;
            }
        });
        const initMouseMoveListener = () => {
            const listener = (e) => {
                if (!isDrawingRef.current || !canvasRef.current) return;

                const currentPoint = computePointInCanvas(
                    e.clientX,
                    e.clientY,
                    canvasRef
                );

                const head = elements.slice(0, elements.length - 1);
                const tail = elements[elements.length - 1];
                console.log(elements);
                switch (elementType) {
                    case 'pencil':
                        tail[0].push(currentPoint);
                        head.push(tail);

                        setElements(head);

                        break;

                    case 'line':
                        if (tail[0].length === 2) tail[0][1] = currentPoint;
                        else tail[0].push([currentPoint]);
                        head.push(tail);

                        setElements(head);

                        if (!prevPointRef.current)
                            prevPointRef.current = currentPoint;

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
    }, [onDraw, elements, elementType]);

    const drawLine = (start, end, ctx, colour, width) => {
        start = start ?? end;
        end = end ?? start;
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
                    }}
                />
                <ToolButton
                    icon={<GiStraightPipe />}
                    action={() => {
                        setElementType('line');
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
