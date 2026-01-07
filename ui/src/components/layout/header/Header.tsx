import React from 'react';
import { Menu, X, User } from 'lucide-react';
import { useUIStore } from '../../../zustand/useUIStore';

const Header: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                    <span className="sr-only">Open sidebar</span>
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <div className="flex items-center lg:hidden">
                    <span className="text-xl font-bold text-blue-600">DataMind AI</span>
                </div>
            </div>

            <div className="flex items-center gap-4">

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 border-2 border-white shadow-sm overflow-hidden">
                        <User className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
