"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { name: 'Websites', icon: '🖥', path: '/dashboard/websites' },
  { name: 'Tests', icon: '📝', path: '/dashboard/Tests' },
  { name: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
];

const SideMenu: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`side-menu ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggleMenu} className="toggle-btn">
        {isOpen ? '◀' : '▶'}
      </button>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <a className={router.pathname === item.path ? 'active' : ''}>
                  <span className="icon">{item.icon}</span>
                  {isOpen && <span className="name">{item.name}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        .side-menu {
          width: ${isOpen ? '240px' : '60px'};
          height: 100vh;
          background-color: #f0f0f0;
          transition: width 0.3s ease;
          position: fixed;
          left: 0;
          top: 0;
        }
        .toggle-btn {
          position: absolute;
          right: -20px;
          top: 20px;
          background: #f0f0f0;
          border: none;
          cursor: pointer;
        }
        nav ul {
          list-style-type: none;
          padding: 0;
          margin-top: 60px;
        }
        nav ul li {
          margin-bottom: 10px;
        }
        nav ul li a {
          display: flex;
          align-items: center;
          padding: 10px;
          text-decoration: none;
          color: #333;
        }
        nav ul li a.active {
          background-color: #ddd;
        }
        .icon {
          margin-right: 10px;
          font-size: 20px;
        }
        .name {
          display: ${isOpen ? 'inline' : 'none'};
        }
      `}</style>
    </div>
  );
};

export default SideMenu;