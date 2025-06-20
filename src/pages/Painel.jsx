import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminResultados() {
  useAuthRedirect();
  const [jogos, setJogos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
  async function carregarJogos() {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`${API_URL}/api/admin/jogos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJogos(res.data);
    } catch (err) {
      console.error('Erro ao carregar jogos:', err);
    }
  }

  carregarJogos();
}, []);


  const atualizarPlacar = async (id, scoreA, scoreB) => {
    try {
      await axios.put(`${API_URL}/api/admin/jogos${id}`, {
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      setMensagem('Placar atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar placar:', err);
      setMensagem('Erro ao atualizar placar.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Administração de Resultados</h1>
        {mensagem && (
          <div className="mb-4 text-center text-green-600 font-semibold">
            {mensagem}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-blue-200">
              <tr>
                <th className="border p-2">Time A</th>
                <th className="border p-2">Placar A</th>
                <th className="border p-2">Placar B</th>
                <th className="border p-2">Time B</th>
                <th className="border p-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {jogos.map((jogo) => (
                <tr key={jogo.id} className="text-center">
                  <td className="border p-2 font-medium text-blue-800">{jogo.teamA}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      defaultValue={jogo.scoreA ?? ''}
                      onChange={(e) => (jogo.scoreA = e.target.value)}
                      className="w-16 border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      defaultValue={jogo.scoreB ?? ''}
                      onChange={(e) => (jogo.scoreB = e.target.value)}
                      className="w-16 border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border p-2 font-medium text-blue-800">{jogo.teamB}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => atualizarPlacar(jogo.id, jogo.scoreA, jogo.scoreB)}
                      className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800"
                    >
                      Atualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
