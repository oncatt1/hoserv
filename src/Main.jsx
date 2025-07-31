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
        <div className="flex flex-col min-h-screen 2xl:text-2xl text-gray-300 font-mono
        bg-gradient-to-tr from-gray-900  to-violet-900 via-fuchsia-950 via-20% 
        text-shadow-lg">
          <Header/>
          <div className='flex flex-1 flex-row'>
            <Sidebar/>
            <main className='flex-1 w-3/5'>
              <App/>
            </main>
          </div>
          <Footer/>
        </div>
      </Router>
    </StrictMode>
)
