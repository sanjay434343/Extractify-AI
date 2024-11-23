import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Home, MessageSquare, FileText } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/summary', icon: FileText, label: 'Summary' },
    { to: '/answer', icon: Brain, label: 'AI Answer' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 px-3 py-2
                ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs hidden sm:block">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}