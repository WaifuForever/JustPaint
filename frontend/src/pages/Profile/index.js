import React, { useState }  from 'react';

import profile from '../../assets/profile.jfif'

import './styles.css';

import cape from '../../assets/1000x500.jpg';

import comment from '../../assets/comment.svg';
import like from '../../assets/like.svg';
import send from '../../assets/send.svg';
import more from '../../assets/more.svg';


export default function Profile(){

    const [isSelected, setIsSelected] = useState("a");

    return (
        <>             
            <div >
                <div className="container-profile">
                    <img className="cover"src={cape} alt=""/>

                    <div className="userContainer">
                        <ul className="userCard">
                            <li>
                                <img src={profile} alt="profile picture"/>
                            </li>
                            <li className="name">
                                <strong>User</strong>
                            </li>
                            <li className="info">500 Followers</li>
                            <li className="info">300 Following</li>

                        </ul>
                        <ul className="userData">
                            
                        
                            <li>Nascido(a) em 26 de junho de 1999</li>
                            <li>Ingressou em 31/03/2020</li>  
                            <li><strong>Sexo: </strong> Masculino</li>
                            
                        </ul>
                        <div className="description">lorem ipsum dolor sit amet consectetur adipiscing elit in sociosqu quis proin egestas mauris diam blandit pellentesque praesent ut enim venenatis luctus turpis non condimentum mattis odio curae potenti sapien augue himenaeos taciti mi vestibulum duis justo dui sed donec ligula tempor leo varius dictum felis interdum feugiat 
                        aliquet purus porttitor maximus ex ridiculus fames mollis primis per hac ultrices placerat aliquam 
                        hendrerit imperdiet aenean facilisis a ullamcorper urna nec nisi tellus quisque quam vitae ad integer
                        iaculis facilisis</div>

                    </div>  
                    
                    <div className="navbar">

                        <button className={isSelected === "a" ? "button-selected" : "button"} onClick={() => setIsSelected("a")}>TimeLine</button>
                        <button className={isSelected === "b" ? "button-selected" : "button"} onClick={() => setIsSelected("b")}>FeedBack</button>
                        <button className={isSelected === "c" ? "button-selected" : "button"} onClick={() => setIsSelected("c")}>Activity</button>
                     

                    </div> 
                    <div className="TimeLine" style={isSelected === "a" ? {display: "block"} : {display: "none"}}>
                        <section id="post-list">
                       
                        <article>
                            <header>
                            <div className="user-info">
                                <span>artist</span>
                                <span className="place"> place</span>
                            </div>
                            
                            <img src={more} alt= "Mais"/>
                            </header>
                
                            {/*<img src= {`http://localhost:3333/files/${post.image}`} alt= "post"/>*/}
                
                            <footer>
                            <div className= "actions">
                                <button type="button">
                                <img src = {like} alt=""/>
                                </button>
                            
                                <img src = {comment} alt=""/>
                                <img src = {send} alt=""/>
                            </div>
                            <strong>{5}</strong>
                
                            <p>
                                alguma coisa
                                <span> #dasdasd </span>
                            </p>
                            </footer>  
                
                        </article> 
                        {/*))}*/}
                        
                    </section >
                    </div>
                    <div className="FeedBack" style={isSelected === "b" ? {display: "block"} : {display: "none"}}>
                        <h1>FeedBack</h1>
                    </div>
                    <div className="Activity" style={isSelected === "c" ? {display: "block"} : {display: "none"}}>
                        <h1>Activity</h1>
                    </div>

                                        
                </div>
                  
            </div>
       </>
    );
}