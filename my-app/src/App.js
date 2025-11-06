import React, { useEffect , useState } from 'react';
import './App.css';
import { login } from "./auth";
import { getItems, createItem } from "./items";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Modules from './pages/Modules';
import ModuleBuilder from './pages/ModuleBuilder';
import Quiz from './pages/Quiz';
import QuizBuilder from './pages/QuizBuilder';
import Lesson from './pages/Lesson';
import Navbar from './components/Navbar';
import PoseMonitor from './components/CameraComponents/PoseMonitor';
import CameraPreview from './components/CameraComponents/CameraPreview';

function App() {
  const [route, setRoute] = useState('home');
  const [user, setUser] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await login("testuser", "password123");
      const data = await getItems();
      setItems(data.results);
    };
    fetchData();
  }, []);

  const addItem = async () => {
    const newItem = await createItem("New Item", "Description here");
    setItems([newItem, ...items]);
  };

  const navigate = (to, opts = {}) => {
    if (to === 'module' && opts.module) {
      setModuleData(opts.module);
    }
    if (opts && to !== 'module') {
      setQuizConfig(opts);
    }
    setRoute(to);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setRoute('modules');
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('home');
  };

  return (
    <div className="App-root">
      <Navbar onNavigate={navigate} user={user} onLogout={handleLogout} />

      <main className="App-main">
        {route === 'home' && <Home onNavigate={navigate} user={user} />}
        {route === 'login' && <Login onLogin={handleLogin} onNavigate={navigate} />}
        {route === 'register' && <Register onRegister={handleLogin} onNavigate={navigate} />}
        {route === 'modules' && <Modules onNavigate={navigate} user={user} />}
        {route === 'module' && <ModuleBuilder module={moduleData} onNavigate={navigate} user={user} />}
        {route === 'lesson' && <Lesson quizConfig={quizConfig} onNavigate={navigate} />}
        {route === 'quiz' && <Quiz quizConfig={quizConfig} onNavigate={navigate} />}
        {route === 'quiz-builder' && <QuizBuilder quizConfig={quizConfig} onNavigate={navigate} />}

        <CameraPreview />
        {/* PoseMonitor still non-functional */}
        {/* <PoseMonitor /> */}

        <div>
          <h1>Items</h1>
          <button onClick={addItem}>Add Item</button>
          <ul>
            {items.map((i) => (
              <li key={i.id}>{i.title} - {i.description}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
