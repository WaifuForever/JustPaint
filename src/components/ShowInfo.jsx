import { useState } from 'react';

const coordinatesToArray = (elementCoordinates) => {
    if (!elementCoordinates) return [];
    const coordinatesArray = Array.from(elementCoordinates).map((str) =>
        JSON.parse(str)
    );
    ////console.log(coordinatesArray);
    return coordinatesArray;
};

const Coordinate = ({ x, y }) => {
    return (
        <div
            className="flex justify-center border-y border-gray-700 mx-1 text-xs hover:bg-gray-400"
            style={{ minWidth: '50px' }}
        >
            {Math.floor(x)}, {Math.floor(y)}
        </div>
    );
};

const ShowInfo = ({ selectedElement, redraw }) => {
    const [showInfo, setShowInfo] = useState(true);
    if (!selectedElement.current || !showInfo) return null;
    const { elementType, startPoint, endPoint, coordinates, points } =
        selectedElement.current;
    return (
        <>
            <div className={`flex flex-col gap-2 ${redraw}`}>
                <div className="flex">{elementType}</div>

                {startPoint && (
                    <div className="flex">
                        <span className="text-xs">Start Point</span>
                        <Coordinate x={startPoint.x} y={startPoint.y} />
                    </div>
                )}
                {endPoint && (
                    <div className="flex">
                        <span className="text-xs pr-1">End Point</span>
                        <Coordinate x={endPoint.x} y={endPoint.y} />
                    </div>
                )}

                <div className="flex flex-row flex-wrap h-96 w-32 justify-center overflow-y-auto scrollbar-hide bg-gray-200">
                    {(['pencil', 'brush'].includes(elementType)
                        ? points
                        : coordinatesToArray(coordinates)
                    ).map(({ x, y }, index) => (
                        <Coordinate key={index + `${x}`} x={x} y={y} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ShowInfo;
