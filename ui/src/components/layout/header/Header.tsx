import React from 'react';
import { Menu, X, User } from 'lucide-react';
import { useUIStore } from '../../../zustand/features/uistore/useUIStore';
import Button from '../../button/Button';

const Header: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <div className="lg:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        title="Open sidebar"
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
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
                    <Button
                        variant="ghost"
                    >
                        <User className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
