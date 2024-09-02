import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Sidebar /><HomePage /><RightPanel /></>
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
