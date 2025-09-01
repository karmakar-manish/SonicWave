import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Homepage from './pages/home/Homepage'
import { Loader } from "lucide-react"
import { useAuthUserHook } from './hooks/useAuthUserHook'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage'
import { ToastContainer } from 'react-toastify'
import ChatPage from './pages/ChatPage'
import AlbumPage from './pages/album/AlbumPage'
import NotFoundPage from './pages/404/NotFoundPage'
import AdminPage from './pages/admin/AdminPage'
function App() {

  //get the current user details from "/auth/me" route of backend
  const { data: authUser, isLoading } = useAuthUserHook()

  //for showing loading screen
  if (isLoading) {
    return <div className='h-screen flex flex-col justify-center items-center'>
      <Loader className='animate-spin size-10 text-green-400' />
      <p className='pt-2'>Waking up server...</p>
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/admin' element={authUser ? <AdminPage />: <Navigate to={"/login"}/>} />

        <Route element={<MainLayout />}>
          <Route path='/' element={<Homepage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/albums/:albumId' element={<AlbumPage />} />

          {/* for any route other than the above  */}
          <Route path='*' element={<NotFoundPage />} />

        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>

  )
}

export default App
