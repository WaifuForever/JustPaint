import { useOnDraw } from "../hooks/OnDraw";

const DrawScreen = () => {

    const setCanvasRef = useOnDraw();
    return (
        <div className="h-full w-full">
            <div className="flex h-full justify-center p-5">
                <div className="flex justify-center items-center">
                    <span>a</span>
                    <span>b</span>
                </div>

                <canvas
                    className={`bg-red-900 border border-black`}
                    width={768}
                    height={576}
                    ref={setCanvasRef}
                ></canvas>

                <div className="flex flex-col">
                    <span>layer 1</span>
                    <span>layer 2</span>
                </div>
            </div>
        </div>
    );
};

export default DrawScreen;
