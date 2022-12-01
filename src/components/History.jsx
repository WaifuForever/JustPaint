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
    description,
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
            onClick={() => setCurrentElements(description)}
        >
            <div className="cursor-pointer text-sm border">
                <RenderIcon elementType={description} />
            </div>
            <span className='text-xs'>{description}</span>

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
    deleteElement,
    setCurrentElements,
}) => {
    const [collapse, setCollapse] = useState(false);
    const selectedElementRef = useRef(undefined);

    useLayoutEffect(() => {
        if (history.slice(1).length > 0)
            selectedElementRef.current = history[history.length - 1].id;
    }, [history]);

    const selectState = (id) => {
        //setCurrentElements(id);

        selectedElementRef.current = history.find((e) => e.id === id).id;
    };

    //console.log(history);

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
                    return (
                        <Item
                            key={
                                index +
                                history[history.length - 1 - index].description
                            }
                            description={
                                history[history.length - 1 - index].description
                            }
                            elementType={
                                history[history.length - 1 - index].description
                            }
                            isSelected={
                                selectedElementRef.current
                                    ? history[history.length - 1 - index].id ===
                                      selectedElementRef.current
                                    : false
                            }
                            deleteElement={deleteElement}
                            setCurrentElements={() =>
                                setCurrentElements(history.length - 1 - index)
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default History;
