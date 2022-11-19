import { useState } from 'react';
import { BiRectangle } from 'react-icons/bi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { FaPaintBrush, FaPencilAlt } from 'react-icons/fa';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { GiStraightPipe } from 'react-icons/gi';

const renderIcon = (elementType) => {
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

const Layer = ({
    icon,
    currentTitle,
    elements,
    selectedElement,
    setElements,
    drewElements,
}) => {
    const [title, setTitle] = useState(currentTitle);
    const [editTitle, setEditTitle] = useState(false);
    const [collapse, setCollapse] = useState(false);

    const deleteElement = (id) => {
        let updatedElements = elements.filter((e) => e.id !== id);

        setElements(updatedElements);
        drewElements.current = false;
    };

    const hideElement = (id) => {
        let updatedElements = elements.map((e) => {
            if (e.id === id) e.isVisible = !e.isVisible;
            return e;
        });
        drewElements.current = false;
        setElements(updatedElements);
    };

    return (
        <div className="flex flex-col">
            <div
                className={`flex w-40 items-center justify-center gap-3 bg-blue-300 p-2 rounded`}
                onClick={() => setCollapse(!collapse)}
            >
                <div>{icon}</div>
                {editTitle ? (
                    <input
                        className="border-0 w-12 bg-transparent outline-none focus:outline-none"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setEditTitle(false)}
                        value={title}
                    />
                ) : (
                    <span onDoubleClick={() => setEditTitle(true)}>
                        {title}
                    </span>
                )}
            </div>

            <div
                className={`h-64 overflow-auto mx-auto scrollbar-hide  ${
                    collapse ? 'hidden' : ''
                }`}
            >
                {elements.map((element, index) => {
                    return (
                        <div
                            key={index + element.id}
                            className={`${
                                selectedElement
                                    ? selectedElement.id === element.id
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-blue-300 hover:bg-blue-500'
                                    : 'bg-blue-300 hover:bg-blue-500'
                            } flex w-32 items-center justify-between gap-3 border-t-2 p-2 rounded`}
                        >
                            <div
                                className="cursor-pointer text-sm border"
                                onClick={() => hideElement(element.id)}
                            >
                                {element.isVisible ? (
                                    <BsFillEyeFill />
                                ) : (
                                    <BsFillEyeSlashFill />
                                )}
                            </div>

                            <input
                                className="border-0 text-xs w-12 bg-transparent outline-none focus:outline-none"
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                value={element.elementType}
                            />
                            <div
                                className="cursor-pointer"
                                onClick={() => deleteElement(element.id)}
                            >
                                <BsFillTrash2Fill />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Layer;
