import {
    Formik,
    Field,
    Form,
    ErrorMessage,
    FormikHelpers,
    FormikValues,
} from 'formik';

import * as yup from 'yup';

import { createFixedElement, updateElement } from '../utils/element.util';

const computePointInGrid = (gridRef, figureX, figureY) => {
    if (!gridRef.current) {
        return null;
    }

    return {
        x: figureX + 384,
        y: 288 - figureY,
    };
};

const ElementForm = ({
    namespaces,
    elementType,
    setElements,
    setSelectedElement,
    drewElementsRef,
    gridRef,
    buttonName = 'Draw',
}) => {
    const initialValues = {};
    const validationSchema = {};
    namespaces.forEach((item) => {
        validationSchema[item] = yup.number().integer().default(0).required();
        initialValues[item] = 0;
    });
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={() => yup.object().shape(validationSchema)}
            onSubmit={(values, formikHelpers) => {
                createFixedElement(
                    {
                        startPoint: computePointInGrid(
                            gridRef,
                            values[namespaces[0]],
                            values[namespaces[1]]
                        ),
                        endPoint: computePointInGrid(
                            gridRef,
                            values[namespaces[2]],
                            values[
                                namespaces.length < 4
                                    ? namespaces[2]
                                    : namespaces[3]
                            ]
                        ),
                        elementType: elementType,
                        isVisible: true,
                    },
                    setElements,
                    setSelectedElement
                );

                drewElementsRef.current = false;
            }}
        >
            {({ errors, touched, resetForm }) => (
                <Form className="flex flex-col items-center gap-1">
                    {namespaces.map((namespace, index) => (
                        <div
                            className="flex items-center gap-2"
                            key={index + namespace}
                        >
                            <span className="text-xs">{namespace}</span>
                            <Field
                                className="w-14 text-center"
                                type={'number'}
                                name={namespace}
                                error={errors[namespace]}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                    >
                        {buttonName}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

const ControlledFigures = ({
    elementType,
    gridRef,
    selectedElement,
    elements,
    setElements,
    setSelectedElement,
    drewElementsRef,
}) => {
    return (
        <div>
            {elementType === 'select' ? (
                <Formik
                    initialValues={{ x: 0, y: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            x: yup.number().integer().default(0).required(),
                            y: yup.number().integer().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        const {
                            elementType,
                            width,
                            colour,
                            isVisible,
                            id,
                            startPoint,
                            coordinates,
                            endPoint,
                        } = selectedElement;

                        values.x = values.x ?? 0;
                        values.y = values.y ?? 0;
                        
                        let newElement;
                        console.log('selectedElement', selectedElement);
                        console.log('values', values);
                        const correctedPosition = {
                            x: startPoint.x + values.x,
                            y: startPoint.y + values.y,
                        };
                        switch (elementType) {
                            case 'circle':
                                newElement = {
                                    startPoint: {
                                        ...correctedPosition,
                                    },
                                    endPoint,
                                    elementType,
                                    isVisible,
                                    coordinates,
                                    width,
                                    colour,
                                    id,
                                };

                                break;

                            case 'rectangle':
                            case 'ddaline':
                            case 'bresenhamLine':
                                newElement = selectedElement.points
                                    ? {
                                          points: selectedElement.points.map(
                                              (item) => {
                                                  return {
                                                      x: item.x - values.x,
                                                      y: item.y - values.y,
                                                  };
                                              }
                                          ),
                                          elementType,
                                          width,
                                          colour,
                                          coordinates,
                                          isVisible,
                                          id,
                                      }
                                    : {
                                          startPoint: {
                                              ...correctedPosition,
                                          },
                                          endPoint: {
                                              x:
                                                  correctedPosition.x +
                                                  endPoint.x -
                                                  startPoint.x,
                                              y:
                                                  correctedPosition.y +
                                                  endPoint.y -
                                                  startPoint.y,
                                          },
                                          elementType,
                                          isVisible,
                                          coordinates,
                                          width,
                                          colour,
                                          id,
                                      };

                                break;

                            default:
                                break;
                        }

                        updateElement(
                            newElement,
                            elements,
                            setElements,
                            `Moving ${elementType}`
                        );

                        drewElementsRef.current = false;
                        console.log('correctedPosition', correctedPosition);
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">x</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'x'}
                                    error={errors.x}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">y</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'y'}
                                    error={errors.y}
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Move
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : [
                  'bresenhamLine',
                  'ddaLine',
                  'rectangle',
                  'circle',
                  'ellipse',
              ].includes(elementType) ? (
                <ElementForm
                    namespaces={
                        elementType === 'circle'
                            ? ['x', 'y', 'radius']
                            : ['x1', 'y1', 'x2', 'y2']
                    }
                    elementType={elementType}
                    setElements={setElements}
                    setSelectedElement={setSelectedElement}
                    drewElementsRef={drewElementsRef}
                    gridRef={gridRef}
                />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default ControlledFigures;
