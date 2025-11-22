import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number; // 0 to 1
  level: RiskLevel;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level }) => {
  // Convert 0-1 score to percentage for display
  const percentage = Math.round(score * 100);

  // Data for the gauge (background track vs value)
  const data = [
    { name: 'Điểm', value: percentage },
    { name: 'Còn lại', value: 100 - percentage },
  ];

  const getColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case RiskLevel.HIGH: return '#ef4444'; // Red-500
      case RiskLevel.MEDIUM: return '#f97316'; // Orange-500
      case RiskLevel.LOW: return '#22c55e'; // Green-500
      default: return '#94a3b8';
    }
  };

  const activeColor = getColor(level);
  const trackColor = '#e2e8f0'; // Slate-200

  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={activeColor} cornerRadius={10} />
            <Cell key="cell-1" fill={trackColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Centered Text Overlay */}
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-800">
          {percentage}
          <span className="text-xl text-slate-400">%</span>
        </span>
        <span className={`text-sm font-semibold uppercase tracking-wider mt-1`} style={{ color: activeColor }}>
          Điểm rủi ro
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;