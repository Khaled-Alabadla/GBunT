import { useLanguage } from './hooks/useLanguage';
import { useChat } from './hooks/useChat';
import ChatWindow from './components/ChatWindow';
import LanguageToggle from './components/LanguageToggle';

export default function App() {
  const { language, t, toggleLanguage } = useLanguage();
  const { messages, isLoading, streamingMessage, chatEndRef, messagesContainerRef, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        streamingMessage={streamingMessage}
        chatEndRef={chatEndRef}
        messagesContainerRef={messagesContainerRef}
        onSendMessage={sendMessage}
        t={t}
        language={language}
        onLanguageToggle={toggleLanguage}
      />
    </div>
  );
}
