import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const stageTraduzido = {
  'Round 1': 'Rodada 1',
  'Round 2': 'Rodada 2',
  'Round 3': 'Rodada 3',
  'Round of 16' : 'Oitavas de Final',
  'Quarter-finals': 'Quartas de Final',
  'Semi-finals': 'Semifinal',
  'Final': 'Final'
};

export default function FiltroRodadas({ jogos, rodadaAtiva, onChange }) {
  const [rodadasDisponiveis, setRodadasDisponiveis] = useState([]);
  const [selecionado, setSelecionado] = useState(rodadaAtiva);

  useEffect(() => {
    const unicosStages = [...new Set(jogos.map(j => j.stage))];
    const ordenados = unicosStages.sort((a, b) => {
      const ordem = ['Round 1', 'Round 2', 'Round 3', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'];
      return ordem.indexOf(a) - ordem.indexOf(b);
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
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {rodadasDisponiveis.map(stage => (
        <button
          key={stage}
          className={`px-3 py-1 rounded-full border font-medium text-sm transition ${
            selecionado === stage ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border-blue-700'
          }`}
          onClick={() => handleSelecionar(stage)}
        >
          {stageTraduzido[stage] || stage}
        </button>
      ))}
    </div>
  );
}
