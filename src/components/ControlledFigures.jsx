import {
    Formik,
    Field,
    Form,
    ErrorMessage,
    FormikHelpers,
    FormikValues,
} from 'formik';

import * as yup from 'yup';

import { createFixedElement } from '../utils/element.util';

const computePointInGrid = (gridRef, figureX, figureY) => {
    if (!gridRef.current) {
        return null;
    }

    return {
        x: figureX + 384,
        y: 288 - figureY,
    };
};

const ControlledFigures = ({
    elementType,
    gridRef,
    setElements,
    setSelectedElement,
    drewElementsRef,
}) => {
    return (
        <div>
            {['bresenhamLine', 'ddaLine', 'rectangle'].includes(elementType) ? (
                <Formik
                    initialValues={{ x1: 0, x2: 0, y1: 0, y2: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            x1: yup.number().integer().default(0).required(),
                            x2: yup.number().integer().default(0).required(),
                            y2: yup.number().integer().default(0).required(),
                            y1: yup.number().integer().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        console.log(values);
                        console.log(formikHelpers);
                        const element = createFixedElement(
                            computePointInGrid(gridRef, values.x1, values.y1),
                            computePointInGrid(gridRef, values.x2, values.y2),
                            elementType,
                            true
                        );

                        setElements(
                            (prevState) => [...prevState.elements, element],
                            {
                                description: element.elementType,
                            }
                        );
                        setSelectedElement(element);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">x1</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'x1'}
                                    error={errors.x1}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">y1</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'y1'}
                                    error={errors.y1}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">x2</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'x2'}
                                    error={errors.x2}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">y2</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'y2'}
                                    error={errors.y2}
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Draw
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : elementType === 'circle' ? (
                <Formik
                    initialValues={{ xc: 0, radius: 0, yc: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            xc: yup.number().integer().default(0).required(),
                            radius: yup
                                .number()
                                .integer()
                                .default(0)
                                .required(),
                            yr: yup.number().integer().default(0).required(),
                            yc: yup.number().integer().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        const element = createFixedElement(
                            computePointInGrid(gridRef, values.xc, values.yc),
                            computePointInGrid(
                                gridRef,
                                values.radius,
                                values.radius
                            ),

                            elementType,
                            true
                        );

                        setElements(
                            (prevState) => [...prevState.elements, element],
                            {
                                description: element.elementType,
                            }
                        );
                        setSelectedElement(element);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">xc</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'xc'}
                                    error={errors.xc}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">yc</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'yc'}
                                    error={errors.yc}
                                />
                            </div>
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
                                Draw
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : elementType === 'ellipse' ? (
                <Formik
                    initialValues={{ xc: 0, xr: 0, yc: 0, yr: 0 }}
                    validationSchema={() =>
                        yup.object().shape({
                            xc: yup.number().integer().default(0).required(),
                            xr: yup.number().integer().default(0).required(),
                            yr: yup.number().integer().default(0).required(),
                            yc: yup.number().integer().default(0).required(),
                        })
                    }
                    onSubmit={(values, formikHelpers) => {
                        const element = createFixedElement(
                            computePointInGrid(gridRef, values.xc, values.yc),
                            computePointInGrid(gridRef, values.xr, values.yr),
                            elementType,
                            true
                        );

                        setElements(
                            (prevState) => [...prevState.elements, element],
                            {
                                description: element.elementType,
                            }
                        );
                        setSelectedElement(element);
                        drewElementsRef.current = false;
                    }}
                >
                    {({ errors, touched, resetForm }) => (
                        <Form className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">xc</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'xc'}
                                    error={errors.xc}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">yc</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'yc'}
                                    error={errors.yc}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">xr</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'xr'}
                                    error={errors.xr}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">yr</span>
                                <Field
                                    className="w-14 text-center"
                                    type={'number'}
                                    name={'yr'}
                                    error={errors.yr}
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 bg-blue-400 rounded hover:bg-blue-600"
                            >
                                Draw
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default ControlledFigures;
