import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarJogos() {
      try {
        const response = await axios.get(
          'https://api.football-data.org/v4/competitions/BSA/matches',
          {
            headers: {
              'X-Auth-Token': import.meta.env.VITE_FOOTBALL_DATA_API_KEY
            }
          }
        );

        // Filtrar da rodada atual em diante
        const todas = response.data.matches;
        const rodadaAtual = todas.find((j) => j.status === 'SCHEDULED')?.matchday || 1;
        const futuras = todas.filter((j) => j.matchday >= rodadaAtual);

        setJogos(futuras);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar os jogos da API.');
      } finally {
        setCarregando(false);
      }
    }

    buscarJogos();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        ⚽ Próximos Jogos do Brasileirão 2025
      </h1>

      {carregando && <p className="text-center text-gray-500">Carregando...</p>}
      {erro && <p className="text-red-600 text-center">{erro}</p>}
      {!carregando && jogos.length === 0 && !erro && (
        <p className="text-center text-gray-600">Nenhum jogo encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jogos.map((jogo) => (
          <div key={jogo.id} className="bg-white shadow rounded p-4">
            <p className="text-sm text-gray-500">
              Rodada {jogo.matchday} • {dayjs(jogo.utcDate).format('DD/MM/YYYY')} às{' '}
              {dayjs(jogo.utcDate).format('HH:mm')}
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-1">
              {jogo.homeTeam.name} <span className="text-gray-500">vs</span> {jogo.awayTeam.name}
            </h2>

            {jogo.status === 'FINISHED' ? (
              <p className="text-green-700 mt-2 font-bold">
                Placar: {jogo.score.fullTime.home} x {jogo.score.fullTime.away}
              </p>
            ) : (
              <p className="text-yellow-600 mt-2">Agendado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
