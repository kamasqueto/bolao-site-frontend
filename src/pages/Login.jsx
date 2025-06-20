import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setTipoMensagem('erro');
      if (err.response?.status === 401) {
        setMensagem('E-mail ou senha inválidos.');
      } else {
        setMensagem('Erro ao realizar login. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Entrar no Bolão</h2>

        {/* MENSAGEM DE ERRO OU SUCESSO */}
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

        <form onSubmit={handleLogin} className="space-y-4">
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
            Entrar
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-blue-700">
          <button
            onClick={() => setMensagem("Funcionalidade de recuperação em breve.")}
            className="hover:underline"
          >
            Esqueci minha senha
          </button>
          <button
            onClick={() => navigate('/cadastro')}
            className="hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}
