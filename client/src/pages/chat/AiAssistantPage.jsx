import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import { MessageSquarePlus, MessageCircle, ChevronLeft } from 'lucide-react';

export default function AiAssistantPage() {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);

  // 1. Fetch user farms for context selection
  const { data: farmsRes } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });
  const farms = farmsRes?.data || farmsRes || [];

  // 2. Fetch conversations list
  const { data: conversationsRes, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.getConversations(),
  });
  const conversations = conversationsRes?.data || conversationsRes || [];

  // Automatically select first conversation if available and none selected
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // 3. Fetch messages for selected conversation
  const { data: messagesRes, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => api.getMessages(activeConversationId),
    enabled: !!activeConversationId,
  });

  useEffect(() => {
    if (messagesRes) {
      const msgs = messagesRes?.data || messagesRes;
      setMessages(Array.isArray(msgs) ? msgs : []);
    }
  }, [messagesRes]);

  // 4. Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: () =>
      api.createConversation({
        title: `Crop Advisory ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
        farm_id: selectedFarmId || undefined,
      }),
    onSuccess: (res) => {
      const newConv = res?.data || res;
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (newConv?.id) {
        setActiveConversationId(newConv.id);
        setMessages([]);
      }
      setShowSidebar(false);
    },
    onError: (err) => {
      setErrorBanner(err?.message || 'Failed to start a new chat session.');
    },
  });

  // 5. Send message
  const sendMessageMutation = useMutation({
    mutationFn: ({ convId, text, language, farmId }) =>
      api.sendMessage(convId, {
        message: text,
        language: language || 'en',
        farm_id: farmId || selectedFarmId || undefined,
      }),
    onSuccess: (res) => {
      const responseData = res?.data || res;
      if (responseData) {
        if (responseData.reply || responseData.response || responseData.content) {
          const assistantMsg = {
            id: responseData.id || `ai-${Date.now()}`,
            role: 'assistant',
            content: responseData.reply || responseData.response || responseData.content,
            metadata: responseData.metadata,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['messages', activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => {
      setErrorBanner(err?.message || 'Failed to send message. Please retry.');
      // Remove optimistic message if needed
      setMessages((prev) => prev.filter((m) => !m._optimistic));
    },
  });

  const handleSendMessage = (text, language, farmId) => {
    setErrorBanner(null);

    // If no active conversation, create one first or handle immediately
    let targetConvId = activeConversationId;
    if (!targetConvId) {
      createConversationMutation.mutate(undefined, {
        onSuccess: (res) => {
          const newConv = res?.data || res;
          const convId = newConv?.id || `conv-${Date.now()}`;
          setActiveConversationId(convId);
          // Add optimistic message
          setMessages([
            {
              id: `user-${Date.now()}`,
              role: 'user',
              content: text,
              created_at: new Date().toISOString(),
              _optimistic: true,
            },
          ]);
          sendMessageMutation.mutate({ convId, text, language, farmId });
        },
      });
      return;
    }

    // Add optimistic user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, userMsg]);

    sendMessageMutation.mutate({ convId: targetConvId, text, language, farmId });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="AgriAssist AI Agricultural Chat"
        subtitle="Conversational agronomist assistant powered by Gemini 2.5 Flash for crop diagnosis, fertilizer scheduling, and pest protection."
      />

      {errorBanner && (
        <AlertBanner type="error" message={errorBanner} onDismiss={() => setErrorBanner(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: Conversations */}
        <div
          className={`${
            showSidebar ? 'block' : 'hidden'
          } md:block md:col-span-1 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Conversations</h3>
            <button
              type="button"
              onClick={() => createConversationMutation.mutate()}
              disabled={createConversationMutation.isPending}
              className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
              title="New Discussion"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {loadingConversations ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">
                <MessageCircle className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
                No chat history yet. Ask a question to begin!
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    activeConversationId === conv.id
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate flex-1">{conv.title || 'Crop Consultation'}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div className="md:col-span-3">
          {/* Mobile Back to Sessions Toggle */}
          <div className="md:hidden mb-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-xs font-semibold text-green-700 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {showSidebar ? 'Close Sessions List' : 'View Conversation Sessions'}
            </button>
          </div>

          <ChatWindow
            messages={messages}
            farms={farms}
            selectedFarmId={selectedFarmId}
            onSelectFarm={setSelectedFarmId}
            onSendMessage={handleSendMessage}
            isLoading={loadingMessages || sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
