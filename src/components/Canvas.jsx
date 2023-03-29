import { useLayoutEffect, useState } from 'react';

import {
    createElement,
    getElementAtPosition,
    updateElement,
} from '../utils/element.util';

import { drawAxis } from '../utils/draw.util';
import { useSessionStorage } from '../hooks/UseSessionStorage';

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
   
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const { setCurrentElement } = useSessionStorage(null);
    useLayoutEffect(() => {
        if (displayGrid && drewGridRef.current) {
            drawGrid(gridRef);
            drewGridRef.current = true;
        }
    }, [displayGrid, drewGridRef, gridRef]);

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;
        setIsDrawing(true);
        const point = computePointInCanvas(canvasRef, clientX, clientY);

        if (elementType === 'select') {
            const selectedElementPoints = sessionStorage.getItem('selectedElementPoints');
            const selectedElementStartPoint = sessionStorage.getItem('selectedElementStartPoint');
            const selectedElementEndPoint = sessionStorage.getItem('selectedElementEndPoint');
            

            const offset = selectedElementPoints
                ? { ...point }
                : {
                      x: point.x - JSON.parse(selectedElementStartPoint).x,
                      y: point.y - JSON.parse(selectedElementEndPoint).y,
                  };
                  
            /*setSelectedElement({
                ...selectedElement,
                offset,
            });*/
        } else {
            const element = createElement(point, elementType, true);
            console.log('mousedown');
            console.log(element);
            //setSelectedElement(element);
            setCurrentElement(element)
            drewElementsRef.current = false;

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
           
            const selectedElementId = sessionStorage.getItem('selectedElementId');
            if (!selectedElementId) return;
            
            /*event.target.style.cursor = element
                ? cursorForPosition(element.position)
                : 'default';
            */
                    
            const points = sessionStorage.getItem('selectedElementPoints');
            const startPoint = JSON.parse(sessionStorage.getItem('selectedElementStartPoint'));
            const endPoint = JSON.parse(sessionStorage.getItem('selectedElementEndPoint'));
            const width = sessionStorage.getItem('selectedElementWidth');
            const colour = sessionStorage.getItem('colour');
            const elementType = sessionStorage.getItem('selectedElementType');
            const isVisible = sessionStorage.getItem('selectedElementIsVisible');
            const offset = sessionStorage.getItem('selectedElementOffset');
            

            if (points) {
                const updatedPoints = points.map((item) => {
                    return {
                        x: item.x - offset.x,
                        y: item.y - offset.y,
                    };
                });
               
                updateElement(
                    {
                        points: updatedPoints,
                        elementType,
                        width,
                        colour,
                        isVisible,
                        selectedElementId,
                    },
                    elements,
                    setElements
                );
            } else {
                const correctedPosition = {
                    x: point.x - offset.x,
                    y: point.y - offset.y,
                };
                //console.log('pre-update');
                /*console.log({
                    startPoint: {
                        ...correctedPosition,
                    },
                    endPoint: {
                        x: correctedPosition.x + endPoint.x - startPoint.x,
                        y: correctedPosition.y + endPoint.y - startPoint.y,
                    },
                });
                */
                updateElement(
                    {
                        startPoint: {
                            ...correctedPosition,
                        },
                        endPoint: {
                            x: correctedPosition.x + endPoint.x - startPoint.x,
                            y: correctedPosition.y + endPoint.y - startPoint.y,
                        },
                        elementType,
                        isVisible,
                        width,
                        colour,
                        selectedElementId,
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
        //setSelectedElement(null);
      
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
