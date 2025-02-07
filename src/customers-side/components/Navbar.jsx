import { Link } from "react-router-dom"
const Navbar = () => {
    return (
        <nav>
            <div>
                <Link to="/">Home</Link>
                <Link to="/packages">Package</Link>
            </div>
        </nav>
    )
}
export default Navbar