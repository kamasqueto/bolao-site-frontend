import React, { useEffect, useState } from 'react';
import { FaMedal, FaUserCircle } from 'react-icons/fa';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { Link } from "react-router-dom";
import api from '../hooks/axios.js';

export default function Ranking() {
  useAuthRedirect();

  const [ranking, setRanking] = useState([]);
  const [erro, setErro] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [rankingRes, userRes] = await Promise.all([
          api.get('/api/guesses/ranking'),
          api.get('/api/auth/me'),
        ]);

        const dadosRanking = rankingRes.data;
        const usuarioLogado = userRes.data;

        setRanking(dadosRanking);

        const posicao = dadosRanking.findIndex(r => r.userId === usuarioLogado.id);
        if (posicao !== -1) {
          setMe({
            nome: usuarioLogado.name || usuarioLogado.email,
            pontos: dadosRanking[posicao].points,
            posicao: posicao + 1
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do ranking:', error);
        setErro('Erro ao carregar ranking. Tente novamente mais tarde.');
      }
    }

    carregarDados();
  }, []);

  const getMedalha = (index) => {
    if (index === 0) return <FaMedal className="text-yellow-400 text-xl" title="1º lugar" />;
    if (index === 1) return <FaMedal className="text-gray-400 text-xl" title="2º lugar" />;
    if (index === 2) return <FaMedal className="text-amber-700 text-xl" title="3º lugar" />;
    return <FaUserCircle className="text-blue-400 text-xl" title={`${index + 1}º lugar`} />;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">🏆 Ranking do Bolão</h1>
      {erro && <p className="text-red-600 text-center">{erro}</p>}

      {/* 🧑‍💼 Seu desempenho */}
      {me && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center shadow">
          <h2 className="text-xl font-semibold text-blue-800 mb-1">Seu Desempenho</h2>
          <p className="text-lg">
            Você está na <span className="font-bold text-blue-900">{me.posicao}ª posição</span> com{' '}
            <span className="font-bold text-green-700">{me.pontos} pontos</span>.
          </p>
        </div>
      )}

      {/* 🏅 Tabela do ranking geral */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Posição</th>
              <th className="px-4 py-2">Participante</th>
              <th className="px-4 py-2">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 text-lg font-bold">
                    <span>{index + 1}º</span>
                    {getMedalha(index)}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  <Link to={`/perfil/${item.id}`}>{item.name}</Link>
                </td>
                <td className="px-4 py-3 text-green-700 font-bold">{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
