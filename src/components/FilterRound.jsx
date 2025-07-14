import React, { useEffect, useState } from 'react';

const stageTraduzido = {
  'Round 1': 'Rodada 1',
  'Round 2': 'Rodada 2',
  'Round 3': 'Rodada 3',
  'Round 4': 'Rodada 4',
  'Round 5': 'Rodada 5',
  'Round 6': 'Rodada 6',
  'Round 7': 'Rodada 7',
  'Round 8': 'Rodada 8',
  'Round 9': 'Rodada 9',
  'Round 10': 'Rodada 10',
  'Round 11': 'Rodada 11',
  'Round 12': 'Rodada 12',
  'Round 13': 'Rodada 13',
  'Round 14': 'Rodada 14',
  'Round 15': 'Rodada 15',
  'Round 16': 'Rodada 16',
  'Round 17': 'Rodada 17',
  'Round 18': 'Rodada 18',
  'Round 19': 'Rodada 19',
  'Round 20': 'Rodada 20',
  'Quarter-finals': 'Quartas de Final',
  'Semi-finals': 'Semifinal',
  'Final': 'Final'
};

const ordemOficial = Object.keys(stageTraduzido);

export default function FiltroRodadas({ jogos, rodadaAtiva, onChange }) {
  const [rodadasDisponiveis, setRodadasDisponiveis] = useState([]);
  const [selecionado, setSelecionado] = useState(rodadaAtiva);

  useEffect(() => {
    const unicosStages = [...new Set(jogos.map(j => j.stage).filter(Boolean))];

    const ordenados = [...unicosStages].sort((a, b) => {
      const idxA = ordemOficial.indexOf(a);
      const idxB = ordemOficial.indexOf(b);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });

    setRodadasDisponiveis(ordenados);
  }, [jogos]);

  useEffect(() => {
    setSelecionado(rodadaAtiva);
  }, [rodadaAtiva]);

  const handleSelecionar = (e) => {
    const nova = e.target.value;
    setSelecionado(nova);
    onChange(nova);
  };

  return (
    <div className="mb-6 text-center">
      <label className="block mb-1 text-sm font-medium text-blue-800">
        Selecione a Rodada:
      </label>
      <select
        value={selecionado}
        onChange={handleSelecionar}
        className="border border-blue-300 rounded px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {rodadasDisponiveis.map(stage => (
          <option key={stage} value={stage}>
            {stageTraduzido[stage] || stage}
          </option>
        ))}
      </select>
    </div>
  );
}
