import { Link } from "react-router-dom";
import "../../css/Navbar.scss";

const NavbarAdmin = () => {
    return (
        <nav className='Nav'>
            <div className='Navbar'>
                <div className='LogoEasyTour'>
                    <h1>EasyTour</h1>
                </div>

                <div className='Path'>
                    <Link className='Text' to="/">Dashboard</Link>
                    <Link className='Text' to="/customer_manage">Customer Manager</Link>
                    <Link className='Text' to="/package_manage">Packages Manager</Link>
                    {/* <Link className='Text' to="/payment">Payment Test</Link> */}
                </div>
            </div>
        </nav>
    )
}
//
export default NavbarAdmin;