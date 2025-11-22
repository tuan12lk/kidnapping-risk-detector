import React, { useState } from 'react';
import { analyzeTextRisk } from './services/geminiService';
import { RiskAnalysisResult } from './types';
import ResultCard from './components/ResultCard';

const SAMPLE_TEXT = `Một người đàn ông lạ mặt bảo em bé lên xe,
nói rằng bố mẹ nhờ chú đến đón và liên tục ép đi chỗ khác.`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeTextRisk(inputText);
      setResult(data);
    } catch (err) {
      setError("Không thể phân tích văn bản. Vui lòng kiểm tra kết nối hoặc thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const loadSample = () => {
    setInputText(SAMPLE_TEXT);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">GuardianEye</h1>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
             Sử dụng Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Intro Section */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Công cụ phát hiện nguy cơ bắt cóc</h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Phân tích văn bản để phát hiện các mối đe dọa tiềm tàng, hành vi dụ dỗ hoặc chiến thuật cô lập bằng cách sử dụng logic kết hợp từ khóa và embedding.
          </p>
        </section>

        {/* Input Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="risk-input" className="block text-sm font-semibold text-slate-700">
              Nội dung hội thoại hoặc tin nhắn
            </label>
            <button 
              onClick={loadSample}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
            >
              Tải văn bản mẫu
            </button>
          </div>
          <div className="relative">
            <textarea
              id="risk-input"
              className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-slate-800 placeholder:text-slate-400"
              placeholder="Ví dụ: Một người lạ mặt đứng trước cổng trường dụ em bé lên xe, nói là bố mẹ nhờ đến đón..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            {inputText && !isLoading && (
               <button 
                  onClick={handleClear}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  title="Xóa nội dung"
               >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-md
                ${isLoading || !inputText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Phân tích rủi ro
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in">
             <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <ResultCard result={result} />
        )}

      </main>
    </div>
  );
};

export default App;