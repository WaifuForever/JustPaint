import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

const Layer = ({ icon, currentTitle, isShown, setIsShown }) => {
    const [title, setTitle] = useState(currentTitle);
    return (
        <div
            className={`flex w-40 items-center justify-between gap-3 bg-blue-300 p-2 rounded`}
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
    );
};

export default Layer;
