import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NavBtn, Logo, HorizontalNavBar, Options } from './styles.js';



export default function Menu(){
    const [currentNav, setCurrentNav] = useState("");  
   
   

    return (
        
        <HorizontalNavBar className="horizontal_navbar">           
            <Options>
                <Link to='/'>
                    <Logo/>            
                </Link> 

                <Link to='/mainfeed' >
                    <NavBtn isActive={currentNav === "a"} onClick={() => setCurrentNav('a')}>
                        Find out
                    </NavBtn>
                </Link> 

                <Link to='/'>
                    <NavBtn isActive={currentNav === "b"} onClick={() => setCurrentNav('b')}>
                        Game
                    </NavBtn>                       
                </Link> 

                <Link to='/draw'>
                    <NavBtn isActive={currentNav === "c"} onClick={() => setCurrentNav( 'c')}>
                        Draw
                    </NavBtn>
                </Link> 

                <Link to='/About'>
                    <NavBtn isActive={currentNav === "d"} onClick={() => setCurrentNav( 'd')}>
                        About
                    </NavBtn>                   
                </Link> 

                <Link to='/'>
                    <NavBtn isActive={currentNav === "e"} onClick={() => setCurrentNav( 'e')}>
                        Home
                    </NavBtn>                       
                </Link>             
               
            </Options>           
           
        </HorizontalNavBar>       
       
        
    )
};
