import { Link } from "react-router-dom";
import "../../css/Navbar.scss";

const Navbar = () => {
    return (
        <nav className='Nav'>
            <div className='Navbar'>
                <div className='LogoEasyTour'>
                    <h1>EasyTour</h1>
                </div>

                <div className='Path'>
                    <Link className='Text' to="/">Home</Link>
                    <Link className='Text' to="/packages">Package</Link>
                    <Link className='Text' to="/login">Login</Link>
                    <Link className='AuthButton' to="/register">Register</Link>
                    {/* <Link className='Text' to="/payment">Payment Test</Link> */}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

