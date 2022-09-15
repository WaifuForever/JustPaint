import { FaPencilAlt } from 'react-icons/fa';
import { GiStraightPipe } from 'react-icons/gi';
import ToolButton from '../components/ToolButton';

import { usePencil } from '../hooks/ToolHooks';

const DrawScreen = () => {
    const onDraw = (ctx, point, prevPoint) => {
        drawLine(prevPoint, point, ctx, '#000000', 2);
    };
    const { setCanvasRef } = usePencil(onDraw);

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
        ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    return (
        <div className="flex h-full w-full justify-center p-5 bg-skin-default">
            <div className="flex justify-center items-center ">
                <ToolButton icon={<FaPencilAlt />} onClick={() => onDraw} />
                <ToolButton icon={<GiStraightPipe />} onClick={() => onDraw} />
            </div>
            <div className=' overflow-y-auto'>
                <canvas
                    className={`bg-red-900 border border-black`}
                    width={768}
                    height={576}
                    ref={setCanvasRef}
                ></canvas>
            </div>

            <div className="flex flex-col">
                <span>layer 1</span>
                <span>layer 2</span>
            </div>
        </div>
    );
};

export default DrawScreen;
