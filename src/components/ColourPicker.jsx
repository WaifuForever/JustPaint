import { useState } from 'react';
import Chrome from 'react-color/lib/components/chrome/Chrome';

const ColourPicker = ({ action, currentColour }) => {
    const [colours, setColours] = useState([
        '#000000',
        '#ffffff',
        '#32a852',
        '#3d41a6',
        '#833da6',
        '#bc9fc9',
        '#fff24e',
        '#f25805',
        '#f20065',
        '#f20000',
        '#10f200',
        '#252925',
    ]);
    const [isDisplayed, setIsDisplayed] = useState(false);

    const handleOnChange = (colour, event) => {
        action(colour.hex);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap w-32 justify-center items-center">
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
            </div>
            <div className="w-full flex justify-center items-center">
                <div
                    className="w-8 h-8 border border-black m-0.5"
                    style={{ backgroundColor: currentColour }}
                    onClick={() => setIsDisplayed(!isDisplayed)}
                ></div>
            </div>

            <div className={`flex w-32 ${isDisplayed ? '' : 'hidden'}`}>
                <Chrome
                    color={currentColour}
                    width="100%"
                    onChange={handleOnChange}
                />
            </div>
        </div>
    );
};

export default ColourPicker;
