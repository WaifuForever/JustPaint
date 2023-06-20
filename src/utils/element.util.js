import { v4 as uuid } from 'uuid';

const createElement = (element, setElements, setSelectedElement) => {
    const colour = sessionStorage.getItem('globalColour')?.slice(1, -1) ?? null;
    const width = sessionStorage.getItem('globalWidth') ?? null;
    const { firstPoint, elementType, isVisible } = element;

    const newElement = {
        id: uuid(),
        coordinates: new Set([JSON.stringify(firstPoint)]),
        elementType,
        width,
        colour,
        isVisible,
        ...(elementType === 'brush' || elementType === 'pencil'
            ? { points: [firstPoint] }
            : { startPoint: firstPoint, endPoint: firstPoint }),
    };

    setSelectedElement(newElement);

    setElements((prevState) => [...prevState.elements, newElement], {
        description: elementType,
    });
};

const createFixedElement = (element, setElements, setSelectedElement) => {
    const colour = sessionStorage.getItem('globalColour')?.slice(1, -1) ?? null;
    const width = sessionStorage.getItem('globalWidth') ?? null;

    const newElement = {
        coordinates: new Set([JSON.stringify(element.startPoint)]),
        width,
        colour,
        id: uuid(),
        ...element,
    };

    console.log('fixed', newElement);
    setSelectedElement(newElement);

    setElements((prevState) => [...prevState.elements, newElement], {
        description: element.elementType,
    });
};

const updateElement = (
    element,
    elements,
    setElements,
    description,
    overwrite = true
) => {
    //console.log(description, element);
    //console.log('elements', elements);

    setElements([...elements.map((e) => (e.id === element.id ? element : e))], {
        description: description,
        overwrite,
    });
};

const generateElementWithOffset = (element, point) => {
    const offset = element.points
        ? { ...point }
        : {
              x: point.x - element.startPoint.x,
              y: point.y - element.startPoint.y,
          };
    return {
        ...element,
        offset,
    };
};

const deleteElement = (id, elements, setElements, drewElementsRef) => {
    let updatedElements = elements.filter((e) => e.id !== id);
    setElements(updatedElements, { description: 'Delete element' });
    drewElementsRef.current = false;
};

const hideElement = (id, elements, setElements, drewElementsRef) => {
    let elementDescription = '';
    console.log('hide element', elements);
    let updatedElements = elements.map((e) => {
        if (e.id === id) {
            e.isVisible = !e.isVisible;
            elementDescription = e.elementType;
        }
        return e;
    });
    drewElementsRef.current = false;
    setElements(updatedElements, {
        description: 'Hide ' + elementDescription,
        overwrite: false,
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
    const p = { x, y };
    switch (elementType) {
        case 'rectangle':
        case 'circle':
        case 'ellipse':
            const topLeft = nearPoint(p, startPoint, 'tl');
            const topRight = nearPoint(
                p,
                { x: endPoint.x, y: startPoint.y },
                'tr'
            );
            const bottomLeft = nearPoint(
                p,
                { x: startPoint.x, y: endPoint.y },
                'bl'
            );
            const bottomRight = nearPoint(p, endPoint, 'br');
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
            const offset =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));

            const start = nearPoint({ x, y }, startPoint, 'start');
            const end = nearPoint({ x, y }, endPoint, 'end');
            const insideLine = Math.abs(offset) < 1 ? 'inside' : null;
            //console.log(start || end || insideLine);
            return start || end || insideLine;
        case 'pencil':

        case 'brush':
            break;
        default:
            const offset2 =
                distance(startPoint, endPoint) -
                (distance(startPoint, p) + distance(endPoint, p));
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
    generateElementWithOffset,
};
