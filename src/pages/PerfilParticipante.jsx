import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
const API_URL = import.meta.env.VITE_API_URL;

export default function PerfilParticipante() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(res.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setErro('Erro ao carregar perfil do participante');
      }
    }

    carregarPerfil();
  }, [id]);

  if (erro) {
    return <p className="text-red-600 text-center mt-6">{erro}</p>;
  }

  if (!perfil) {
    return <p className="text-center mt-6">Carregando perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        Perfil de {perfil.usuario.name || perfil.usuario.email}
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-lg font-semibold">
          Ranking: <span className="text-blue-700">{perfil.ranking}º lugar</span>
        </p>
        <p className="text-lg font-semibold">
          Total de Pontos: <span className="text-green-600">{perfil.totalPontos}</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Participante desde: {dayjs(perfil.usuario.createdAt).format('DD/MM/YYYY')}
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Palpites Realizados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {perfil.palpites.map((p) => (
          <div key={p.id} className="border p-3 rounded shadow bg-white">
            <p className="font-semibold text-gray-700">
              {p.jogo.teamA} x {p.jogo.teamB}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Data: {dayjs(p.jogo.date).format('DD/MM/YYYY HH:mm')}
            </p>
            <p className="text-sm">
              Palpite: <span className="font-medium">{p.guessA} x {p.guessB}</span>
            </p>
            {p.jogo.status === 'completed' && (
              <p className="text-sm text-green-700 mt-1">
                Pontos: <span className="font-bold">{p.pontos}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
