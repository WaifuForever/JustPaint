import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';



import HorizontalMenu from './components/Menu/HorizontalMenu';
import VerticalMenu from './components/Menu/VerticalMenu';

import Canvas from './pages/Canvas';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import MainFeed from './pages/MainFeed';

export default function Routes(){
    return (
       <div className='routes-container'>
        
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component ={Dashboard}/>
                <Route path="/draw" exact component ={Canvas}/>
                <Route path="/profile" exact component ={Profile}/>
                <Route path="/about" exact component ={About}/>
                <Route path="/mainfeed" exact component ={MainFeed}/>
                
            </Switch>
            <HorizontalMenu />
            <VerticalMenu />

        </BrowserRouter>
       </div>
       
    );
}