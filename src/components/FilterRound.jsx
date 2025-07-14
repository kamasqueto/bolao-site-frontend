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
  'Final': 'Final',
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

  const handleSelecionar = (stage) => {
    setSelecionado(stage);
    onChange(stage);
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap pb-3">
      <div className="inline-flex gap-2">
        {rodadasDisponiveis.map(stage => (
          <button
            key={stage}
            className={`px-3 py-1 rounded-full border font-medium text-sm transition duration-200 whitespace-nowrap
              ${selecionado === stage
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}
            `}
            onClick={() => handleSelecionar(stage)}
            aria-pressed={selecionado === stage}
          >
            {stageTraduzido[stage] || stage}
          </button>
        ))}
      </div>
    </div>
  );
}
