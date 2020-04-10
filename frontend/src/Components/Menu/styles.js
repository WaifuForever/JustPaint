import styled from 'styled-components';

import profile from '../../assets/profile.jfif'
import logo from '../../assets/logo.png';
import camera from '../../assets/camera.svg';


export const Options = styled.div `
    padding-left: 60px;
   
`;

export const HorizontalNavBar = styled.ul`
    background-color: #463883;
    width: 100vw;
    margin: 0px;
    
    top:0;
    position: fixed;
   
    z-index: 100;
    a{
      text-decoration: none;

    }

`;

export const Logo = styled.button`
    background-image: ${`url(${logo})`};
    width: 60px;
    height: 40px;
    border: none;
    background-color: Transparent;
    background-size: cover;
    
    
    margin: 10px;
    
`;

export const NavBtn = styled.li`
    
    font-size: 30px;
    display: inline;
    padding-right: 18px;
    padding-top: 28px;
    padding-left: 18px;
   
    background-color: ${props => props.isActive ? "#41357E" : ""};
    color: #000;


    &:hover {
        background-color: #41357C;
    }
   
  
`;

export const VerticalNavBar = styled.div`   
     
    .menu-container{     
        list-style: none;   
        position: fixed;
        animation-name: ${props => props.isVisible ? "show" : "hide"};
        animation-duration: 1s ;
        animation-fill-mode: forwards;
        right:  ${props => props.isVisible ? "0px" : "-100%"};
        background-color: #463883;
        width: 210px;
        height: 100vh;
        transition: right 0.6s cubic-bezier(1, 0,.1,.89);
        
        margin: 0px;
        top:0;
        padding-top: 98px;
        padding-left: 0px;
        z-index:120;
    }

    @keyframes hide {
      from {background-color: #463553;}
      to {background-color: #463883;}
    }

    @keyframes show {
      from {background-color: #463883;}
      to {background-color: #463553;}
    }

    .item{
        
        color: #fff;
        font-size: 20px;
        padding-top: 18px;
        padding-bottom: 18px;
        cursor: pointer;
        list-style: none;
        color: #000;
        text-align: center;
        
    }

    ul li:hover{

    }

    .username{
        text-align: center;
    }

    .username a {
        font-size: 28px;
        text-decoration: none;
        color: #000;

    }

`;

export const ProfileButton = styled.button`
    width: ${props => props.isVisible ? "90px" : "50px"};
    height:  ${props => props.isVisible ? "90px" : "50px"};
    background-size: cover;
    border-radius: 60px;
    top: 0px;
    right: 0px;
    border: none;
    position: fixed;
    
    transition: width 0.6s ease 0.1s, height 0.75s ease 0.1s, margin-right 1.27s linear;
    

    background-image: ${`url(${profile})`};
    cursor: pointer;
    margin:6px;
    margin-right:  ${props => props.isVisible ? "60px" : "20px"};
    z-index:150;
    
    &:focus {
        outline:0;
    }
    
`;

export const Contact = styled.div`
    .contact{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
        

        img {
          
            z-index: 210;
          
            width: 40px;
            height: 40px;
            margin-right: 5px; 
            margin-left: -30px;

           
           
        }

        ul {
            padding: 0;
        }
        li {
            display: inline;
            list-style: none;
            vertical-align: top;
            color: #222222;
        }

      
    }   
       

    .contact:hover {
        background-color: #463665;
       
    }

    .contact:hover li{
        color: #ffffff;
    }
   

 


    .chat{
        border-radius: 15px;
        position: fixed;
        
        right: 220px;
        width: 150px;
        height: 210px;      
        background-color: #363553;
        display: ${props => props.isActive ? "block" : "none"};

        .exit{
            position: absolute;
            top: 5px;
            right: 5px;
            background-color:#444555;
        
        }
    }
   
    
    

   

    input{
          position: absolute;
          bottom: 0px;
          margin-top: 10px;
          width: 146px;
          
      }
`;