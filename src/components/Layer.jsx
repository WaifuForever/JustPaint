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
            return <FaPaintBrush/>;
        case 'pencil':
            return <FaPencilAlt />;
        default:
            return <FaPencilAlt />;
    }
};

const Layer = ({
    icon,
    currentTitle,
    isShown,
    setIsShown,
    elements,
    setElements,
    drewElements,
}) => {
    const [title, setTitle] = useState(currentTitle);
    const [collapse, setCollapse] = useState(false);

    const deleteElement = (id) => {
        let updatedElements = elements.filter((e) => e.id !== id);

        setElements(updatedElements);
        drewElements.current = false;
    };

    return (
        <div className="flex flex-col">
            <div
                className={`flex w-40 items-center justify-between gap-3 bg-blue-300 p-2 rounded`}
                onClick={() => setCollapse(!collapse)}
            >
                <div>{icon}</div>
                <input
                    className="border-0 w-12 bg-transparent outline-none focus:outline-none"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title ? title : ''}
                />
                <div className='cursor-pointer' onClick={setIsShown}>
                    {isShown ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                </div>
            </div>
            <div className={`flex flex-col justify-center items-center ${collapse ? 'hidden' : ''}`}>
                {elements.map((element, index) => {
                    return (
                        <div
                            key={index + element.id}
                            className="flex w-32 items-center justify-between gap-3 border-t-2 bg-blue-300 hover:bg-blue-500 p-2 rounded`"
                        >
                            <div className='text-sm border'>{renderIcon(element.elementType)}</div>
                            <input
                                className="border-0 text-xs w-12 bg-transparent outline-none focus:outline-none"
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                value={element.elementType}
                            />
                            <div className='cursor-pointer' onClick={() => deleteElement(element.id)}>
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
