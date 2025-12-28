import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/header'
import App from './components/app'
import Footer from './components/footer'
import { BrowserRouter as Router } from 'react-router-dom'
import Sidebar from './components/sidebar'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Router>
        <div className="flex flex-col h-screen 2xl:text-2xl text-gray-300 font-mono
          bg-slate-900 text-shadow-lg">
          <Header className="flex-shrink-0"/>
          <div className='flex flex-1 flex-row min-h-0'>
            <Sidebar/>
            <main className='flex-1 overflow-auto main-content-scroll'>
              <App/>
            </main>
          </div>
          <Footer className="flex-shrink-0"/>
        </div>
      </Router>
    </StrictMode>
)
