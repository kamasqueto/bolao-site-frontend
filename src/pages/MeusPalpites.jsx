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
          headers: { Authorization: `Bearer ${token}` }
        });
        setPalpites(res.data);
      } catch (err) {
        console.error('Erro ao carregar palpites:', err);
        setMensagem('Erro ao carregar palpites.');
      }
    }

    carregarPalpites();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Meus Palpites</h1>
      {mensagem && <div className="text-red-600">{mensagem}</div>}

      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Jogo</th>
            <th className="border p-2">Palpite</th>
            <th className="border p-2">Resultado</th>
            <th className="border p-2">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {palpites.map(({ id, game, guessA, guessB, points }) => (
            <tr key={id}>
              <td className="border p-2 text-center">{game.teamA} x {game.teamB}</td>
              <td className="border p-2 font-semibold text-blue-800 text-center">{guessA} x {guessB}</td>
              <td className="border p-2 text-center">
                {game.scoreA != null && game.scoreB != null
                  ? `${game.scoreA} x ${game.scoreB}`
                  : 'Aguardando'}
              </td>
              <td className="border p-2 text-center font-medium text-green-600">{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
