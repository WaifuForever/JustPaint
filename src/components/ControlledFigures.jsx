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

function reflectPointOverLine(point, m, b2) {
    let a = m;
    let b = 1;
    let c = b2;

    //y = mx + b;
    //m *x + 1 * y + b = 0;

    let coef = Math.sqrt(a * a + b * b);

    a = a / coef;
    b = b / coef;
    c = c / coef;

    //signed distance
    let d = a * point.x + b * point.y + c;

    return { x: point.x - 2 * a * d, y: point.y - 2 * b * d };
}

function rotatePoint(gridRef, point, angle, verbose = false) {
    //translate the point back to origin
    const { x, y } = computePointInGrid(gridRef, point);
    angle = (angle * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    //rotate the point
    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    // translate it back
    const temp = undoComputePointInGrid(gridRef, { x: newX, y: newY });
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
                const startPoint = undoComputePointInGrid(gridRef, {
                    x: values[namespaces[0]],
                    y: values[namespaces[1]],
                });
                console.log('values', values);
                createFixedElement(
                    {
                        startPoint,
                        endPoint:
                            namespaces.length < 4
                                ? undoComputePointInGrid(gridRef, {
                                      x: startPoint.x + values[namespaces[2]],
                                      y: startPoint.y,
                                  })
                                : undoComputePointInGrid(gridRef, {
                                      x: values[namespaces[2]],
                                      y: values[namespaces[3]],
                                  }),

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
            ) : elementType === 'reflection' ? (
                <Formik
                    initialValues={{ m: 0, b: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            m: yup.number().integer().default(0).required(),
                            b: yup.number().integer().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        if (!selectedElement) return;

                        const { elementType, startPoint, endPoint } =
                            selectedElement.current;

                        values.m = values.m ?? 0;
                        values.b = values.b ?? 0;

                        let newElement = { ...selectedElement.current };

                        if (selectedElement.current.points)
                            newElement.points =
                                selectedElement.current.points.map(
                                    (item) =>
                                        undoComputePointInGrid(
                                            gridRef,
                                            reflectPointOverLine(
                                                computePointInGrid(
                                                    gridRef,
                                                    item
                                                ),
                                                values.m,
                                                values.b
                                            )
                                        )
                                    //rotatePoint(gridRef, item, values.radius)
                                );
                        else {
                            newElement.startPoint = undoComputePointInGrid(
                                gridRef,
                                reflectPointOverLine(
                                    computePointInGrid(gridRef, startPoint),
                                    values.m,
                                    values.b
                                )
                            );

                            newElement.endPoint = undoComputePointInGrid(
                                gridRef,
                                reflectPointOverLine(
                                    computePointInGrid(gridRef, endPoint),
                                    values.m,
                                    values.b
                                )
                            );
                        }

                        updateElement(
                            newElement,
                            elements,
                            setElements,
                            `Reflecting ${elementType}`,
                            false
                        );
                        setSelectedElement(newElement);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">m</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'m'}
                                    error={errors.m}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs">b</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'b'}
                                    error={errors.b}
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Reflect
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : elementType === 'scale' ? (
                <Formik
                    initialValues={{ scale: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            scale: yup.number().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        if (!selectedElement) return;

                        const { elementType, startPoint, endPoint } =
                            selectedElement.current;

                        values.scale = values.scale ?? 0;

                        let newElement = { ...selectedElement.current };

                        if (selectedElement.current.points)
                            newElement.points =
                                selectedElement.current.points.map(
                                    (
                                        item //not working
                                    ) =>
                                        undoComputePointInGrid(gridRef, {
                                            x: item.x * values.scale,
                                            y: item.y * values.scale,
                                        })
                                );
                        else {
                            newElement.endPoint =
                                values.scale <= 1
                                    ? {
                                          x:
                                              endPoint.x -
                                              Math.abs(
                                                  startPoint.x - endPoint.x
                                              ) *
                                                  values.scale,
                                          y:
                                              endPoint.y -
                                              Math.abs(
                                                  startPoint.y - endPoint.y
                                              ) *
                                                  values.scale,
                                      }
                                    : {
                                          x:
                                              endPoint.x +
                                              Math.abs(
                                                  startPoint.x - endPoint.x
                                              ) *
                                                  values.scale,
                                          y:
                                              endPoint.y +
                                              Math.abs(
                                                  startPoint.y - endPoint.y
                                              ) *
                                                  values.scale,
                                      };
                        }

                        updateElement(
                            newElement,
                            elements,
                            setElements,
                            `Scaling ${elementType}`,
                            false
                        );
                        setSelectedElement(newElement);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">scale</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'scale'}
                                    error={errors.scale}
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Scale
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
