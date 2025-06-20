import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Ranking from './pages/Ranking.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Home from './pages/Home.jsx'
import Painel from './pages/Painel.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MeusPalpites from './pages/MeusPalpites.jsx';
import Palpitar from './pages/Palpitar.jsx';
import PerfilParticipante from './pages/PerfilParticipante.jsx';
import Jogos from './pages/Jogos.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Login sem Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path='/cadastro' element={<Cadastro/>}/>
        <Route path='/painel' element={
    <ProtectedRoute>
      <Painel />
    </ProtectedRoute>
  }/>

        {/* Demais rotas com Navbar */}
        <Route
          path="/ranking"
          element={
            <Navbar>
              <Ranking />
            </Navbar>
          }
        />
        { <Route path="/" element={<Navbar><Home /></Navbar>} /> }
        {<Route path='/meus-palpites' element={<Navbar><MeusPalpites/></Navbar>}/>}
        {<Route path='/palpitar' element={<Navbar><Palpitar/></Navbar>}/>}
        {<Route path="/perfil/:id" element={<Navbar><PerfilParticipante /></Navbar>} />}
        {<Route path='/jogos' element={<Navbar><Jogos/></Navbar>}/>}

      </Routes>
    </div>
  );
}

export default App;
