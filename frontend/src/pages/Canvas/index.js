import React from 'react';

import './styles.css';

import pencil from '../../assets/pencil-icon.svg';
import eraser from '../../assets/eraser-icon.png';
import trash from '../../assets/trash-icon.png';
import brush from '../../assets/brush-icon.svg';
import undo from '../../assets/undo-icon.svg';
import line from '../../assets/line-icon.svg';
import rect from '../../assets/rect-icon.svg';
import circle from '../../assets/circle-icon.svg';
import triangle from '../../assets/triangle-icon.svg';
import download from '../../assets/download-icon.png';
import paintBucket from '../../assets/paint-bucket-icon.svg';


import Tools from './Tools';


export default function Canvas(){

    const canvasRef = React.useRef(null);
    const sliderRef = React.useRef(null);


    function action(){

    }

    const width = 510+ 510 * 0.1;
    const height = 420 + 420 * 0.1;

    //const { data } = this.props.location.state;

  
    return <>  
        
        

        <div className="draw-container">
            <div className='toolbox left'>
                <div className="group-commands">
                    <div className="item" data-command="undo" title="Undo">
                        <img src={undo} alt=""/>
                    </div>
                    <div className="item" data-command="download" title="Download">
                        <img src={download} alt=""/>
                    </div>
                
                </div>

                <div className="group-shapes">
                    <div className="item" data-command="line" title="Line">
                        <img src={line} alt=""/>
                    </div>
                    <div className="item" data-command="rectangle" title="Rectangle">
                        <img src={rect} alt=""/>
                    </div>
                    <div className="item" data-command="circle" title="Circle">
                        <img src={circle} alt=""/>
                    </div>
                    <div className="item" data-command="triangle" title="Triangle">
                        <img src={triangle} alt=""/>
                    </div>
                                  
                </div>
                
                <div className="group-tools">
                    <div className="item" data-command="pencil" title="Pencil">
                       <img src={pencil} alt=""/>
                    </div>
                    <div className="item" data-command="brush" title="Brush">
                        <img src={brush} alt=""/>
                    </div>
                    <div className="item" data-command="paint-bucket" title="Paint Bucket">
                        <img src={paintBucket} alt=""/>
                    </div>
                    <div className="item" data-command="eraser" title="Eraser">
                        <img src={eraser} alt=""/>
                    </div>
               
                </div>
                <div className="slide-container">
                    <div className="slider"/>
                    <a className="slider-handle" ref={sliderRef} ></a>
                </div>
                                
            </div>

            <div className='canvas-container'> 
                <canvas ref={canvasRef}  width={width} height={height}/>
            </div>     

            {/*<div className={data ? "toolbox right" : "toolbox right-hide"}>*/}
            <div className="toolbox right">    
                <div className="layer-changer">
                    
                </div>       
        
            </div>
           
        </div>  
    </>
}