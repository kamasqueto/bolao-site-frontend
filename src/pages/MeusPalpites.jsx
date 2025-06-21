import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
const API_URL = import.meta.env.VITE_API_URL;

export default function MeusPalpites() {
  useAuthRedirect();
  const [palpites, setPalpites] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarPalpites() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/guesses/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const calcularPontos = (guessA, guessB, scoreA, scoreB) => {
          if (scoreA == null || scoreB == null) return null;
          if (guessA === scoreA && guessB === scoreB) return 5;

          const resultadoReal = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'E';
          const resultadoPalpite = guessA > guessB ? 'A' : guessA < guessB ? 'B' : 'E';

          return resultadoReal === resultadoPalpite ? 3 : 0;
        };

        const palpitesComPontos = res.data.map(p => {
          const pontos = calcularPontos(p.guessA, p.guessB, p.game.scoreA, p.game.scoreB);
          return { ...p, points: pontos };
        });

        setPalpites(palpitesComPontos);
      } catch (err) {
        console.error('Erro ao carregar palpites:', err);
        setMensagem('Erro ao carregar palpites.');
      }
    }

    carregarPalpites();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">📋 Meus Palpites</h1>

      {mensagem && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {mensagem}
        </div>
      )}

      {/* Desktop: tabela | Mobile: cartões */}
      <div className="hidden md:block">
        <table className="w-full bg-white border border-gray-300 text-center shadow">
          <thead className="bg-blue-100 text-blue-900 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 border">Jogo</th>
              <th className="py-3 px-4 border">Palpite</th>
              <th className="py-3 px-4 border">Resultado</th>
              <th className="py-3 px-4 border">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {palpites.map(({ id, game, guessA, guessB, points }) => (
              <tr key={id} className="text-sm hover:bg-gray-50 transition">
                <td className="py-2 px-4 border font-medium">{game.teamA} x {game.teamB}</td>
                <td className="py-2 px-4 border text-blue-800 font-bold">{guessA} x {guessB}</td>
                <td className="py-2 px-4 border">
                  {game.scoreA != null && game.scoreB != null
                    ? `${game.scoreA} x ${game.scoreB}`
                    : <span className="italic text-gray-500">Aguardando</span>}
                </td>
                <td className={`py-2 px-4 border font-semibold ${
                  points === 5 ? 'text-green-600' :
                  points === 3 ? 'text-yellow-600' :
                  points === 0 ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {points != null ? points : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: versão em cards */}
      <div className="md:hidden flex flex-col gap-4">
        {palpites.map(({ id, game, guessA, guessB, points }) => (
          <div key={id} className="bg-white border border-gray-300 rounded-lg shadow p-4 text-sm">
            <div className="font-semibold text-blue-900 mb-1">{game.teamA} x {game.teamB}</div>
            <div><span className="font-medium">Palpite:</span> <span className="text-blue-800 font-bold">{guessA} x {guessB}</span></div>
            <div>
              <span className="font-medium">Resultado:</span>{' '}
              {game.scoreA != null && game.scoreB != null
                ? `${game.scoreA} x ${game.scoreB}`
                : <span className="italic text-gray-500">Aguardando</span>}
            </div>
            <div>
              <span className="font-medium">Pontos:</span>{' '}
              <span className={`font-bold ${
                points === 5 ? 'text-green-600' :
                points === 3 ? 'text-yellow-600' :
                points === 0 ? 'text-red-600' :
                'text-gray-500'
              }`}>
                {points != null ? points : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center">
        <p><strong>Regras de pontuação:</strong></p>
        <ul className="mt-1">
          <li><span className="text-green-600 font-bold">5 pontos</span> — placar exato</li>
          <li><span className="text-yellow-600 font-bold">3 pontos</span> — vencedor correto</li>
          <li><span className="text-red-600 font-bold">0 pontos</span> — palpite errado</li>
        </ul>
      </div>
    </div>
  );
}
