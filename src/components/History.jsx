import { useState, useEffect, useRef } from 'react';
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
    console.log('ITEM');
    console.log(elementId, elementType, isSelected);
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

const History = ({
    currentTitle,
    elements,
    selectedElementId,
    deleteElement,
    setCurrentElements,
}) => {
    const [collapse, setCollapse] = useState(false);
   
    const selectedElementRef = useRef(selectedElementId);


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
                            key={index + element.id}
                            elementId={element.id}
                            elementType={element.elementType}
                            isActive={element.isVisible}
                            isSelected={
                                selectedElementRef.current
                                    ? element.id === selectedElementRef.current
                                    : element.id === selectedElementId
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
