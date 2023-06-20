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
import { computePointInGrid, undoComputePointInGrid } from '../utils/draw.util';

function reflectX(point) {
    return { x: -point.x, y: point.y };
}

function reflectY(point) {
    return { x: point.x, y: -point.y };
}

function rotatePoint(gridRef, point, angle, verbose = false) {
    //translate the point back to origin
    const { x, y } = computePointInGrid(gridRef, point.x, point.y);
    angle = (angle * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    //rotate the point
    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    // translate it back
    const temp = undoComputePointInGrid(gridRef, newX, newY);
    //console.log('point', point);
    if (verbose) {
        console.log('point', point);
        console.log('pointInGrid', { x, y });
        console.log('newPointInGrid', { x: newX, y: newY });
        console.log('newPoint', temp);
    }

    return temp;
}

const ElementForm = ({
    namespaces,
    elementType,
    setElements,
    setSelectedElement,
    setRedraw,
    drewElementsRef,
    gridRef,
    buttonName = 'Draw',
}) => {
    const initialValues = {};
    const validationSchema = {};
    namespaces.forEach((item) => {
        validationSchema[item] = yup
            .number()
            .integer()
            .strict()
            .default(0)
            .required();
        initialValues[item] = 0;
    });
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={() => yup.object().shape(validationSchema)}
            onSubmit={(values, formikHelpers) => {
                console.log('create new element');
                const startPoint = undoComputePointInGrid(
                    gridRef,
                    values[namespaces[0]],
                    values[namespaces[1]]
                );
                console.log('values', values);
                createFixedElement(
                    {
                        startPoint,
                        endPoint:
                            namespaces.length < 4
                                ? {
                                      x: startPoint.x + values[namespaces[2]],
                                      y: startPoint.y,
                                  }
                                : undoComputePointInGrid(
                                      gridRef,
                                      values[namespaces[2]],
                                      values[namespaces[3]]
                                  ),

                        elementType: elementType,
                        isVisible: true,
                    },
                    setElements,
                    setSelectedElement
                );
                setRedraw((prevState) => !prevState);

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
    setRedraw,
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
                        if (!selectedElement) return;

                        const { elementType, startPoint, endPoint } =
                            selectedElement.current;

                        values.x = values.x ?? 0;
                        values.y = values.y ?? 0;

                        let newElement = { ...selectedElement.current };

                        if (selectedElement.points)
                            newElement.points =
                                selectedElement.current.points.map((item) => {
                                    return {
                                        x: item.x - values.x,
                                        y: item.y - values.y,
                                    };
                                });
                        else {
                            newElement.startPoint = {
                                x: startPoint.x + values.x,
                                y: startPoint.y - values.y,
                            };

                            newElement.endPoint = {
                                x: endPoint.x + values.x,
                                y: endPoint.y - values.y,
                            };
                        }

                        updateElement(
                            newElement,
                            elements,
                            setElements,
                            `Moving ${elementType}`,
                            false
                        );
                        setSelectedElement(newElement);
                        drewElementsRef.current = false;
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
            ) : elementType === 'rotate' ? (
                <Formik
                    initialValues={{ radius: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            radius: yup
                                .number()
                                .integer()
                                .default(0)
                                .required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        if (!selectedElement) return;

                        const { elementType, startPoint, endPoint } =
                            selectedElement.current;

                        values.radius = values.radius ?? 0;

                        let newElement = { ...selectedElement.current };

                        if (selectedElement.current.points)
                            newElement.points =
                                selectedElement.current.points.map((item) =>
                                    rotatePoint(gridRef, item, values.radius)
                                );
                        else {
                            newElement.startPoint = rotatePoint(
                                gridRef,
                                startPoint,
                                values.radius,
                                true
                            );

                            newElement.endPoint = rotatePoint(
                                gridRef,
                                endPoint,
                                values.radius
                            );
                        }
                        console.log('rotating element', newElement);
                        updateElement(
                            newElement,
                            elements,
                            setElements,
                            `Rotating ${elementType}`,
                            false
                        );
                        setSelectedElement(newElement);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">radius</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'radius'}
                                    error={errors.radius}
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Rotate
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
                    setRedraw={setRedraw}
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
