

const Tools = {
    Tool_Line: "line",
    Tool_Eraser: "eraser",
    Tool_PaintBucket: "paintBucket",
    Tool_Circle: "circle",

    Tool_Rectangle: "rectangle",
    Tool_Triangle: "triangle",
    Tool_Pencil: "pencil",
    Tool_Zoom: "zoom",

    Tool_Drag: "drag",
    Tool_Curve: "curve",
    Tool_Select: "select",
    Tool_Move: "move",

    Tool_Dropper: "dropper",
    Tool_Brush: "brush"
}
export default Tools;




/*
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
}*/