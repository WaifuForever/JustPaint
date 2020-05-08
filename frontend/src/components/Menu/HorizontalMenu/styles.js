import styled from 'styled-components';

import logo from '../../../assets/logo.png';


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
