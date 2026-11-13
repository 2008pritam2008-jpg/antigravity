// client/src/components/chat/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage.jsx';
import { Send, Sparkles, MapPin, Globe, Loader2 } from 'lucide-react';

export function ChatWindow({
  messages = [],
  farms = [],
  selectedFarmId,
  onSelectFarm,
  onSendMessage,
  isLoading = false,
}) {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim(), language, selectedFarmId);
    setInputText('');
  };

  const sampleQuestions = [
    'Why are my crop leaves turning yellow?',
    'What fertilizer is recommended for wheat at crown root initiation?',
    'How do I manage stem borer in cotton organically?',
    'What is the optimal sowing window for Rabi gram in Maharashtra?',
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header Context Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest-900 text-agri-leaf flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">AgriAssist AI Assistant</h3>
            <p className="text-[11px] text-gray-500">Multilingual Agronomic Dialog Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Farm Context Selector */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-agri-green" />
            <select
              value={selectedFarmId || ''}
              onChange={(e) => onSelectFarm && onSelectFarm(e.target.value)}
              className="bg-transparent border-none text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">General Knowledge (No Farm Context)</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  Context: {f.farm_name} ({f.district})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-gray-200 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-900 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">How can I assist your farm today?</h4>
            <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">
              Ask any question about crop selection, leaf discoloration, fertilizer dosing, or weather interventions.
            </p>

            <div className="w-full space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Suggested Inquiries:
              </span>
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(q)}
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-white hover:border-agri-green text-xs text-gray-700 transition"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                onFollowUpClick={(q) => {
                  setInputText(q);
                }}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 py-3 pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-agri-green" />
                <span>AgriAssist is consulting agronomic references and formulating guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            selectedFarmId
              ? "Ask a question contextualized to your selected farm..."
              : "Type your agricultural query in natural language..."
          }
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;


