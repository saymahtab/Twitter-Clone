import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"

function App() {

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/signup',
      element: <SignUpPage />
    },
    {
      path: '/',
      element: <><Sidebar /><HomePage /><RightPanel /></>
    },
    {
      path: '/notifications',
      element: <><Sidebar /><NotificationPage /><RightPanel /></>
    },
    {
      path: '/profile/:username',
      element: <><Sidebar /><ProfilePage /><RightPanel /></>
    },
  ])

  return (
    <>
      <div className="flex max-w-[76rem] mx-auto">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </>
  )
}

export default App
