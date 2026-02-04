import React from "react";
import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { useUIStore } from "../../../zustand/features/uistore/useUIStore";
import { NAV_ITEMS } from "./Sidebar.constants";

const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform bg-black transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-16 border-r border-neutral-800 flex flex-col h-full py-4`}
      >
        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={item.name}
              className={({ isActive }) =>
                `flex items-center justify-center rounded-lg h-10 w-10 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`
              }
            >
              <item.icon className="shrink-0 h-5 w-5" />
            </NavLink>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="pb-4 flex justify-center">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `flex items-center justify-center rounded-lg h-10 w-10 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`
            }
          >
            <Settings className="shrink-0 h-5 w-5" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
