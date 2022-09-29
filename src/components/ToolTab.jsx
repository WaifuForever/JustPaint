import { useState } from 'react';

import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

const ToolTab = ({ title, tools }) => {
    const [isDisplayed, setIsDisplayed] = useState(true);
    return (
        <div className="w-full">
            <div
                className={`flex items-center justify-between rounded w-32 bg-green-600 text-center px-3 py-1`}
                onClick={() => setIsDisplayed(!isDisplayed)}
            >
                <span className="">{title}</span>
                {isDisplayed ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
            </div>
            <div
                className={`flex ${isDisplayed ? '' : 'hidden'} justify-center`}
            >
                {tools.map((Tool, index) => (
                    <div key={index}>{Tool}</div>
                ))}
            </div>
        </div>
    );
};

export default ToolTab;
