/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Mock Socket.IO Client ---
// In a real application, you would import the socket.io-client library
// and connect to a real server, e.g., const socket = io("http://localhost:3001");
const createMockSocket = () => {
  const listeners = {};
  return {
    on(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
    emit(event, data) {
      console.log(`[Socket Emit] ${event}:`, data);
      // Simulate server receiving and broadcasting
      if (event === 'sendMessage') {
        const message = { ...data, timestamp: new Date().toISOString() }; // Server adds timestamp
        setTimeout(() => {
          if (listeners['receiveMessage']) {
            listeners['receiveMessage'].forEach(callback => callback(message));
          }
        }, 300); // Simulate network latency
      }
      if (event === 'userConnects') {
         setTimeout(() => {
          if (listeners['updateUserList']) {
            // In a real app, the server would maintain the list and send the full updated list.
            // Here, we'll just echo it back for demonstration.
             const initialUsers = [
                { username: 'ravi_cse', status: 'online', avatarColor: '#7ED321' },
                { username: 'priya_it', status: 'online', avatarColor: '#F5A623' },
                { username: 'uday_mech', status: 'online', avatarColor: '#4A90E2' },
                { username: 'sara_ece', status: 'offline', avatarColor: '#BD10E0' },
            ];
            listeners['updateUserList'].forEach(callback => callback(initialUsers));
          }
        }, 500);
      }
    },
    disconnect() {
      console.log("[Socket] Disconnected");
    },
  };
};


type ActiveTab = 'login' | 'signup';

const LoginSignupForm = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('signup');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission to a backend here.
    // For this prototype, we'll just log the user in.
    onLogin({ 
      username: 'uday_mech', 
      college: 'BVRC Engineering',
      department: 'Mechanical',
      year: '3rd'
    });
  };

  return (
    <div className="auth-container">
      <h1>CampusConnect</h1>
      <p>Your college community awaits.</p>
      
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
          <>
            <div className="input-group">
              <label htmlFor="college">College Name</label>
              <input id="college" type="text" placeholder="e.g., BVRC Engineering" required />
            </div>
             <div className="input-group">
              <label htmlFor="department">Department</label>
              <input id="department" type="text" placeholder="e.g., Computer Science" required />
            </div>
             <div className="input-group">
              <label htmlFor="year">Year</label>
              <input id="year" type="text" placeholder="e.g., 2nd Year" required />
            </div>
          </>
        )}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="e.g., @uday_mech" required />
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

// --- View Components for Dashboard ---

const ChannelView = ({ channelName, college, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
    <>
        <div className="feed-header">
            <h2>{channelName}</h2>
            <p>Announcements and general chat for everyone at {college}.</p>
        </div>
        <div className="feed-posts-container">
            {messages.map((msg, index) => (
                 <div className="feed-post" key={index}>
                    <div className="post-author">
                        <div className="author-avatar" style={{backgroundColor: msg.user.avatarColor || '#4A90E2'}}>{msg.user.avatar}</div>
                        <strong>@{msg.user.username}</strong>
                        <span className="post-timestamp">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <p className="post-content">{msg.text}</p>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
         <div className="message-input-box">
             <input 
                type="text" 
                placeholder={`Message ${channelName}`} 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
             <button onClick={handleSend}>Send</button>
         </div>
    </>
    );
};

const ChatView = () => (
    <div className="placeholder-view">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
        <h2>Direct & Group Chats</h2>
        <p>This is where your private conversations will appear. Try out the real-time channels!</p>
    </div>
);

const PeopleView = () => (
    <div className="placeholder-view">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm7.5 2.962a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zm-9.5-2.962a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0v1.5z" /></svg>
        <h2>Discover People</h2>
        <p>Find and connect with other students from your college.</p>
    </div>
);


const Dashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('# general');
  const socketRef = useRef(null);
  
  const [messages, setMessages] = useState({
      '# general': [
        { user: { username: 'ravi_cse', avatar: 'R', avatarColor: '#7ED321' }, text: 'Anyone up for group study today for the DSA exam? Planning to meet at the library around 4 PM.', timestamp: '2023-10-27T10:00:00Z' },
        { user: { username: 'priya_it', avatar: 'P', avatarColor: '#F5A623' }, text: 'Placement drive details for TCS are out! Check the college notice board. All the best everyone!', timestamp: '2023-10-27T11:30:00Z' },
      ],
      '# placements': [],
      '# study-help': [],
      '# events': [],
  });

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socketRef.current = createMockSocket();
    socketRef.current.emit('userConnects', { username: user.username });

    socketRef.current.on('receiveMessage', (newMessage) => {
        setMessages(prev => ({
            ...prev,
            [newMessage.channel]: [...(prev[newMessage.channel] || []), newMessage],
        }));
    });

    socketRef.current.on('updateUserList', (userList) => {
        setOnlineUsers(userList);
    });

    return () => {
        socketRef.current.disconnect();
    };
  }, [user]);

  const handleSendMessage = (text) => {
    if (!socketRef.current) return;
    const message = {
        user: { username: user.username, avatar: user.username.charAt(0).toUpperCase(), avatarColor: '#4A90E2' },
        text: text,
        channel: activeView,
    };
    // In a real app, this emit would also trigger a DB save on the server.
    socketRef.current.emit('sendMessage', message);
  };

  const renderMainContent = () => {
    if (activeView.startsWith('#')) {
      return <ChannelView 
        channelName={activeView} 
        college={user.college} 
        messages={messages[activeView] || []}
        onSendMessage={handleSendMessage}
      />;
    }
    switch (activeView) {
      case 'chat':
        return <ChatView />;
      case 'people':
        return <PeopleView />;
      case 'home':
      default:
        return <ChannelView 
            channelName="# general" 
            college={user.college}
            messages={messages['# general'] || []}
            onSendMessage={handleSendMessage}
        />;
    }
  };

  const channels = ['# general', '# placements', '# study-help', '# events'];

  return (
    <div className="dashboard-grid">
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>CampusConnect</h1>
          <span>{user.college}</span>
        </div>
        <div className="user-profile-widget">
           <span>Welcome, <strong>@{user.username}</strong></span>
           <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        </div>
      </header>
      
      <aside className="sidebar-left">
        <nav className="main-nav">
          <button className={`nav-item ${activeView.startsWith('#') ? 'active' : ''}`} onClick={() => setActiveView('# general')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
            Home
          </button>
          <button className={`nav-item ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setActiveView('chat')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
            Chat
          </button>
           <button className={`nav-item ${activeView === 'people' ? 'active' : ''}`} onClick={() => setActiveView('people')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm7.5 2.962a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zm-9.5-2.962a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0v1.5z" /></svg>
            People
          </button>
        </nav>
        <div className="channels-section">
          <h2>Channels</h2>
          {channels.map(channel => (
            <button 
              key={channel}
              className={`channel-item ${activeView === channel ? 'active' : ''}`}
              onClick={() => setActiveView(channel)}
            >
              {channel}
            </button>
          ))}
        </div>
      </aside>

      <main className="dashboard-main">
        {renderMainContent()}
      </main>

      <aside className="sidebar-right">
        <h2>Online Users</h2>
        {onlineUsers.map(onlineUser => (
            <div className="online-user" key={onlineUser.username}>
                <div className="user-avatar" style={{backgroundColor: onlineUser.avatarColor}}>{onlineUser.username.charAt(0).toUpperCase()}</div>
                <span>@{onlineUser.username}</span>
                <span className={`status-dot ${onlineUser.status}`}></span>
            </div>
        ))}
      </aside>
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