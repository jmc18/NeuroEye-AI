import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
  <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">
        NeuroEyeAI
      </h1>
    </div>
    </>
  )
}

export default App
