import React from 'react';

import './styles.css';

import pencil from '../../assets/pencil.png';
import eraser from '../../assets/eraser.png';
import trash from '../../assets/trash.png';

import Tools from './Tools';


export default function Canvas(){

    const canvasRef = React.useRef(null);

    function action(){

    }

    return <>  
        
        <Tools/>

        <div>
            <center className='canvas-container'> 
                <canvas ref={canvasRef} width={510+ 510 * 0.1} height={420 + 420 * 0.1}/>
            </center>
           
        
        </div>  
    </>
}