import { BsFillLayersFill } from 'react-icons/bs';

import { useSessionStorage } from '../hooks/UseSessionStorage';

import History from '../components/History';
import Layer from '../components/Layer';

const LayerContainer = ({ elements, setElements, drewElementsRef }) => {
    const { setCurrentElement } = useSessionStorage(null);
    return (
        <Layer
            icon={<BsFillLayersFill />}
            currentTitle="Layer"
            elements={elements}
            setElements={setElements}
            setSelectedElement={setCurrentElement}
            drewElementsRef={drewElementsRef}
        />
    );
};

const RightBar = ({
    history,
    index,
    sliceHistoryAt,
    setHistoryAt,
    elements,
    setElements,
    drewElementsRef,
}) => {
    const setLastState = (number) => {
        sliceHistoryAt(number);
        drewElementsRef.current = false;
    };

    const seePreviousState = (number) => {
        setHistoryAt(number);
        drewElementsRef.current = false;
    };
    return (
        <div className="flex flex-col gap-2">
            <History
                currentTitle="History"
                history={history}
                historyIndex={index}
                deleteElement={setLastState}
                setCurrentElements={seePreviousState}
            />
            <LayerContainer
                drewElementsRef={drewElementsRef}
                elements={elements}
                setElements={setElements}
            />
        </div>
    );
};

export default RightBar;
