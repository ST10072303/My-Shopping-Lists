import './App.module.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { Home } from "./pages/Home/Home";
import { Profile } from "./pages/Profile/Profile";
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { SharingList } from './pages/Sharing/SharingList';


function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Sharing shopping list */}
          <Route path="/share/:id" element={<SharingList />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
