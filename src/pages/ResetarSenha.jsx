import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function ResetarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (password !== confirmarPassword) {
      setTipoMensagem('erro');
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, {
        password,
      });

      setTipoMensagem('sucesso');
      setMensagem(res.data.message || 'Senha redefinida com sucesso!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setTipoMensagem('erro');
      setMensagem(
        err.response?.data?.message || 'Erro ao redefinir senha. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Redefinir Senha</h2>

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
            type="password"
            placeholder="Nova senha"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className="w-full px-4 py-2 border rounded"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
          >
            Redefinir senha
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-700 hover:underline"
          >
            Voltar para login
          </button>
        </div>
      </div>
    </div>
  );
}
