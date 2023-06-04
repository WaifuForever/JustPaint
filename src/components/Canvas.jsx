import { useLayoutEffect, useState } from 'react';

import {
    createElement,
    generateElementWithOffset,
    updateElement,
} from '../utils/element.util';

import { drawAxis } from '../utils/draw.util';

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

    drawAxis({ x: 384, y: 288 }, { x: 768, y: 576 }, ctx);
    /*
    for (let i = 0; i <= height; i += 8) {
        drawBresenhamsLine({ x: 0, y: i }, { x: width, y: i }, 1, colour, ctx);
    }
    for (let i = 0; i <= width; i += 8) {
        drawBresenhamsLine({ x: i, y: 0 }, { x: i, y: height }, 1, colour, ctx);
    }
    */
};

const computePointInGrid = (gridRef, figureX, figureY) => {
    if (!gridRef.current) {
        return null;
    }

    return {
        x: figureX + 384,
        y: 288 - figureY,
    };
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
}) => {
    const [isDrawing, setIsDrawing] = useState(false);

    useLayoutEffect(() => {
        if (displayGrid && drewGridRef.current) {
            drawGrid(gridRef);
            drewGridRef.current = true;
        }
    }, [displayGrid]);

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;
        setIsDrawing(true);
        const point = computePointInCanvas(canvasRef, clientX, clientY);

        drewElementsRef.current = false;
        if (elementType !== 'select') {
            createElement(
                { firstPoint: point, elementType, isVisible: true },
                setElements,
                setSelectedElement
            );
            return;
        }

        //console.log('mouse down');

        if (!selectedElement) {
            if (elements.length > 0) {
                const newElement = generateElementWithOffset(
                    elements[elements.length - 1],
                    point
                );
                setSelectedElement(newElement);

                setElements((prevState) => [...prevState.elements], {
                    description: `Moving ${newElement.elementType}`,
                });
            }

            return;
        }

        setElements((prevState) => [...prevState.elements], {
            description: `Moving ${selectedElement.elementType}`,
        });
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
            /*event.target.style.cursor = selectedElement
                ? cursorForPosition(element.position)
                : 'default';
                */
            //console.log('mouse move');
            //console.log(selectedElement);
            if (!selectedElement) return;
            const {
                startPoint,
                endPoint,
                width,
                colour,
                id,
                points,
                elementType,
                isVisible,
            } = selectedElement;

            updateElement(
                {
                    ...(points
                        ? {
                              points: points.map((item) => {
                                  return {
                                      x: item.x + (item.x - point.x),
                                      y: item.y + (item.y - point.y),
                                  };
                              }),
                          }
                        : {
                              startPoint: {
                                  x: startPoint.x + (startPoint.x - point.x),
                                  y: startPoint.y + (startPoint.y - point.y),
                              },
                              endPoint: {
                                  x: endPoint.x + (endPoint.x - point.x),
                                  y: endPoint.y + (endPoint.y - point.y),
                              },
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
            //const width = sessionStorage.getItem('elementWidth');
            //const colour = sessionStorage.getItem('elementColour');
            ////console.log(width, colour);
            const element = elements[index];
            let temp = element.points
                ? { points: [...element.points, point] }
                : { startPoint: element.startPoint, endPoint: point };
            updateElement(
                {
                    ...temp,
                    elementType: elementType,
                    width: element.width,
                    colour: element.colour,
                    isVisible: element.isVisible,
                    id: element.id,
                },
                elements,
                setElements
            );
        }
        drewElementsRef.current = false;
    };

    const handleMouseUp = (event) => {
        //if (elementType != 'select') setSelectedElement(null);
        //console.log('mouseup');
        //console.log('elements', elements);
        //console.log('lastElement', elements[elements.length - 1]);

        setSelectedElement(elements[elements.length - 1]);
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
