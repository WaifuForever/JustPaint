import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { NavBtn, ProfileButton, Logo, HorizontalNavBar, VerticalNavBar, Options, Contact } from './styles.js';

import profile from '../../assets/profile.jfif';

export default function Menu(){
    const [currentNav, setCurrentNav] = useState("");  
    const [isMenuVisible, setIsMenuVisible] = useState(false);  
    const [currentChat, setCurrentChat] = useState("");  
    
   const states = [{ name: 'a'},
                    
                    { name: 'b'}];

    function load(value){
        setCurrentChat(value);
        console.log("CurrentChat: " + JSON.stringify(currentChat));

        states.map((state, index) => {                
            state.isActive = true;
            console.log("States: " + (JSON.stringify({id: index, state : state.name === value})));
           
        } 
    )}

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
                    <div>
                        
                        <Contact isActive={currentChat === 'a'}>
                            <div className="contact">
                                <div onClick={() => load('a')} >    
                                    <ul>
                                        <li><img src={profile} /> </li>
                                        <li>Friend 1</li>
                                    </ul>
                                </div>
                            </div>
                       
                            <div className="chat">
                                <h3>Card 1</h3>
                                <div className="exit" onClick={() => load('')}>X</div>
                                <p>Some text</p>
                                <p>Some text</p>
                                
                                <input type="text"/>
                            </div>    
                        </Contact>
                        <Contact isActive={currentChat === 'b'}>
                            <div className="contact">
                                <div onClick={() => load('b')}>
                                    
                                    <ul>
                                        <li><img src={profile} /> </li>
                                        <li>Friend 2</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="chat" >
                                <h3>Card 2</h3>  
                                <div className="exit" onClick={() => load('')}>X</div>                              
                                <p>Some text</p>
                                <p>Some text</p>
                                
                                <input type="text"/>
                            </div>    
                        </Contact>

                        
                       
                        </div>
                </li>

            </ul>

        </VerticalNavBar>

        <HorizontalNavBar>           
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
       
        </>
    )
};
