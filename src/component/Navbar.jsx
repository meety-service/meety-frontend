import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Icon } from "../assets/logo.svg"
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

const Navbar = () => {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <div className="navbar">
                <div className="h-[60px] w-screen z-20 flex items-center justify-between px-5 bg-white border-b border-gray-900">
                    <Link to="/" className="flex items-center space-x-3">
                        <Icon width="100px"/>
                    </Link>
                    <button className="z-50 flex items-center justify-center" onClick={showSidebar} aria-controls="navbar-default" aria-expanded="false">
                        {
                            sidebar ? 
                            <KeyboardArrowRightRoundedIcon fontSize="large" color="primary"/> :
                            <MenuRoundedIcon fontSize="large" style={{ fill: "#1B51DC" }}/> 
                        }
                    </button>   
                </div>
            </div>
            <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                <ul className="nav-menu-items" onClick={showSidebar}>
                    <li className="h-[60px] w-full z-20 flex items-center justify-end">
                           
                    </li>
                    <li>
                        Logout
                    </li>
                    <li>
                        Revoke Access
                    </li>
                </ul>
            </nav>
        </>
    )
  }
  

export default Navbar