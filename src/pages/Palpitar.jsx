import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import api from '../hooks/axios.js';
import CardJogo from '../components/CardJogo';
import FiltroRodadas from '../components/FilterRound.jsx';

export default function Palpitar() {
  useAuthRedirect();
  const [jogos, setJogos] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [placares, setPlacares] = useState({});
  const [palpites, setPalpites] = useState({});
  const [palpitesOutros, setPalpitesOutros] = useState({});
  const [rodadaAtual, setRodadaAtual] = useState('');

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

        const hoje = dayjs();
        const rodadaHoje = jogosOrdenados.find(j => dayjs(j.date).isAfter(hoje.subtract(1, 'day')))?.stage || '';
        setRodadaAtual(rodadaHoje);
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
        await api.put(`/api/guesses/${resExistente.data.id}`, {
          guessA: Number(scoreA),
          guessB: Number(scoreB),
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagens(prev => ({ ...prev, [jogoId]: 'Palpite atualizado com sucesso!' }));
      } else {
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
      console.error('Erro ao enviar palpite:', jogoId, err);
      setMensagens(prev => ({ ...prev, [jogoId]: 'Erro ao salvar palpite.' }));
    }
  };

  const jogosFiltrados = jogos.filter(j => j.stage === rodadaAtual);

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Faça seus palpites</h2>

      <FiltroRodadas
        jogos={jogos}
        rodadaAtiva={rodadaAtual}
        onChange={setRodadaAtual}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jogosFiltrados.map(jogo => {
          const dataJogo = dayjs(jogo.date);
          const agora = dayjs();
          const jogoIniciado = agora.isAfter(dataJogo.subtract(10, 'minutes'));

          return (
            <CardJogo
              key={jogo.id}
              jogo={jogo}
              placares={placares}
              palpites={palpites}
              palpitesOutros={palpitesOutros}
              mensagens={mensagens}
              jogoIniciado={jogoIniciado}
              handleChange={handleChange}
              enviarPalpite={enviarPalpite}
            />
          );
        })}
      </div>
    </div>
  );
}
