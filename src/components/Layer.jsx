import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { BsFillTrash2Fill } from 'react-icons/bs';

import EditableTitle from './EditableTitle';

import { hideElement, deleteElement } from '../utils/element.util';

const Item = ({
    elementId,
    elementType,
    elementCoordinates,
    isActive,
    setSelectedElement,
    deleteElement,
    hideElement,
}) => {
    const selectedId = sessionStorage.getItem('selectedElementId');
    const [showInfo, setShowInfo] = useState(false);
    function handleRightClick(event) {
        event.preventDefault();
        console.log('right click event');
        setShowInfo(true);
    }

    const temp = () => {
        if (!elementCoordinates) return [];
        const coordinatesArray = Array.from(elementCoordinates).map((str) =>
            JSON.parse(str)
        );
        //console.log(coordinatesArray);
        return coordinatesArray;
    };

    return (
        <div
            className={`${
                selectedId.substring(1, selectedId.length - 1) === elementId
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-300 hover:bg-blue-500'
            } flex w-32 items-center justify-between gap-3 border-t-2 p-2 rounded`}
            onClick={setSelectedElement}
            onContextMenu={handleRightClick}
        >
            <div
                className="cursor-pointer text-sm border"
                onClick={() => hideElement(elementId)}
            >
                {isActive ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </div>

            <EditableTitle currentTitle={elementType} />

            <div className="cursor-pointer" onClick={deleteElement}>
                <BsFillTrash2Fill />
            </div>
            {showInfo ? (
                <div className='flex flex-row'>
                    <div className=''></div>
                    <div className="flex flex-row flex-wrap absolute left-1 h-96 w-32 overflow-y-auto bg-gray-200">
                        {temp().map((coordinate) => (
                            <div className="border-y border-gray-700 mx-1 text-xs hover:bg-gray-400">
                                {Math.floor(coordinate.x)},{' '}
                                {Math.floor(coordinate.y)}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const Layer = ({
    icon,
    currentTitle,
    elements,
    setElements,
    setSelectedElement,
    drewElementsRef,
}) => {
    const [collapse, setCollapse] = useState(false);

    return (
        <div className="flex flex-col">
            <div
                className={`flex w-40 items-center justify-center gap-3 bg-blue-300 p-2 rounded`}
                onClick={() => setCollapse(!collapse)}
            >
                <div>{icon}</div>
                <EditableTitle currentTitle={currentTitle} />
            </div>

            <div
                className={`h-64 overflow-auto mx-auto scrollbar-hide  ${
                    collapse ? 'hidden' : ''
                }`}
            >
                {elements.map((element, index) => {
                    //console.log(element);
                    //console.log(element.coordinates);
                    return (
                        <Item
                            key={index + element.id}
                            index={index}
                            elementId={element.id}
                            elementType={element.elementType}
                            elementCoordinates={element.coordinates}
                            setSelectedElement={() =>
                                setSelectedElement(element)
                            }
                            isActive={element.isVisible}
                            deleteElement={() =>
                                deleteElement(
                                    element.id,
                                    elements,
                                    setElements,
                                    drewElementsRef
                                )
                            }
                            hideElement={() =>
                                hideElement(
                                    element.id,
                                    elements,
                                    setElements,
                                    drewElementsRef
                                )
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Layer;
