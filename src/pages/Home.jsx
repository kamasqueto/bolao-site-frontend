import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import api from '../hooks/axios.js'

export default function Home() {
  const [nextGame, setNextGame] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    async function fetchGames() {
      try {
        const resNext = await api.get(`/api/games/next`);
        const resUpcoming = await api.get(`/api/games/upcoming`);
        setNextGame(resNext.data);
        setUpcomingGames(resUpcoming.data);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
      }
    }
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
          Bem-vindo ao Bolão do Brasileirão 2025!
        </h1>

        {!isLoggedIn && (
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/cadastro')}
              className="bg-white text-blue-900 border border-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition"
            >
              Criar Conta
            </button>
          </div>
        )}

        {nextGame && (
          <div className="bg-white p-6 rounded shadow-md text-center mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Próximo jogo</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <img src={`/escudos/${nextGame.teamA}.png`} alt={nextGame.teamA} className="w-8 h-8" />
                <span className="font-semibold">{nextGame.teamA}</span>
              </div>
              <span className="text-gray-500 font-bold">vs</span>
              <div className="flex items-center gap-2">
                <img src={`/escudos/${nextGame.teamB}.png`} alt={nextGame.teamB} className="w-8 h-8" />
                <span className="font-semibold">{nextGame.teamB}</span>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              {new Date(nextGame.date).toLocaleString('pt-BR')}
            </p>
          </div>
        )}

        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-8">
          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer" onClick={() => navigate('/jogos')}>
            <h3 className="text-lg font-semibold text-blue-900">Ver todos os jogos</h3>
            <p className="text-sm text-gray-600">Acompanhe os confrontos e envie seus palpites</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer" onClick={() => navigate('/ranking')}>
            <h3 className="text-lg font-semibold text-blue-900">Ranking</h3>
            <p className="text-sm text-gray-600">Veja quem está no topo do bolão</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold text-blue-800 mb-3">📜 Regras do Bolão</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
            <li>5 pontos para acerto do placar exato</li>
            <li>3 pontos para acerto do vencedor ou empate</li>
            <li>0 pontos para palpites errados</li>
            <li>Palpites só podem ser enviados até o inicio do jogo</li>
            <li>O ranking é atualizado automaticamente após cada resultado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
