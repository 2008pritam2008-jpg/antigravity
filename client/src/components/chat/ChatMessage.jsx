// client/src/components/chat/ChatMessage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Sparkles, AlertCircle } from 'lucide-react';

export function ChatMessage({ message, onFollowUpClick }) {
  const isUser = message.role === 'user';
  const meta = message.metadata || {};

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
          isUser
            ? 'bg-forest-900 text-white'
            : 'bg-emerald-100 text-forest-900 border border-emerald-200'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-forest-900 text-white rounded-tr-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
        }`}
      >
        {!isUser && meta.topic && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-agri-leaf block mb-1">
            {meta.topic}
          </span>
        )}

        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:my-1 prose-ul:my-1">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Structured metadata widgets for Assistant messages */}
        {!isUser && meta.key_points?.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs">
            <span className="font-bold text-gray-700 block mb-1">Key Takeaways:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
              {meta.key_points.map((kp, idx) => (
                <li key={idx}>{kp}</li>
              ))}
            </ul>
          </div>
        )}

        {!isUser && meta.warnings?.length > 0 && (
          <div className="mt-2.5 p-2 bg-amber-50 rounded-lg text-amber-900 text-xs border border-amber-200/60 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{meta.warnings.join(' ')}</span>
          </div>
        )}

        {!isUser && meta.follow_up_question && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => onFollowUpClick && onFollowUpClick(meta.follow_up_question)}
              className="text-left text-xs font-semibold text-agri-green hover:text-forest-900 flex items-center gap-1.5 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-agri-leaf group-hover:rotate-12 transition-transform" />
              <span>Suggested Next Question: "{meta.follow_up_question}"</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;


