import { useLayoutEffect, useState } from 'react';

import { drawBresenhamsLine } from '../utils/draw.util';
import {
    createElement,
    getElementAtPosition,
    updateElement,
} from '../utils/element.util';

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

const cursorForPosition = (position) => {
    let positions = ['tl', 'br', 'start', 'end', 'tr', 'bl'];
    return positions.includes(position) ? 'nesw-resize' : 'move';
};

const drawGrid = (gridRef) => {
    const width = gridRef.current.width;
    const height = gridRef.current.height;
    const ctx = gridRef.current.getContext('2d');
    const colour = '#AF9D9D';

    for (let i = 0; i <= height; i += 8) {
        drawBresenhamsLine({ x: 0, y: i }, { x: width, y: i }, 1, colour, ctx);
    }
    for (let i = 0; i <= width; i += 8) {
        drawBresenhamsLine({ x: i, y: 0 }, { x: i, y: height }, 1, colour, ctx);
    }
};

const Canvas = ({
    canvasRef,
    setCanvasRef,
    drewElementsRef,
    elements,
    setElements,
    elementType,
    gridRef,
    displayGrid,
    drewGridRef,
    setGridRef,
    selectedElement,
    setSelectedElement,
    setLastElement,
}) => {
    const [isDrawing, setIsDrawing] = useState(false);

    useLayoutEffect(() => {
        if (displayGrid && !drewGridRef.current) {
            drawGrid(gridRef);
            drewGridRef.current = true;
        }
    }, [displayGrid]);

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
            const element = createElement(point, elementType, true);

            drewElementsRef.current = false;
            setLastElement(element);

            setElements((prevState) => [...prevState.elements, element], {
                description: element.elementType,
            });
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

                updateElement(
                    {
                        points: points.map((item) => {
                            return {
                                x: item.x - offset.x,
                                y: item.y - offset.y,
                            };
                        }),
                        elementType,
                        width,
                        colour,
                        isVisible,
                        id,
                    },
                    elements,
                    setElements
                );
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

                updateElement(
                    {
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
                    },
                    elements,
                    setElements
                );
            }
        } else {
            //const width = sessionStorage.getItem('elementWidth');
            //const colour = sessionStorage.getItem('elementColour');
            //console.log(width, colour);

            let temp = elements[index].points
                ? { points: [...elements[index].points, point] }
                : { startPoint: elements[index].startPoint, endPoint: point };

            updateElement(
                {
                    ...temp,
                    elementType: elementType,
                    width: elements[index].width,
                    colour: elements[index].colour,
                    isVisible: elements[index].isVisible,
                    id: elements[index].id,
                },
                elements,
                setElements
            );
        }
        drewElementsRef.current = false;
    };

    const handleMouseUp = (event) => {
        setSelectedElement(null);
        setIsDrawing(false);
    };

    return (
        <div
            className="relative mx-4 overflow-y-auto"
            style={{ width: '768px', height: '576px' }}
        >
            <div className="absolute left-0 top-0">
                <canvas
                    className={`${
                        displayGrid ? '' : 'hidden'
                    } border border-black bg-transparent object-contain`}
                    width={'768px'}
                    height={'576px'}
                    ref={setGridRef}
                ></canvas>
            </div>
            <canvas
                className={
                    'absolute left-0 top-0 border border-black bg-transparent object-contain'
                }
                width={'768px'}
                height={'576px'}
                ref={setCanvasRef}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            ></canvas>
        </div>
    );
};

export default Canvas;
