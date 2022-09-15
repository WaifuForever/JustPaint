import { useEffect, useRef } from 'react';

export const useOnDraw = (onDraw) => {
    const canvasRef = useRef(null);

    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(null);
    const mouseDownListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    const prevPointRef = useRef(null);

    useEffect(() => {
        return () => {
            if (mouseMoveListenerRef.current)
                window.removeEventListener('mousemove', mouseMoveListenerRef);
            if (mouseUpListenerRef.current)
                window.removeEventListener('mouseup', mouseUpListenerRef);
        };
    }, []);

    const setCanvasRef = (ref) => {
        if (!ref) return;
        if (canvasRef.current)
            canvasRef.current.removeEventListener(
                'mousedown',
                mouseDownListenerRef
            );

        canvasRef.current = ref;
        initMouveMoveListener();
        initMouseDownListener();
        initMouseUpListener();
    };

    const initMouveMoveListener = () => {
        const listener = (e) => {
            if (!isDrawingRef.current) return;
            const point = computePointInCanvas(e.clientX, e.clientY);
            const ctx = canvasRef.current.getContext('2d');
            if (onDraw) onDraw(ctx, point, prevPointRef.current);
            prevPointRef.current = point;
            //console.log({ x: point.x, y: point.y });
        };
        mouseMoveListenerRef.current = listener;

        window.addEventListener('mousemove', listener);
    };

    const initMouseDownListener = () => {
        if (!canvasRef.current) return;
        const listener = () => {
            isDrawingRef.current = true;
        };
        mouseDownListenerRef.current = listener;
        canvasRef.current.addEventListener('mousedown', listener);
    };

    const initMouseUpListener = () => {
        if (!canvasRef.current) return;
        const listener = () => {
            isDrawingRef.current = false;
            prevPointRef.current = null;
        };
        mouseUpListenerRef.current = listener;
        canvasRef.current.addEventListener('mouseup', listener);
    };

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

    return setCanvasRef;
};
