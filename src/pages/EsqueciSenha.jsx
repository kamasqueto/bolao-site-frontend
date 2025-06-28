import React, { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import api from '../hooks/axios.js';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);
    try {
      const res = await api.post(`/api/auth/forgot-password`, {
        email,
      });
      setTipoMensagem('sucesso');
      setMensagem(res.data.message || 'Verifique seu e-mail para redefinir sua senha.');
    } catch (err) {
      setTipoMensagem('erro');
      setMensagem(
        err.response?.data?.message || 'Erro ao solicitar redefinição de senha.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Esqueci minha senha
        </h2>

        {mensagem && (
          <div
            className={`mb-4 px-4 py-2 text-sm rounded ${
              tipoMensagem === 'erro'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}
          >
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
          >
            Enviar link de recuperação
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-blue-700 hover:underline">
            Voltar para login
          </a>
        </div>
      </div>
    </div>
  );
}
