import { useRef } from 'react';

export const useOnDraw = (onDraw) => {
    const canvasRef = useRef(null);

    const isDrawingRef = useRef(false);

    const setCanvasRef = (ref) => {
        if (!ref) return;
        canvasRef.current = ref;
        initMouveMoveListener();
        initMouseDownListener();
        initMouseUpListener();
        return canvasRef;
    };

    const initMouveMoveListener = () => {
        const listener = (e) => {
            if (!isDrawingRef.current) return;
            const point = computePointInCanvas(e.clientX, e.clientY);
            const ctx = canvasRef.current.getContext('2d');
            if (onDraw) onDraw(ctx, point);
            //console.log({ x: point.x, y: point.y });
        };

        window.addEventListener('mousemove', listener);
    };

    const initMouseDownListener = () => {
        if (!canvasRef.current) return;
        const listener = () => {
            isDrawingRef.current = true;
        };

        canvasRef.current.addEventListener('mousedown', listener);
    };

    const initMouseUpListener = () => {
        if (!canvasRef.current) return;
        const listener = () => {
            isDrawingRef.current = false;
        };

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
