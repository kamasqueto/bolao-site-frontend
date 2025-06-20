// src/pages/Jogos.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarJogos() {
      try {
        const res = await axios.get('https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=4503&s=2025');
        setJogos(res.data.events || []);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar jogos');
      }
    }

    carregarJogos();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">📅 Jogos do Mundial de Clubes 2025</h1>
      {erro && <p className="text-red-600 text-center">{erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jogos.map((jogo) => (
          <div key={jogo.idEvent} className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">
              {jogo.strStage} • {dayjs(jogo.dateEvent).format('DD/MM/YYYY')} às {jogo.strTime?.slice(0, 5)}
            </p>
            <h2 className="text-lg font-semibold text-gray-800 mt-1">
              {jogo.strHomeTeam} <span className="text-gray-500">vs</span> {jogo.strAwayTeam}
            </h2>
            {jogo.intHomeScore !== null && jogo.intAwayScore !== null && (
              <p className="text-green-700 mt-2 font-bold">
                Placar: {jogo.intHomeScore} x {jogo.intAwayScore}
              </p>
            )}
            {jogo.strVenue && (
              <p className="text-sm text-gray-600 mt-1">Estádio: {jogo.strVenue}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
