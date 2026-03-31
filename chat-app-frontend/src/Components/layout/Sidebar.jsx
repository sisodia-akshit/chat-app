
import { NavLink } from 'react-router-dom'

import "../../Styles/Sidebar.css"
import { FaMessage, FaRightFromBracket } from 'react-icons/fa6'
import { FaSearch } from 'react-icons/fa'
import { useAuth } from '../../Context/AuthContext'

function Sidebar() {
    const { me, logout } = useAuth();
    const logoutClickedHandler = () => {
        logout();
    }
    return (
        <aside className="sidebar" id='sidebar'>
            <div className="sidebar-top">
                <h3 className="sidebar-heading"><span className='sidebar-heading-logo'></span><span className="aside-name">ChatApp</span></h3>

                <nav className="sidebar-nav">
                    <ul className="nav-links">
                        <li className="nav-link nav-link-search"><NavLink to={'/users'} className={({ isActive }) => isActive ? "nav-link-active" : ""}><FaSearch className='aside-icon'/><span className="aside-name">Search</span></NavLink></li>
                        <li className={"nav-link"}><NavLink to={'/'} className={({ isActive }) => isActive ? "nav-link-active" : ""}  ><FaMessage className='aside-icon' /><span className="aside-name">Chats</span></NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="sidebar-bottom">
                <p>©2026 StayWise, All rights reserved.</p>
                <p>Terms of use</p>
                <button type='button' className='logout-button' onClick={logoutClickedHandler}><FaRightFromBracket /><span className="aside-name">Logout {me?.name}</span></button>
            </div>
        </aside>
    )
}

export default Sidebar
