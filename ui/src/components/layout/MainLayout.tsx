import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Header />
                <main className="flex-1 p-4">
                    <div className="max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
