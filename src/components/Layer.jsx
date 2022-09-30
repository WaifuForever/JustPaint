import { useState } from 'react';
import { BiRectangle } from 'react-icons/bi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import { BsFillTrash2Fill } from 'react-icons/bs';
import { GiStraightPipe } from 'react-icons/gi';

const renderIcon = (elementType) => {
    switch (elementType) {
        case 'rectangle':
            return <BiRectangle />;
        case 'straightLine':
            return <GiStraightPipe />;
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
    const [collapse, setCollapse] = useState(true);

    const deleteElement = (id) => {
        let updatedElements = elements.filter((e) => e.id !== id);
        console.log('here');
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
                <div onClick={setIsShown}>
                    {isShown ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                </div>
            </div>
            <div className={`flex flex-col ${collapse ? 'hidden' : ''}`}>
                {elements.map((element, index) => {
                    return (
                        <div
                            key={index + element.id}
                            className="flex w-32 items-center justify-between gap-3 bg-blue-300 p-2 rounded`"
                        >
                            <div>{renderIcon(element.elementType)}</div>
                            <input
                                className="border-0 text-xs w-12 bg-transparent outline-none focus:outline-none"
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                value={element.elementType}
                            />
                            <div onClick={() => deleteElement(element.id)}>
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
