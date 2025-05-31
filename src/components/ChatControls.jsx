import { useState, useEffect } from 'react';

const ChatControls = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Chatbase is loaded
    const checkLoaded = setInterval(() => {
      if (window.chatbase) {
        setIsLoaded(true);
        clearInterval(checkLoaded);
      }
    }, 100);

    return () => clearInterval(checkLoaded);
  }, []);

  // Sync with ChatbaseWidget controls if available
  useEffect(() => {
    const syncWithWidget = () => {
      if (window.ChatbaseWidgetControls) {
        setIsVisible(window.ChatbaseWidgetControls.isVisible);
      }
    };

    // Initial sync
    syncWithWidget();

    // Set up periodic sync (or you could use events)
    const syncInterval = setInterval(syncWithWidget, 500);

    return () => clearInterval(syncInterval);
  }, [isLoaded]);

  const toggleChat = () => {
    if (!window.chatbase) return;

    const newVisibility = !isVisible;
    if (newVisibility) {
      window.chatbase('show');
    } else {
      window.chatbase('hide');
    }
    setIsVisible(newVisibility);

    // Update the widget controls if available
    if (window.ChatbaseWidgetControls) {
      if (newVisibility) {
        window.ChatbaseWidgetControls.open();
      } else {
        window.ChatbaseWidgetControls.close();
      }
    }
  };

  const openChat = () => {
    if (!window.chatbase) return;

    window.chatbase('show');
    window.chatbase('open');
    setIsVisible(true);

    // Update the widget controls if available
    if (window.ChatbaseWidgetControls) {
      window.ChatbaseWidgetControls.open();
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleChat}
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        title={isVisible ? "Hide Chat" : "Show Chat"}
      >
        💬 {isVisible ? "Hide" : "Chat"}
      </button>
      <button
        onClick={openChat}
        className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        title="Open Chat"
      >
        🚀 Help
      </button>
    </div>
  );
};

export default ChatControls;