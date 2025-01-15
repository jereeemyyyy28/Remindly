// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-zinc-800 text-white p-4">
            <ul className="flex space-x-4 justify-center">
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive ? "text-blue-500 font-bold" : "text-white"
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/meetings"
                        className={({ isActive }) =>
                            isActive ? "text-blue-500 font-bold" : "text-white"
                        }
                    >
                        Meetings
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            isActive ? "text-blue-500 font-bold" : "text-white"
                        }
                    >
                        Tasks
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/reminders"
                        className={({ isActive }) =>
                            isActive ? "text-blue-500 font-bold" : "text-white"
                        }
                    >
                        Reminders
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/emails"
                        className={({ isActive }) =>
                            isActive ? "text-blue-500 font-bold" : "text-white"
                        }
                    >
                        Emails
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
