import { useState } from "react";

const useSessionStorage = (element) => {
    const [currentElement, setCurrentElement] = useState(null);
    if (element) {
        sessionStorage.setItem('selectedElementId', element.id);

        sessionStorage.setItem(
            'selectedElementColour',
            JSON.stringify(element.colour)
        );
        sessionStorage.setItem(
            'selectedElementWidth',
            JSON.stringify(element.width)
        );
        sessionStorage.setItem(
            'selectedElementType',
            element.elementType
        );

        sessionStorage.setItem(
            'selectedElementIsVisible',
            element.isVisible
        );

        sessionStorage.setItem(
            'selectedElementOffset',
            JSON.stringify(element.offset)
        );

        if (element.points) {
            sessionStorage.setItem(
                'selectedElementPoints',
                element.points
            );

            sessionStorage.removeItem('selectedElementStartPoint');

            sessionStorage.removeItem('selectedElementEndPoint');
        } else {
            sessionStorage.setItem(
                'selectedElementStartPoint',
                JSON.stringify(element.startPoint)
            );

            sessionStorage.setItem(
                'selectedElementEndPoint',
                JSON.stringify(element.endPoint)
            );

            sessionStorage.removeItem('selectedElementPoints');
        }
    }
    setCurrentElement(element);
    console.log('setSelectedElement');
    console.log(element);

    return { setCurrentElement }
};

export { useSessionStorage }