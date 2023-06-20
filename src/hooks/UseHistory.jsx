import { useState } from 'react';

const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([
        {
            elements: initialState,
            description: '',
        },
    ]);

    const setElements = (
        action,
        options = { description: '', overwrite: false }
    ) => {
        const newState =
            typeof action === 'function' ? action(history[index]) : action;

        if (options.overwrite) {
            const historyCopy = [...history];
            historyCopy[index].elements = newState;
            //console.log('newhistory', historyCopy);
            setHistory(historyCopy);
        } else {
            const updatedState = [...history].slice(0, index + 1);

         
            setHistory([
                ...updatedState,
                { elements: newState, description: options.description },
            ]);
            setIndex((prevState) => prevState + 1);
        }
    };

    const isValidIndex = (number) => number > -1 && number < history.length - 1;

    const setHistoryAt = (number) => {
        if (isValidIndex) setIndex(number);
    };

    const sliceHistoryAt = (number) => {
        if (isValidIndex(number - 1)) {
            setHistory((prevState) => prevState.slice(0, number + 1));
            setIndex(number);
        }
    };

    const undo = () => {
        index > 0 &&
            setIndex((prevState) => {
                let newIndex = prevState - 1;
                setHistoryAt(newIndex);
                return newIndex;
            });
    };
    const redo = () => {
        index < history.length - 1 &&
            setIndex((prevState) => {
                let newIndex = prevState + 1;
                setHistoryAt(newIndex);
                return newIndex;
            });
    };

    return {
        history,
        index,
        state: history[index],
        setElements,
        setHistoryAt,
        sliceHistoryAt,
        undo,
        redo,
    };
};

export { useHistory };
