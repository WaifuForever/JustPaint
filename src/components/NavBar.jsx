import { Link } from 'react-router-dom';
import { FaBeer, FaBrush } from 'react-icons/fa';

const NavBar = () => {
    return (
        <div className="flex flex-col w-fit p-4 items-center gap-3 bg-blue-500">
            <Link className="flex w-10 h-10 rounded-full items-center justify-center border border-black bg-blue-400 hover:bg-blue-200" to="/">
                <FaBeer />
            </Link>
            <Link className="flex flex-col justify-center items-center" to="/draw">
                <div>
                    <FaBrush/>
                </div>
                <span className="">Draw</span>
            </Link>
        </div>
    );
};

export default NavBar;
