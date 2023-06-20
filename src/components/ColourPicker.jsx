import { useEffect, useState, useRef } from 'react';
import Chrome from 'react-color/lib/components/chrome/Chrome';

const ColourPicker = ({ name, selectedElement, updateElement }) => {
    const [colour, setColour] = useState('#000000');

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
        '#66E4FF',
    ]);
    const [isDisplayed, setIsDisplayed] = useState(false);

    useEffect(() => {
        if (selectedElement) {
            if (selectedElement.current)
                setColour(selectedElement.current.colour);
        }
    }, [selectedElement, name]);

    useEffect(() => {
        // storing input colour
        sessionStorage.setItem(name, JSON.stringify(colour));
    }, [colour, name, selectedElement]);

    const handleOnChange = (colour) => {
        setColour(colour.hex);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap w-32 justify-center items-center">
                {colours.map((colour, index) => {
                    return (
                        <div
                            className="w-4 h-4 border border-black m-0.5 cursor-pointer"
                            onClick={() => {
                                if (updateElement && selectedElement.current) {
                                    updateElement(colour.hex, selectedElement);
                                }
                                setColour(colour);
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
                    style={{ backgroundColor: colour }}
                    onClick={() => setIsDisplayed(!isDisplayed)}
                ></div>
            </div>

            <div className={`flex w-32 ${isDisplayed ? '' : 'hidden'}`}>
                <Chrome color={colour} width="100%" onChange={handleOnChange} />
            </div>
        </div>
    );
};

export default ColourPicker;
