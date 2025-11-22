import React from 'react';
import { RiskAnalysisResult, RiskLevel } from '../types';
import RiskGauge from './RiskGauge';

interface ResultCardProps {
  result: RiskAnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getHeaderStyle = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '🚨', label: 'CAO' };
      case RiskLevel.MEDIUM:
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '⚠️', label: 'TRUNG BÌNH' };
      case RiskLevel.LOW:
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '🛡️', label: 'THẤP' };
    }
  };

  const style = getHeaderStyle(result.risk_level);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
      <div className={`px-6 py-4 border-b ${style.bg} ${style.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{style.icon}</span>
          <h2 className={`text-lg font-bold uppercase tracking-wide ${style.text}`}>
            Phát hiện rủi ro {style.label}
          </h2>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="col-span-1">
          <RiskGauge score={result.risk_score} level={result.risk_level} />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Phân tích AI
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed font-medium">
              {result.reasoning}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Phân tích này được tạo bởi AI. Nếu bạn tin rằng một đứa trẻ đang gặp nguy hiểm ngay lập tức, hãy liên hệ với chính quyền địa phương ngay lập tức.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;