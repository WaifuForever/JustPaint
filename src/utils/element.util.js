import { v4 as uuid } from 'uuid';

const trimString = (str) => {
    str = str
        ? str.length > 2
            ? str.substring(1, str.length - 1)
            : str
        : null;
    return str;
};

const createElement = (firstPoint, elementType, isVisible) => {
    let colour = sessionStorage.getItem('globalColour');
    let width = sessionStorage.getItem('globalWidth');

    colour = trimString(colour);
    width = trimString(width);

    if (elementType === 'brush' || elementType === 'pencil')
        return {
            id: uuid(),
            points: [firstPoint],
            elementType,
            width,
            colour,
            isVisible,
        };

    return {
        startPoint: firstPoint,
        endPoint: firstPoint,
        elementType,
        width,
        colour,
        id: uuid(),
        isVisible,
    };
};

const createFixedElement = (startPoint, endPoint, elementType, isVisible) => {
    let colour = sessionStorage.getItem('globalColour');
    let width = sessionStorage.getItem('globalWidth');
    colour = trimString(colour);
    width = trimString(width);

    return {
        startPoint: startPoint,
        endPoint: endPoint,
        elementType,
        width,
        colour,
        id: uuid(),
        isVisible,
    };
};

const updateElement = (element, elements, setElements) => {
    const elementsCopy = [...elements];
    elementsCopy[elementsCopy.findIndex((e) => e.id === element.id)] = element;
    setElements(elementsCopy, {
        description: element.type,
        overwrite: true,
    });
};

const deleteElement = (id, elements, setElements, drewElementsRef) => {
    let updatedElements = elements.filter((e) => e.id !== id);

    setElements(updatedElements, { description: 'Delete element' });
    drewElementsRef.current = false;
};

const hideElement = (id, elements, setElements, drewElementsRef) => {
    let elementDescription = '';
    let updatedElements = elements.map((e) => {
        if (e.id === id) {
            e.isVisible = !e.isVisible;
            elementDescription = e.elementType;
        }
        return e;
    });
    drewElementsRef.current = false;
    setElements(updatedElements, {
        description: 'hide ' + elementDescription,
        overwrite: true,
    });
};

const adjustElementCoordinates = (element) => {
    const { elementType, startPoint, endPoint } = element;
    switch (elementType) {
        case 'parallelogram':
        case 'rectangle':
            const minX = Math.min(startPoint.x, endPoint.x);
            const maxX = Math.max(startPoint.x, endPoint.x);
            const minY = Math.min(startPoint.y, endPoint.y);
            const maxY = Math.max(startPoint.y, endPoint.y);

            return {
                startPoint: { x: minX, y: minY },
                endPoint: { x: maxX, y: maxY },
            };
        case 'bresenhamLine':
            if (
                startPoint.x < endPoint.x ||
                (startPoint.x === endPoint.x && startPoint.y < endPoint.y)
            ) {
                return { startPoint, endPoint };
            } else {
                return {
                    startPoint: { ...endPoint },
                    endPoint: { ...startPoint },
                };
            }
        default:
            throw new Error(`Type not recognised: ${elementType}`);
    }
};

const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const positionWithinElement = (x, y, element) => {
    const { startPoint, endPoint, elementType } = element;

    switch (elementType) {
        case 'rectangle':
            const topLeft = nearPoint({ x, y }, startPoint, 'tl');
            const topRight = nearPoint(
                { x, y },
                { x: endPoint.x, y: startPoint.y },
                'tr'
            );
            const bottomLeft = nearPoint(
                { x, y },
                { x: startPoint.x, y: endPoint.y },
                'bl'
            );
            const bottomRight = nearPoint({ x, y }, endPoint, 'br');
            const insideRect =
                x >= startPoint.x &&
                x <= endPoint.x &&
                y >= startPoint.y &&
                y <= endPoint.y
                    ? 'inside'
                    : null;

            return (
                topLeft || insideRect || topRight || bottomLeft || bottomRight
            );

        case 'ddaLine':
        case 'bresenhamLine':
            const p = { x, y };
            const offset =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));

            const start = nearPoint({ x, y }, startPoint, 'start');
            const end = nearPoint({ x, y }, endPoint, 'end');
            const insideLine = Math.abs(offset) < 1 ? 'inside' : null;
            return start || end || insideLine;
        case 'pencil':

        case 'brush':
            break;
        default:
            const p2 = { x, y };
            const offset2 =
                distance(startPoint, endPoint) -
                (distance(startPoint, p2) + distance(endPoint, p2));
            return Math.abs(offset2) < 1;
    }
};

const nearPoint = (startPoint, endPoint, name) => {
    return Math.abs(startPoint.x - endPoint.x) < 5 &&
        Math.abs(startPoint.y - endPoint.y) < 5
        ? name
        : null;
};

const getElementAtPosition = (x, y, elements) => {
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(x, y, element),
        }))
        .find((element) => element.position !== null);
};

export {
    createElement,
    createFixedElement,
    updateElement,
    deleteElement,
    hideElement,
    getElementAtPosition,
};
