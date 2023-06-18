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
        <div className="flex justify-center border-y border-gray-700 mx-1 text-xs hover:bg-gray-400" style={{minWidth: "50px"}}>
            {Math.floor(x)}, {Math.floor(y)}
        </div>
    );
};

const ShowInfo = ({ selectedElement }) => {
    const [showInfo, setShowInfo] = useState(true);
    console.log(selectedElement);
    return (
        <>
            {showInfo && selectedElement ? (
                <div className="flex flex-col gap-2">
                    <div className="flex">{selectedElement.elementType}</div>
                    {selectedElement.startPoint && (
                        <div className="flex">
                            <span className="text-xs">Start Point</span>
                            <Coordinate
                                x={selectedElement.startPoint.x}
                                y={selectedElement.startPoint.y}
                            />
                        </div>
                    )}
                    {selectedElement.endPoint && (
                        <div className="flex">
                            <span className="text-xs pr-1">End Point</span>
                            <Coordinate
                                x={selectedElement.endPoint.x}
                                y={selectedElement.endPoint.y}
                            />
                        </div>
                    )}

                    <div className="flex flex-row flex-wrap h-96 w-32 justify-center overflow-y-auto scrollbar-hide bg-gray-200">
                        {coordinatesToArray(selectedElement.coordinates).map(
                            ({ x, y }) => (
                                <Coordinate x={x} y={y} />
                            )
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ShowInfo;
