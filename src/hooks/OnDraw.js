import { useRef } from 'react';

export const useOnDraw = () => {
    const canvasRef = useRef(null);

    const setCanvasRef = (ref) => {
        if (!ref) return;
        canvasRef.current = ref;
        initMouveMoveListener();
        return canvasRef;
    };

    const initMouveMoveListener = () => {
        const mouseMoveListener = (e) => {
            const point = computePointInCanvas(e.clientX, e.clientY);
            console.log({ x: point.x, y: point.y });
        };

        window.addEventListener('mousemove', mouseMoveListener);
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
