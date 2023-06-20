import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { FaPencilAlt, FaPaintBrush } from 'react-icons/fa';
import {
    BiRectangle,
    BiFileBlank,
    BiHorizontalCenter,
    BiVerticalCenter,
} from 'react-icons/bi';
import { BsCircle, BsFillLayersFill } from 'react-icons/bs';
import { FiMousePointer } from 'react-icons/fi';
import { GiStraightPipe, GiCrosshair } from 'react-icons/gi';
import { IoIosReturnLeft, IoIosReturnRight } from 'react-icons/io';
import { MdOutlineExpand } from 'react-icons/md';
import { TbOvalVertical, TbRotate2 } from 'react-icons/tb';
import { VscMirror } from 'react-icons/vsc';

import { useHistory } from '../hooks/UseHistory';
import { useSelectedElement } from '../hooks/UseSelectedElement';
import {
    computePointInGrid,
    drawElement,
    undoComputePointInGrid,
} from '../utils/draw.util';

import Canvas from '../components/Canvas';
import ColourPicker from '../components/ColourPicker';
import Layer from '../components/Layer';
import History from '../components/History';
import Slider from '../components/Slider';
import ToolTab from '../components/ToolTab';
import ToolButton from '../components/ToolButton';
import ControlledFigures from '../components/ControlledFigures';
import { updateElement } from '../utils/element.util';
import ShowInfo from '../components/ShowInfo';

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
        ////console.log('here');
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

    const { selectedElement, setSelectedElement, setRedraw, redraw } =
        useSelectedElement(null);

    const { elements, description } = state;

    const [elementType, setElementType] = useState('brush');
    const [freeRoaming, setFreeRoaming] = useState(true);
    const [displayGrid, setDisplayGrid] = useState(false);

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

    useEffect(() => {
        setSelectedElement(elements[elements.length - 1]);

        drewElementsRef.current = false;
        const undoRedoFunction = (event) => {
            if (event.metaKey || event.ctrlKey) {
                if (event.key === 'z') {
                    undo();
                    setRedraw((prevState) => !prevState);
                } else if (event.key === 'y') {
                    redo();
                    setRedraw((prevState) => !prevState);
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
                //if (element.id === sessionStorage.getItem('selectedElement')) {
                //  drawElement(drawSelection(element), ctx);
                //}

                element.coordinates = drawElement(element, ctx);
            });
            drewElementsRef.current = true;
        }
        //console.log(elements);
    }, [elements]);

    const setLastState = (number) => {
        sliceHistoryAt(number);
        console.log('setLastState', elements[elements.length - 1]);
        setSelectedElement(elements[elements.length - 1]);
        drewElementsRef.current = false;
    };

    const updateColour = (colour, element) => {
        element.colour = colour;
        updateElement(
            element,
            elements,
            setElements,
            `Change ${element.elementType} colour`
        );
    };

    const seePreviousState = (number) => {
        setHistoryAt(number);
        console.log('seePreviousState', elements[elements.length - 1]);
        setSelectedElement(elements[elements.length - 1]);
        drewElementsRef.current = false;
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="w-44" style={{ height: '576px' }}>
                <input
                    type="checkbox"
                    onChange={() => setFreeRoaming((prevState) => !prevState)}
                />
                <div
                    className="flex flex-col items-center gap-3 overflow-auto scrollbar-hide"
                    style={{ height: '576px' }}
                >
                    {freeRoaming ? (
                        <div className="flex flex-col flex-wrap items-center gap-3">
                            <ToolTab
                                title={'Tools'}
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
                                        selected={
                                            elementType === 'bresenhamLine'
                                        }
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
                                        icon={<TbOvalVertical />}
                                        selected={elementType === 'ellipse'}
                                        action={() => {
                                            setElementType('ellipse');
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
                                        icon={<BiFileBlank />}
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
                                    <ColourPicker
                                        name={'globalColour'}
                                        selectedElement={selectedElement}
                                    />,
                                    <Slider
                                        title={'Width:'}
                                        name={'globalWidth'}
                                    />,
                                ]}
                            />
                            <ToolTab
                                title={'Element Definition'}
                                tools={[
                                    <ColourPicker
                                        name={'selectedElementColour'}
                                        selectedElement={selectedElement}
                                        updateElement={updateColour}
                                    />,
                                    <Slider
                                        title={'Width:'}
                                        name={'selectedElementWidth'}
                                    />,
                                ]}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col flex-wrap items-center gap-3">
                            <ToolTab
                                title={'Figure'}
                                tools={[
                                    <ToolButton
                                        icon={<GiStraightPipe />}
                                        selected={
                                            elementType === 'bresenhamLine'
                                        }
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
                                        icon={<TbOvalVertical />}
                                        selected={elementType === 'ellipse'}
                                        action={() => {
                                            setElementType('ellipse');
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
                                        icon={<TbRotate2 />}
                                        selected={elementType === 'rotate'}
                                        action={() => {
                                            setElementType('rotate');
                                        }}
                                    />,

                                    <ToolButton
                                        icon={<MdOutlineExpand />}
                                        selected={elementType === 'scale'}
                                        action={() => {
                                            setElementType('scale');
                                        }}
                                    />,
                                    <ToolButton
                                        icon={<GiCrosshair />}
                                        action={() => {
                                            //console.log(displayGrid);
                                            setDisplayGrid(
                                                (prevState) => !prevState
                                            );
                                        }}
                                    />,
                                    <ToolButton
                                        icon={<BiHorizontalCenter />}
                                        action={() => {
                                            const newElement = {
                                                ...selectedElement.current,
                                            };
                                            let startPoint = computePointInGrid(
                                                gridRef,
                                                newElement.startPoint
                                            );
                                            let endPoint = computePointInGrid(
                                                gridRef,
                                                newElement.endPoint
                                            );

                                            newElement.startPoint =
                                                undoComputePointInGrid(
                                                    gridRef,
                                                    {
                                                        x: -startPoint.x,
                                                        y: startPoint.y,
                                                    }
                                                );
                                            newElement.endPoint =
                                                undoComputePointInGrid(
                                                    gridRef,
                                                    {
                                                        x: -endPoint.x,
                                                        y: endPoint.y,
                                                    }
                                                );

                                            updateElement(
                                                newElement,
                                                elements,
                                                setElements,
                                                'Reflect on X',
                                                false
                                            );
                                        }}
                                    />,
                                    <ToolButton
                                        icon={<BiVerticalCenter />}
                                        action={() => {
                                            const newElement = {
                                                ...selectedElement.current,
                                            };
                                            let startPoint = computePointInGrid(
                                                gridRef,
                                                newElement.startPoint
                                            );
                                            let endPoint = computePointInGrid(
                                                gridRef,
                                                newElement.endPoint
                                            );

                                            newElement.startPoint =
                                                undoComputePointInGrid(
                                                    gridRef,
                                                    {
                                                        x: startPoint.x,
                                                        y: -startPoint.y,
                                                    }
                                                );
                                            newElement.endPoint =
                                                undoComputePointInGrid(
                                                    gridRef,
                                                    {
                                                        x: endPoint.x,
                                                        y: -endPoint.y,
                                                    }
                                                );

                                            updateElement(
                                                newElement,
                                                elements,
                                                setElements,
                                                'Reflect on Y',
                                                false
                                            );
                                        }}
                                    />,
                                    <ToolButton
                                        icon={<VscMirror />}
                                        selected={elementType === 'reflection'}
                                        action={() => {
                                            setElementType('reflection');
                                        }}
                                    />,
                                    <ToolButton
                                        icon={<BiFileBlank />}
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

                            <ControlledFigures
                                elementType={elementType}
                                elements={elements}
                                setElements={setElements}
                                gridRef={gridRef}
                                setRedraw={setRedraw}
                                selectedElement={selectedElement}
                                setSelectedElement={setSelectedElement}
                                drewElementsRef={drewElementsRef}
                            />
                            <ToolTab
                                title={'Global Definition'}
                                tools={[
                                    <ColourPicker name={'globalColour'} />,
                                    <Slider
                                        title={'Width:'}
                                        name={'globalWidth'}
                                    />,
                                ]}
                            />
                        </div>
                    )}
                    <ShowInfo
                        selectedElement={selectedElement}
                        redraw={redraw}
                    />
                </div>
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
                setRedraw={setRedraw}
                setGridRef={setGridRef}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
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
                    setRedraw={setRedraw}
                    elements={elements}
                    setElements={setElements}
                    setSelectedElement={setSelectedElement}
                    drewElementsRef={drewElementsRef}
                />
            </div>
        </div>
    );
};

export default DrawScreen;
