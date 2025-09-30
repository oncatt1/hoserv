import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header'
import App from './components/App'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Router>
        <div className="flex flex-col min-h-screen 2xl:text-2xl text-gray-300 font-mono
        bg-gradient-to-tr from-gray-900  to-violet-900 via-fuchsia-950 dark:to-zinc-800 dark:via-slate-950
         via-20% text-shadow-lg">
          <Header/>
          <div className='flex flex-1 flex-row'>
            <Sidebar/>
            <main className='flex-1 w-3/5 overflow-auto h-[533px]'>
              <App/>
            </main>
          </div>
          <Footer/>
        </div>
      </Router>
    </StrictMode>
)
