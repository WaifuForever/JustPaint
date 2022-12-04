import { useEffect, useState } from 'react';

const Slider = ({ title, name }) => {
    const [value, setValue] = useState(1);
    const getBackgroundSize = () => {
        return { backgroundSize: `${value}% 100%` };
    };

    useEffect(() => {
        // storing input width
        sessionStorage.setItem(name, JSON.stringify(value));
    }, [value, name]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs">{value}px</span>
            </div>

            <input
                className="h-2 rounded-md appearance-none bg-gray-500 bg-no-repeat bg-gradient-to-r from-cyan-500 to-blue-500 border border-y-slate-400 border-x-slate-350"
                type="range"
                value={value}
                max={100}
                onChange={(e) => setValue(e.target.valueAsNumber + 1)}
                style={getBackgroundSize()}
            />
        </div>
    );
};

export default Slider;
