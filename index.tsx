/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type ActiveTab = 'login' | 'signup';

const LoginSignupForm = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('signup');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission to a backend here.
    // For this prototype, we'll just log the user in.
    onLogin({ username: 'uday123', college: 'BVRC Engineering' });
  };

  return (
    <div className="auth-container">
      <h1>CampusConnect</h1>
      <p>Connect with your college community!</p>
      
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
          aria-pressed={activeTab === 'signup'}
        >
          Sign Up
        </button>
        <button 
          className={`tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
          aria-pressed={activeTab === 'login'}
        >
          Log In
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'signup' && (
          <div className="input-group">
            <label htmlFor="college">College Name</label>
            <input id="college" type="text" placeholder="e.g., BVRC Engineering" required />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="e.g., @uday123" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" className="auth-button">
          {activeTab === 'signup' ? 'Create Account' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const [activeNav, setActiveNav] = useState('Feed');

  const navItems = ['Feed', 'Messages', 'Orders', 'Wallet', 'Profile'];

  const icons = {
    Feed: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V7.125C4.5 6.504 5.004 6 5.625 6H9" /></svg>,
    Messages: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
    Orders: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>,
    Wallet: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>,
    Profile: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CampusConnect</h1>
        <div className="user-info">
          <span>College: <strong>{user.college}</strong></span>
          <span>User: <strong>@{user.username}</strong></span>
        </div>
      </header>
      <nav className="dashboard-nav">
        {navItems.map(item => (
          <button 
            key={item}
            className={`nav-tab ${activeNav === item ? 'active' : ''}`}
            onClick={() => setActiveNav(item)}
            aria-pressed={activeNav === item}
          >
            {icons[item]}
            {item}
          </button>
        ))}
      </nav>
      <main className="dashboard-content">
        <div className="feed-item">
          <div className="feed-item-content">
            <h3>Need help with DSA notes</h3>
            <p>Posted by @Ravi from BVRC Engineering</p>
          </div>
          <div className="feed-item-actions">
            <span className="reward-tag">Reward: ₹100</span>
            <button className="action-button">Accept</button>
          </div>
        </div>
        <div className="feed-item">
          <div className="feed-item-content">
            <h3>Offering Python tutoring</h3>
            <p>Posted by @Priya from Another College</p>
          </div>
          <div className="feed-item-actions">
            <span className="reward-tag">₹200/hr</span>
            <button className="action-button">Chat</button>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  
  return (
    <>
      {isLoggedIn ? (
        <Dashboard user={user} />
      ) : (
        <LoginSignupForm onLogin={handleLogin} />
      )}
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
