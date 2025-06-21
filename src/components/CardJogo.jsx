import React from 'react';
import dayjs from 'dayjs';

export default function CardJogo({
  jogo,
  placares,
  handleChange,
  enviarPalpite,
  palpites,
  mensagens,
  palpitesOutros,
  jogoIniciado,
}) {
  const dataJogo = dayjs(jogo.date);

  return (
    <div className="border p-4 rounded shadow bg-white w-full min-w-[300px] max-w-full overflow-hidden">
      {/* Data e status */}
      <div className="text-sm text-gray-500 text-center mb-2">
        {dataJogo.format('DD/MM/YYYY [às] HH:mm')}
        <br />
        {jogo.status === 'in_progress'
          ? 'Em andamento'
          : jogo.status === 'completed'
          ? 'Finalizado'
          : 'Agendado'}
      </div>

      {/* Times e placar */}
      <div className="flex justify-between items-center gap-4 mb-4 text-center">
        {/* Time A */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <img
            src={`/escudos/${jogo.teamA}.png`}
            alt={jogo.teamA}
            className="w-14 h-14 object-contain mb-1"
          />
          <p className="text-sm font-semibold text-center leading-tight min-h-[2.5rem]">
            {jogo.teamA}
          </p>
        </div>

        {/* Placar ou inputs */}
        <div className="flex items-center justify-center gap-2 w-24 flex-shrink-0 text-lg font-bold">
          {jogo.status === 'completed' ? (
            <div>{jogo.scoreA} x {jogo.scoreB}</div>
          ) : (
            <>
              <input
                type="number"
                className="w-10 h-10 text-center border rounded"
                value={placares[jogo.id]?.scoreA ?? ''}
                onChange={e => handleChange(jogo.id, 'scoreA', e.target.value)}
                disabled={jogoIniciado}
              />
              <span>x</span>
              <input
                type="number"
                className="w-10 h-10 text-center border rounded"
                value={placares[jogo.id]?.scoreB ?? ''}
                onChange={e => handleChange(jogo.id, 'scoreB', e.target.value)}
                disabled={jogoIniciado}
              />
            </>
          )}
        </div>

        {/* Time B */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <img
            src={`/escudos/${jogo.teamB}.png`}
            alt={jogo.teamB}
            className="w-14 h-14 object-contain mb-1"
          />
          <p className="text-sm font-semibold text-center leading-tight min-h-[2.5rem]">
            {jogo.teamB}
          </p>
        </div>
      </div>

      {/* Botão de palpite */}
      {jogo.status !== 'completed' && (
        <div className="flex justify-center">
          <button
            onClick={() => enviarPalpite(jogo.id)}
            className={`px-4 py-1 rounded text-white ${
              jogoIniciado
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
            disabled={jogoIniciado}
          >
            {palpites[jogo.id] ? 'Atualizar Palpite' : 'Enviar Palpite'}
          </button>
        </div>
      )}

      {/* Mensagem de feedback */}
      {mensagens[jogo.id] && (
        <p className="text-sm text-green-600 text-center mt-2">
          {mensagens[jogo.id]}
        </p>
      )}

      {/* Palpites dos outros jogadores */}
      {jogoIniciado && palpitesOutros[jogo.id] && (
        <div className="mt-4 border-t pt-3">
          <p className="text-sm text-gray-700 font-semibold mb-1">
            Palpites dos outros jogadores:
          </p>
          <ul className="text-sm text-gray-600 max-h-24 overflow-y-auto">
            {palpitesOutros[jogo.id].map(p => (
              <li
                key={p.id}
                className="flex justify-between border-b py-1"
              >
                <span className="truncate">{p.user.name || p.user.email}</span>
                <span>{p.guessA} x {p.guessB}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
