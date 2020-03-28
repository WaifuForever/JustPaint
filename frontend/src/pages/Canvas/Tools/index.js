import React from 'react';
import api from '../../../services/api';

import './styles.css';




export default function Dashboard(){
    const [ tools, setTools ] = React.useState([]);
    
    const user_id = localStorage.getItem('user');
   
    

    React.useEffect(() => {
        async function loadTools() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id },
            }); 

            setTools(response.data, {});
        }

        loadTools();

    }, []);



    return (
        <>            
            <ul className="spot-list">
                {tools.map(tool => (

                    <nav class="menu-hidde" id="menu-hidde">
                        <ul>
                            <li key={tool._id}>
                            <button className='btn' onClick={new Function(tool.action)}>
                                <img className='icon' src={tool.icon} alt='image'></img>
                            </button>   
                            </li>
                           
                        </ul>
                    </nav>

                ))}
 
            </ul>           
        </>
    )
}