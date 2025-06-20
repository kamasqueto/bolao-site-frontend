import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMedal, FaUserCircle } from 'react-icons/fa';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import {Link} from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Ranking() {
  useAuthRedirect();
  const [ranking, setRanking] = useState([]);
  const [erro, setErro] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function carregarRanking() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/ranking`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRanking(res.data);
        console.log(setRanking)

        // Identifica o usuário logado
        const user = JSON.parse(localStorage.getItem('user'));
        const posicao = res.data.findIndex((r) => r.userId === user?.id);
        if (posicao !== -1) {
          setMe({
            nome: user?.name || user?.email,
            pontos: res.data[posicao].points,
            posicao: posicao + 1
          });
        }

      } catch (err) {
        console.error('Erro ao carregar ranking:', err);
        setErro('Erro ao carregar ranking');
      }
    }

    carregarRanking();
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

      {/* 🧑‍💼 RESUMO DO USUÁRIO */}
      {me && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center shadow">
          <h2 className="text-xl font-semibold text-blue-800 mb-1">Seu Desempenho</h2>
          <p className="text-lg">
            Você está na <span className="font-bold text-blue-900">{me.posicao}ª posição</span> com{' '}
            <span className="font-bold text-green-700">{me.pontos} pontos</span>.
          </p>
        </div>
      )}

      {/* TABELA DO RANKING */}
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
                <td className="px-4 py-3 font-medium text-gray-800"><Link to={`/perfil/${item.id}`}>{item.name}</Link></td>
                <td className="px-4 py-3 text-green-700 font-bold">{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
