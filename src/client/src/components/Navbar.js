import React from 'react'
import {NavLink} from 'react-router-dom'

export const Navbar = () => {

        return (
            <nav>
                <div className="nav-wrapper teal darken-1">
                    <a href="/" className="brand-logo">
                        Cleaner Track Pro
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/client/list">Client</NavLink></li>
                        <li><NavLink to="/worksites/list">Worksites</NavLink></li>
                        <li><NavLink to="/job/list">Job</NavLink></li>
                        <li><NavLink to="/employees/list">Employees</NavLink></li>
                        <li><NavLink to="/equipment/list">Equipment</NavLink></li>
                    </ul>
                </div>
            </nav>
        )
}


















