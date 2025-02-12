import { Link } from "react-router-dom";
import "../../css/Navbar.scss";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const {user , logout} = useAuth()
    console.log(user)
    return (
        <nav className='Nav'>
            <div className='Navbar'>
                <div className='LogoEasyTour'>
                    <h1>EasyTour</h1>
                </div>

                <div className='Path'>
                    <div className="noAuth">
                        <Link className='Text' to="/">Home</Link>
                        <Link className='Text' to="/packages">Package</Link>
                    </div>
                    {!(sessionStorage.getItem('token')) ? (
                        <div>
                            <Link className='Text' to="/login">Login</Link>
                            <Link className='AuthButton' to="/register">Register</Link>
                        </div>
                    ):
                    <Link className='Text' to="/" onClick={logout}>Logout</Link>
                    }
                    
                    {/* <Link className='Text' to="/payment">Payment Test</Link> */}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

