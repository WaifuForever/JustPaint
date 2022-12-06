import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { FaPencilAlt, FaPaintBrush } from 'react-icons/fa';
import { BiRectangle } from 'react-icons/bi';
import { BsCircle, BsFillLayersFill } from 'react-icons/bs';
import { FiMousePointer } from 'react-icons/fi';
import { GiStraightPipe } from 'react-icons/gi';
import { IoIosReturnLeft, IoIosReturnRight } from 'react-icons/io';
import { MdRestartAlt } from 'react-icons/md';

import { useHistory } from '../hooks/UseHistory';
import { drawElement } from '../utils/draw.util';

import Canvas from '../components/Canvas';
import ColourPicker from '../components/ColourPicker';
import Layer from '../components/Layer';
import History from '../components/History';
import Slider from '../components/Slider';
import ToolTab from '../components/ToolTab';
import ToolButton from '../components/ToolButton';

const drawSelection = (element) => {
    const { startPoint, endPoint, width, elementType } = element;

    const newElement = {
        colour: '#3474eb',
        width: 1,
        id: 'default',
        elementType: elementType,
    };

    switch (elementType) {
        case 'rectangle':
            newElement.startPoint = {
                x: startPoint.x - width,
                y: startPoint.y - width,
            };
            newElement.endPoint = {
                x: endPoint.x + width,
                y: endPoint.y + width,
            };
            break;

        case 'ddaLine':
        case 'bresenhamLine':
            newElement.startPoint = {
                x: startPoint.x - width + 0.5,
                y: startPoint.y - 1,
            };
            newElement.endPoint = {
                x: endPoint.x + width - 0.5,
                y: endPoint.y + 1,
            };
            newElement.length = width + 1;
            break;
        case 'brush':
        //console.log('here');
        case 'pencil':
            throw new Error(
                `Not implemented yet: draw ${elementType} selection`
            );
        default:
            throw new Error(`Type not recognised: ${elementType}`);
    }

    return newElement;
};

const DrawScreen = () => {
    const {
        history,
        index,
        state,
        setElements,
        setHistoryAt,
        sliceHistoryAt,
        undo,
        redo,
    } = useHistory([]);
    const { elements, description } = state;
    const [selectedElement, setSelectedElement] = useState(null);

    const [elementType, setElementType] = useState('brush');

    const [displayGrid, setDisplayGrid] = useState(true);

    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const drewElementsRef = useRef(false);
    const drewGridRef = useRef(true);

    const setCanvasRef = (ref) => {
        canvasRef.current = ref;
    };

    const setGridRef = (ref) => {
        gridRef.current = ref;
    };

    const handleSetSelectedElement = (element) => {
        if (element) {
            sessionStorage.setItem(
                'selectedElementId',
                JSON.stringify(element.id)
            );

            sessionStorage.setItem(
                'selectedElementColour',
                JSON.stringify(element.colour)
            );
            sessionStorage.setItem(
                'selectedElementWidth',
                JSON.stringify(element.width)
            );
        }
        setSelectedElement(element);
    };

    useEffect(() => {
        const undoRedoFunction = (event) => {
            if (event.metaKey || event.ctrlKey) {
                if (event.key === 'z') {
                    undo();
                    drewElementsRef.current = false;
                } else if (event.key === 'y') {
                    redo();
                    drewElementsRef.current = false;
                }
            }
        };

        document.addEventListener('keydown', undoRedoFunction);

        return () => {
            document.removeEventListener('keydown', undoRedoFunction);
        };
    }, [undo, redo]);

    useLayoutEffect(() => {
        if (!drewElementsRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.width
            );

            elements.forEach((element) => {
                if (element.id === sessionStorage.getItem('selectedElement')) {
                    drawElement(drawSelection(element), ctx);
                }

                drawElement(element, ctx);
            });
            drewElementsRef.current = true;
        }
        console.log(elements);
    }, [elements]);

    const setLastState = (number) => {
        sliceHistoryAt(number);
        drewElementsRef.current = false;
    };

    const seePreviousState = (number) => {
        setHistoryAt(number);
        drewElementsRef.current = false;
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex flex-col flex-wrap items-center gap-3 ">
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
                            icon={<FaPaintBrush />}
                            selected={elementType === 'brush'}
                            action={() => {
                                setElementType('brush');
                            }}
                        />,

                        <ToolButton
                            icon={<GiStraightPipe />}
                            selected={elementType === 'bresenhamLine'}
                            action={() => {
                                setElementType('bresenhamLine');
                            }}
                        />,
                        <ToolButton
                            icon={<GiStraightPipe />}
                            selected={elementType === 'ddaLine'}
                            action={() => {
                                setElementType('ddaLine');
                            }}
                        />,
                        <ToolButton
                            icon={<BiRectangle />}
                            selected={elementType === 'rectangle'}
                            action={() => {
                                setElementType('rectangle');
                            }}
                        />,
                        <ToolButton
                            icon={<BsCircle />}
                            selected={elementType === 'circle'}
                            action={() => {
                                setElementType('circle');
                            }}
                        />,
                        <ToolButton
                            icon={<FiMousePointer />}
                            selected={elementType === 'select'}
                            action={() => {
                                setElementType('select');
                            }}
                        />,
                        <ToolButton
                            icon={<MdRestartAlt />}
                            action={() => {
                                setElements([], {
                                    description: 'Clear screen',
                                });
                                canvasRef.current
                                    .getContext('2d')
                                    .clearRect(
                                        0,
                                        0,
                                        canvasRef.current.width,
                                        canvasRef.current.width
                                    );
                            }}
                        />,
                        <ToolButton
                            icon={<IoIosReturnLeft />}
                            action={() => {
                                undo();
                                drewElementsRef.current = false;
                            }}
                        />,

                        <ToolButton
                            icon={<IoIosReturnRight />}
                            action={() => {
                                redo();
                                drewElementsRef.current = false;
                            }}
                        />,
                    ]}
                />
                <ToolTab
                    title={'Global Definition'}
                    tools={[
                        <ColourPicker name={'globalColour'} />,
                        <Slider title={'Width:'} name={'globalWidth'} />,
                    ]}
                />
                <ToolTab
                    title={'Element Definition'}
                    tools={[
                        <ColourPicker name={'selectedElementColour'} />,
                        <Slider
                            title={'Width:'}
                            name={'selectedElementWidth'}
                        />,
                    ]}
                />
            </div>
            <Canvas
                canvasRef={canvasRef}
                setCanvasRef={setCanvasRef}
                elements={elements}
                setElements={setElements}
                drewElementsRef={drewElementsRef}
                elementType={elementType}
                displayGrid={displayGrid}
                drewGridRef={drewGridRef}
                gridRef={gridRef}
                setGridRef={setGridRef}
                setSelectedElement={handleSetSelectedElement}
            />

            <div className="flex flex-col gap-2">
                <History
                    currentTitle="History"
                    history={history}
                    historyIndex={index}
                    deleteElement={setLastState}
                    setCurrentElements={seePreviousState}
                />
                <Layer
                    icon={<BsFillLayersFill />}
                    currentTitle="Layer"
                    elements={elements}
                    setElements={setElements}
                    setSelectedElement={handleSetSelectedElement}
                    drewElementsRef={drewElementsRef}
                />
            </div>
        </div>
    );
};

export default DrawScreen;
