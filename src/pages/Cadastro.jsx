import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null); // 'sucesso' | 'erro'
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem(null);
    setTipoMensagem(null);

    try {
      await api.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      setTipoMensagem('sucesso');
      setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2000); // delay para visualização
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response.data?.error === 'Usuário já cadastrado'
      ) {
        setTipoMensagem('erro');
        setMensagem('E-mail já cadastrado. Tente outro.');
      } else {
        setTipoMensagem('erro');
        setMensagem('Erro ao cadastrar. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Criar Conta</h2>

        {/* MENSAGEM DE FEEDBACK */}
        {mensagem && (
          <div
            className={`mb-4 px-4 py-2 text-sm rounded ${
              tipoMensagem === 'sucesso'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {mensagem}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full px-4 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-blue-700">
          Já tem conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="hover:underline font-semibold"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
