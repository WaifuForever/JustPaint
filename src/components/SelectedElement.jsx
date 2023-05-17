import ColourPicker from './ColourPicker';
import Slider from './Slider';
import ToolTab from './ToolTab';

import { updateElement } from '../utils/element.util';

const SelectedElement = ({ elements, setElements, drewElementsRef }) => {
    const updateColour = (colour, element) => {
        element.colour = colour;
        updateElement(element, elements, setElements);
    };

    const updateWidth = (width, element) => {
        element.width = width;
        updateElement(element, elements, setElements);
    };

    return (
        <ToolTab
            title={'Element Definition'}
            tools={[
                <ColourPicker
                    name={'selectedElementColour'}
                    updateElement={updateColour}
                    drewElementsRef={drewElementsRef}
                />,
                <Slider
                    title={'Width:'}
                    name={'selectedElementWidth'}
                    //selectedElement={selectedElement}
                    updateElement={updateWidth}
                    drewElementsRef={drewElementsRef}
                />,
            ]}
        />
    );
};

export default SelectedElement;
