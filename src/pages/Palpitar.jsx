import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import api from '../hooks/axios.js'
const API_URL = import.meta.env.VITE_API_URL;

export default function Palpitar() {
  useAuthRedirect();
  const [jogos, setJogos] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [placares, setPlacares] = useState({});
  const [palpites, setPalpites] = useState({});
  const [palpitesOutros, setPalpitesOutros] = useState({});

  useEffect(() => {
    async function carregarJogos() {
      try {
        const token = localStorage.getItem('token');

        const [resJogos, resPalpites, resOutros] = await Promise.all([
          api.get(`/api/games`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/guesses/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/guesses/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const jogosOrdenados = resJogos.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setJogos(jogosOrdenados);

        const palpitesMap = {};
        const placaresMap = {};
        resPalpites.data.forEach(p => {
          palpitesMap[p.gameId] = p;
          placaresMap[p.gameId] = {
            scoreA: p.guessA,
            scoreB: p.guessB,
          };
        });

        const outrosMap = {};
        resOutros.data.forEach(p => {
          if (!outrosMap[p.gameId]) outrosMap[p.gameId] = [];
          outrosMap[p.gameId].push(p);
        });

        setPalpites(palpitesMap);
        setPlacares(placaresMap);
        setPalpitesOutros(outrosMap);
      } catch (err) {
        console.error('Erro ao carregar jogos:', err);
      }
    }

    carregarJogos();
  }, []);

  const handleChange = (jogoId, campo, valor) => {
    setPlacares(prev => ({
      ...prev,
      [jogoId]: {
        ...prev[jogoId],
        [campo]: valor,
      },
    }));
  };

  const enviarPalpite = async (jogoId) => {
  try {
    const token = localStorage.getItem('token');
    const { scoreA, scoreB } = placares[jogoId] || {};

    const resExistente = await api.get(`/api/guesses/mine/${jogoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resExistente.data) {
      // Atualiza palpite existente
      console.log(resExistente.data);
      await api.put(`/api/guesses/${resExistente.data.id}`, {
        guessA: Number(scoreA),
        guessB: Number(scoreB),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagens(prev => ({ ...prev, [jogoId]: 'Palpite atualizado com sucesso!' }));
    } else {
      // Cria novo palpite
      await api.post(`/api/guesses`, {
        gameId: jogoId,
        guessA: Number(scoreA),
        guessB: Number(scoreB),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagens(prev => ({ ...prev, [jogoId]: 'Palpite salvo com sucesso!' }));
    }
  } catch (err) {
    console.error('Erro ao enviar palpite:', jogoId ,err);
    setMensagens(prev => ({ ...prev, [jogoId]: 'Erro ao salvar palpite.' }));
  }
};


  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Faça seus palpites</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jogos.map(jogo => {
          const dataJogo = dayjs(jogo.date);
          const agora = dayjs();
          const jogoIniciado = agora.isAfter(dataJogo.subtract(10, 'minutes'));

          return (
            <div key={jogo.id} className="border p-4 rounded shadow bg-white">
              <div className="text-sm text-gray-500 text-center mb-2">
                {dataJogo.format('DD/MM/YYYY [às] HH:mm')}<br />
                {jogo.status === 'in_progress'
                  ? 'Em andamento'
                  : jogo.status === 'completed'
                  ? 'Finalizado'
                  : 'Agendado'}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <img src={`/escudos/${jogo.teamA}.png`} alt={jogo.teamA} className="w-12 h-12 mx-auto" />
                  <p className="font-semibold">{jogo.teamA}</p>
                </div>

                <div className="flex gap-2 items-center">
  {jogo.status === 'completed' ? (
    <div className="text-3xl font-bold">
      {jogo.scoreA} x {jogo.scoreB}
    </div>
  ) : (
    <>
      <input
        type="number"
        className="w-12 h-12 text-center border rounded"
        value={placares[jogo.id]?.scoreA ?? ''}
        onChange={e => handleChange(jogo.id, 'scoreA', e.target.value)}
        disabled={jogoIniciado}
      />
      <span className="font-bold">x</span>
      <input
        type="number"
        className="w-12 h-12 text-center border rounded"
        value={placares[jogo.id]?.scoreB ?? ''}
        onChange={e => handleChange(jogo.id, 'scoreB', e.target.value)}
        disabled={jogoIniciado}
      />
    </>
  )}
</div>


                <div className="text-center">
                  <img src={`/escudos/${jogo.teamB}.png`} alt={jogo.teamB} className="w-12 h-12 mx-auto" />
                  <p className="font-semibold">{jogo.teamB}</p>
                </div>
              </div>

              {jogo.status !== 'completed' && (
  <div className="flex justify-center">
    <button
      onClick={() => enviarPalpite(jogo.id)}
      className={`px-4 py-1 rounded text-white ${jogoIniciado ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
      disabled={jogoIniciado}
    >
      {palpites[jogo.id] ? 'Atualizar Palpite' : 'Enviar Palpite'}
    </button>
  </div>
)}


              {mensagens[jogo.id] && (
                <p className="text-sm text-green-600 text-center mt-2">
                  {mensagens[jogo.id]}
                </p>
              )}

              {jogoIniciado && palpitesOutros[jogo.id] && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-sm text-gray-700 font-semibold mb-1">Palpites dos outros jogadores:</p>
                  <ul className="text-sm text-gray-600 max-h-24 overflow-y-auto">
                    {palpitesOutros[jogo.id].map(p => (
                      <li key={p.id} className="flex justify-between border-b py-1">
                        <span>{p.user.name || p.user.email}</span>
                        <span>{p.guessA} x {p.guessB}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
