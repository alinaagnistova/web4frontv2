import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Profile from "./components/Profile";
import ProtectedRoute from "./routing/ProtectedRoute";
import Home from "./components/Home";
import './App.css';
function App() {

  return (
      <Router>
          <Header />
          <main className='container content'>
              <Routes>
                  <Route path='/' element={<Home/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/register' element={<Register/>} />
                  <Route element={<ProtectedRoute />}>
                      <Route path='/user-profile' element={<Profile/>} />
                  </Route>
                  <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
          </main>
      </Router>
      );
}


export default App;
