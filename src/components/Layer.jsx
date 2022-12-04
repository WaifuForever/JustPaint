import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { BsFillTrash2Fill } from 'react-icons/bs';

import EditableTitle from './EditableTitle';

const Item = ({
    elementId,
    elementType,
    isActive,
    selectedId,
    deleteElement,
    hideElement
}) => {
    return (
        <div
            className={`${
                selectedId === elementId
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-300 hover:bg-blue-500'
            } flex w-32 items-center justify-between gap-3 border-t-2 p-2 rounded`}
        >
            <div
                className="cursor-pointer text-sm border"
                onClick={() => hideElement(elementId)}
            >
                {isActive ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </div>

            <EditableTitle currentTitle={elementType} />

            <div
                className="cursor-pointer"
                onClick={() => deleteElement(elementId)}
            >
                <BsFillTrash2Fill />
            </div>
        </div>
    );
};

const Layer = ({
    icon,
    currentTitle,
    elements,
    selectedElement,
    deleteElement,
    hideElement,
    setElements,
    drewElementsRef
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
                    return (
                        <Item
                            key={index + index}
                            index={index}
                            elementId={element.id}
                            selectedId={selectedElement.id}
                            elementType={element.elementType}
                            isActive={element.isVisible}
                            deleteElement={deleteElement}
                            hideElement={() => hideElement(element.id, elements, setElements, drewElementsRef)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Layer;
