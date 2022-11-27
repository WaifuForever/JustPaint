import { useState, useLayoutEffect, useRef } from 'react';
import { BiRectangle } from 'react-icons/bi';
import { FaPaintBrush, FaPencilAlt } from 'react-icons/fa';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { GiStraightPipe } from 'react-icons/gi';
import { MdHistory } from 'react-icons/md';

import EditableTitle from './EditableTitle';

const RenderIcon = ({ elementType }) => {
    switch (elementType) {
        case 'rectangle':
            return <BiRectangle />;
        case 'ddaLine':
        case 'bresenhamLine':
            return <GiStraightPipe />;
        case 'brush':
            return <FaPaintBrush />;
        case 'pencil':
            return <FaPencilAlt />;
        default:
            return <FaPencilAlt />;
    }
};

const Item = ({
    elementId,
    elementType,
    isSelected,
    deleteElement,
    setCurrentElements,
}) => {
    return (
        <div
            className={`${
                isSelected
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-300 hover:bg-blue-500'
            } flex w-32 items-center justify-between gap-3 border-t-2 p-1 rounded`}
            onClick={() => setCurrentElements(elementId)}
        >
            <div className="cursor-pointer text-sm border">
                <RenderIcon elementType={elementType} />
            </div>
            <span>{elementType}</span>
            
            <div
                className="cursor-pointer"
                onClick={() => deleteElement(elementId)}
            >
                <BsFillTrash2Fill />
            </div>
        </div>
    );
};

const History = ({
    currentTitle,
    elements,
    deleteElement,
    setCurrentElements,
}) => {
    const [collapse, setCollapse] = useState(false);
    const selectedElementRef = useRef(undefined);

    useLayoutEffect(() => {
        if (elements.length > 0)
            selectedElementRef.current = elements[elements.length - 1].id;
    }, [elements]);

    const selectState = (id) => {
        //setCurrentElements(id);

        selectedElementRef.current = elements.find((e) => e.id === id).id;
    };

    return (
        <div className="flex flex-col">
            <div
                className={`flex w-40 items-center justify-center gap-3 bg-blue-300 p-2 rounded`}
                onClick={() => setCollapse(!collapse)}
            >
                <MdHistory />
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
                            key={
                                index + elements[elements.length - 1 - index].id
                            }
                            elementId={elements[elements.length - 1 - index].id}
                            elementType={
                                elements[elements.length - 1 - index]
                                    .elementType
                            }
                            isActive={
                                elements[elements.length - 1 - index].isVisible
                            }
                            isSelected={
                                selectedElementRef.current
                                    ? elements[elements.length - 1 - index]
                                          .id === selectedElementRef.current
                                    : false
                            }
                            deleteElement={deleteElement}
                            setCurrentElements={selectState}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default History;
