import React from "react"
import { Link } from "react-router-dom"
const NavbarAdmin = () => {
    return (
        <nav>
            <div>
                <Link to="/">Dashboard</Link>
                <Link to="/customer_manage">Customer Manager</Link>
                <Link to="/package_manage">Packages Manager</Link>
            </div>
        </nav>
    )
}
export default NavbarAdmin