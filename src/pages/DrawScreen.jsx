import { useOnDraw } from '../hooks/Canvas';

const DrawScreen = () => {

   

    const onDraw = (ctx, point, prevPoint) => {
        drawLine(prevPoint, point, ctx, '#000000', 2);
    };
    const { onMouseDown, setCanvasRef } = useOnDraw(onDraw);

    const drawLine = (start, end, ctx, colour, width) => {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = colour;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(start.x, start.y, width/2, 0, 2 * Math.PI);
        ctx.fill();
    };

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
                    onMouseDown={onMouseDown}
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
