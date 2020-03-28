import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NavBtn, ProfileButton, Logo, HorizontalNavBar, VerticalNavBar, Options, Contacts } from './styles.js';


export default function Menu(){
    const [currentNav, setCurrentNav] = useState({ name: "" },);  
    const [isMenuVisible, setIsMenuVisible] = useState(false);  
    var currentChat = '';

    
  /*  const states = [{ name: 'a'},
                    { name: 'b'},
                    { name: 'c'},
                    { name: 'd'},
                    { name: 'e'}];

    function load(value){
        setCurrentNav({name : value});
        console.log("CurrentNav: " + JSON.stringify(currentNav));

        states.map((state, index) => {                
            state.isActive = true;
            console.log("States: " + (JSON.stringify({id: index, state : state.name === value})));
           
        } 
    )}
*/

    return (
        <>
        <VerticalNavBar isVisible={isMenuVisible}>
            <ProfileButton isVisible={isMenuVisible} onClick={() => setIsMenuVisible(!isMenuVisible)}/>
            <ul className='menu-container'>               
                <li className="username"> <Link to='/profile'>
                    Usuario            
                </Link> </li>
                <li className="item">item2</li>
                <li className="item">item3</li>
                <li >
                    <Contacts>
                        
                        <div className="bloc-1">
                            <div className="contact">
                                <span >Friend 1 </span>
                            </div>
                       
                            <div className="chat" isActive={'a' === currentChat}>
                                <h3>Card 1</h3>
                                <p>Some text</p>
                                <p>Some text</p>
                                
                                <input type="text"/>
                            </div>    
                        </div>
                        <div className="bloc-2">
                            <div className="contact">
                                <span >Friend 2 </span>
                            </div>
                            <div className="chat"isActive={'b' === currentChat}>
                                <h3>Card 2</h3>
                                <p>Some text</p>
                                <p>Some text</p>
                                
                                <input type="text"/>
                            </div>    
                        </div>

                       

                        
                        
                       
                    </Contacts>
                </li>

            </ul>

        </VerticalNavBar>

        <HorizontalNavBar>           
            <Options>
                <Link to='/'>
                    <Logo/>            
                </Link> 

                <Link to='/mainfeed' >
                    <NavBtn isActive={currentNav.name === "a"} onClick={() => setCurrentNav({name: 'a'})}>
                        Find out
                    </NavBtn>
                </Link> 

                <Link to='/'>
                    <NavBtn isActive={currentNav.name === "b"} onClick={() => setCurrentNav({name: 'b'})}>
                        Game
                    </NavBtn>                       
                </Link> 

                <Link to='/draw'>
                    <NavBtn isActive={currentNav.name === "c"} onClick={() => setCurrentNav({name: 'c'})}>
                        Draw
                    </NavBtn>
                </Link> 

                <Link to='/About'>
                    <NavBtn isActive={currentNav.name === "d"} onClick={() => setCurrentNav({name: 'd'})}>
                        About
                    </NavBtn>                   
                </Link> 

                <Link to='/'>
                    <NavBtn isActive={currentNav.name === "e"} onClick={() => setCurrentNav({name: 'e'})}>
                        Home
                    </NavBtn>                       
                </Link>             
               
            </Options>           
            
        </HorizontalNavBar>
       
       
      
       
        </>
    )

};
