import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
} from 'lucide-react';
import { useUIStore } from '../../../zustand/useUIStore';

const Sidebar: React.FC = () => {
    const { isSidebarOpen, setSidebarOpen } = useUIStore();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 transform bg-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-20 border-r border-gray-200 flex flex-col h-full shadow-lg lg:shadow-none`}
            >
                <div className="flex h-16 items-center justify-center border-b border-gray-100 shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">D</div>
                </div>

                <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            title={item.name}
                            className={({ isActive }) =>
                                `flex items-center justify-center rounded-lg h-12 w-full transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="shrink-0 h-6 w-6" />
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
