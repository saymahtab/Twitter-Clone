import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import Sidebar from "./components/common/Sidebar"

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Sidebar /><HomePage /></>
    },
    {
      path: '/signup',
      element: <><Sidebar /><SignUpPage /></>
    },
    {
      path: '/login',
      element: <><Sidebar /><LoginPage /></>
    }
  ])

  return (
    <>
    <div className='flex max-w-6xl mx-auto'>
      <RouterProvider router={router} />
    </div>
    </>
  )
}

export default App
