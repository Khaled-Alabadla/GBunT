import { useState, useRef, useEffect } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const conversationHistoryRef = useRef([]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 0 || streamingMessage) {
      scrollToBottom();
    }
  }, [messages, streamingMessage]);

  const sendMessage = async (message, language) => {
    setIsLoading(true);
    setStreamingMessage('');
    
    const userMessage = { role: 'user', content: message, language };
    setMessages(prev => [...prev, userMessage]);
    conversationHistoryRef.current = [...conversationHistoryRef.current, userMessage].slice(-10);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistoryRef.current,
          language
        })
      });

      if (!response.ok) throw new Error('Network error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'chunk') {
              assistantMessage += data.content;
              setStreamingMessage(assistantMessage);
            } else if (data.type === 'done') {
              const finalMessage = { role: 'assistant', content: assistantMessage, language };
              setMessages(prev => [...prev, finalMessage]);
              conversationHistoryRef.current = [...conversationHistoryRef.current, finalMessage].slice(-10);
              setStreamingMessage('');
            } else if (data.type === 'off_topic') {
              setMessages(prev => [...prev, { role: 'assistant', content: data.message, language }]);
              setStreamingMessage('');
            } else if (data.type === 'error') {
              setMessages(prev => [...prev, { role: 'assistant', content: data.message, language }]);
              setStreamingMessage('');
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error: Could not connect to server', language };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    streamingMessage,
    chatEndRef,
    messagesContainerRef,
    sendMessage
  };
}
