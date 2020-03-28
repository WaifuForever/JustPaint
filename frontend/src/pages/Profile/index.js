import React from 'react';

import profile from '../../assets/profile.jfif'

import './styles.css';

import cape from '../../assets/1000x500.jpg';

export default function Profile(){

    return (
        <> 
            
            <div className="container-profile">

                <img className="capa"src={cape} alt=""/>

                <div className="userData">
                    <ul className="card">
                        <li>
                            <img src={profile} alt="profile picture"/>
                        </li>
                        <li className="name">
                            User
                        </li>
                    </ul>
                </div>             
                <h1>Hello World</h1>
                
            </div>
           
        
        </>
    );
}