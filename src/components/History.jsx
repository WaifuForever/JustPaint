import { useState, useLayoutEffect, useRef } from 'react';
import { BiRectangle } from 'react-icons/bi';
import { FaPaintBrush, FaPencilAlt } from 'react-icons/fa';
import { BsCircle, BsFillTrash2Fill } from 'react-icons/bs';
import { GiStraightPipe } from 'react-icons/gi';
import { MdHistory } from 'react-icons/md';

import EditableTitle from './EditableTitle';

const RenderIcon = ({ elementType }) => {
    switch (elementType) {
        case 'rectangle':
            return <BiRectangle />;
        case 'circle':
            return <BsCircle />;
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
    description,
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
            onClick={() => setCurrentElements(description)}
        >
            <div className="cursor-pointer text-sm border">
                <RenderIcon elementType={description} />
            </div>
            <span className="text-xs">{description}</span>

            <div
                className="cursor-pointer"
                onClick={() => deleteElement(description)}
            >
                <BsFillTrash2Fill />
            </div>
        </div>
    );
};

const History = ({
    currentTitle,
    history,
    historyIndex,
    deleteElement,
    setCurrentElements,
}) => {
    const [collapse, setCollapse] = useState(false);

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
                {history.slice(1).map((element, index) => {
                    let currentIndex = history.length - 1 - index;

                    return (
                        <Item
                            key={index + history[currentIndex].description}
                            description={history[currentIndex].description}
                            isSelected={
                                historyIndex
                                    ? currentIndex === historyIndex
                                    : false
                            }
                            deleteElement={() => deleteElement(currentIndex)}
                            setCurrentElements={() =>
                                setCurrentElements(currentIndex)
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default History;
