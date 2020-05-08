import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {  ProfileButton, VerticalNavBar, Contact } from './styles.js';

import profile from '../../../assets/profile.jfif';

export default function Menu(){
  
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
        
        <VerticalNavBar className="vertical_navbar" isVisible={isMenuVisible}>
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
            <div className='rest'></div>
        </VerticalNavBar>

       
    )
};
