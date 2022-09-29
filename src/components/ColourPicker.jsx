import { useState } from 'react';

const ColourPicker = ({ action }) => {
    const [colours, setColours] = useState([
        '#000000',
        '#ffffff',
        '#32a852',
        '#3d41a6',
        '#833da6',
        '#bc9fc9',
        '#f25805',
        '#f20065',
        '#f20000',
        '#10f200',
        '#252925',
    ]);
    const [isDisplayed, setIsDisplayed] = useState(false);

    return (
        <div className="flex">
            <div className="flex flex-wrap w-32 justify-center">
                {colours.map((colour, index) => {
                    return (
                        <div
                            className="w-4 h-4 border border-black m-0.5 cursor-pointer"
                            onClick={() => {
                                console.log(colour);
                                action(colour);
                            }}
                            key={`${index + colour}`}
                            style={{ backgroundColor: colour }}
                        ></div>
                    );
                })}
                <div
                    className="w-4 h-4 border border-black m-0.5 bg-gradient-to-br from-blue-50 to-red-700"
                    onClick={() => setIsDisplayed(!isDisplayed)}
               
                   
                ></div>
            </div>
        </div>
    );
};

export default ColourPicker;
