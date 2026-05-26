import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Trash2,
  Sparkles,
  User,
} from "lucide-react";
import { CONFIG, UTILS, PROMPT_TEMPLATE } from "@config";

const suggestions = (isMobile) =>
  isMobile
    ? CONFIG.SUGGESTIONS.MOBILE_SPECIFIC || []
    : [...(CONFIG.SUGGESTIONS.CR8_SPECIFIC || []), ...(CONFIG.SUGGESTIONS.GENERAL || [])];

const StatusPill = ({ connectionStatus, trainingDataStatus }) => {
  const isOnline = connectionStatus === CONFIG.STATUS.CONNECTION.CONNECTED;
  const isReady =
    trainingDataStatus === CONFIG.STATUS.TRAINING_DATA.LOADED ||
    trainingDataStatus === CONFIG.STATUS.TRAINING_DATA.FALLBACK;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
          isOnline
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isOnline ? "bg-emerald-400" : connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE ? "bg-red-400" : "bg-amber-400"
          }`}
        />
        {isOnline ? "Online" : connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE ? "Offline" : "Connecting"}
      </span>
      {isReady && (
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/50">
          {trainingDataStatus === CONFIG.STATUS.TRAINING_DATA.LOADED ? "CR8 ready" : "General mode"}
        </span>
      )}
    </div>
  );
};

const WelcomeMessage = ({ trainingDataStatus, setInputMessage, isMobile }) => (
  <div className="flex flex-col items-center px-2 py-8 text-center">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <img
        src={CONFIG.APP.LOGO_PATH}
        alt={CONFIG.APP.LOGO_ALT}
        className="h-9 w-9 object-contain"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </div>
    <h3 className="font-display text-lg font-semibold text-white">How can we help?</h3>
    <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-white/55">
      {trainingDataStatus === CONFIG.STATUS.TRAINING_DATA.LOADED
        ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADED
        : trainingDataStatus === CONFIG.STATUS.TRAINING_DATA.LOADING
          ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADING
          : "Ask about our services, process, or start a project inquiry."}
    </p>
    <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
      {suggestions(isMobile).map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setInputMessage(suggestion)}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const Message = ({ message, copyMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
          isUser ? "border-white/20 bg-white text-black" : "border-white/10 bg-white/5 text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      <div className={`group max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-md bg-white text-black"
              : "rounded-tl-md border border-white/10 bg-white/[0.04] text-white/90"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">
            {message.content || (message.isTyping ? "…" : "")}
          </p>
        </div>
        <div
          className={`mt-1.5 flex items-center gap-2 px-1 ${isUser ? "justify-end" : "justify-start"}`}
        >
          {message.timestamp && !message.isTyping && (
            <span className="text-[11px] text-white/35">{UTILS.formatTime(message.timestamp)}</span>
          )}
          {!isUser && message.content && !message.isTyping && (
            <button
              type="button"
              onClick={() => copyMessage(message.content)}
              className="text-white/35 transition hover:text-white/70 md:opacity-0 md:group-hover:opacity-100"
              title="Copy"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
      <Sparkles className="h-4 w-4 text-white/80" />
    </div>
    <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="flex gap-1">
        {CONFIG.UI.ANIMATIONS.BOUNCE_DELAYS.map((delay, index) => (
          <span
            key={index}
            className="h-2 w-2 animate-bounce rounded-full bg-white/40"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  </div>
);

const IconButton = ({ onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
  >
    {children}
  </button>
);

const ChatHeader = ({
  isMobile,
  connectionStatus,
  trainingDataStatus,
  chatHistory,
  restoreLastChat,
  clearChat,
  messages,
  toggleMinimize,
  isMinimized,
  toggleChat,
}) => (
  <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur-xl">
    <div className="min-w-0 flex-1">
      <h3 className="truncate font-display text-sm font-semibold text-white">
        {isMobile ? CONFIG.APP.MOBILE_NAME : CONFIG.APP.NAME}
      </h3>
      <div className="mt-1.5">
        <StatusPill connectionStatus={connectionStatus} trainingDataStatus={trainingDataStatus} />
      </div>
    </div>
    <div className="ml-2 flex items-center gap-0.5">
      {chatHistory.length > 0 && (
        <IconButton onClick={restoreLastChat} title="Restore last chat">
          <RotateCcw className="h-4 w-4" />
        </IconButton>
      )}
      {messages.length > 0 && (
        <IconButton onClick={clearChat} title="Clear chat">
          <Trash2 className="h-4 w-4" />
        </IconButton>
      )}
      {!isMobile && (
        <IconButton onClick={toggleMinimize} title={isMinimized ? "Expand" : "Minimize"}>
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </IconButton>
      )}
      <IconButton onClick={toggleChat} title="Close">
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  </div>
);

const ChatInputArea = ({
  isMobile,
  inputRef,
  inputMessage,
  setInputMessage,
  handleKeyDown,
  isLoading,
  connectionStatus,
  sendMessage,
}) => (
  <div className="shrink-0 border-t border-white/10 bg-neutral-950/90 p-4 backdrop-blur-xl">
    <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-white/25 focus-within:bg-white/[0.05]">
      <textarea
        ref={inputRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isMobile ? CONFIG.MESSAGES.PLACEHOLDERS.MOBILE : CONFIG.MESSAGES.PLACEHOLDERS.DESKTOP}
        className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={sendMessage}
        disabled={isLoading || !inputMessage.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/30"
        title="Send"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
    {connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE && (
      <p className="mt-2 text-center text-xs text-red-400/90">
        Connection unavailable. Please try again shortly.
      </p>
    )}
  </div>
);

const ChatPanel = ({
  isMobile,
  isMinimized,
  connectionStatus,
  trainingDataStatus,
  chatHistory,
  restoreLastChat,
  clearChat,
  messages,
  toggleMinimize,
  toggleChat,
  inputRef,
  inputMessage,
  setInputMessage,
  handleKeyDown,
  isLoading,
  isTyping,
  sendMessage,
  copyMessage,
  messagesEndRef,
}) => (
  <div
    className={`flex flex-col overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl shadow-black/50 ${
      isMobile ? "fixed inset-0 z-50 h-[100dvh]" : `w-[400px] rounded-2xl ${isMinimized ? "h-14" : "h-[min(640px,85vh)]"}`
    }`}
  >
    <ChatHeader
      isMobile={isMobile}
      connectionStatus={connectionStatus}
      trainingDataStatus={trainingDataStatus}
      chatHistory={chatHistory}
      restoreLastChat={restoreLastChat}
      clearChat={clearChat}
      messages={messages}
      toggleMinimize={toggleMinimize}
      isMinimized={isMinimized}
      toggleChat={toggleChat}
    />

    {!isMinimized && (
      <>
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {messages.length === 0 && (
            <WelcomeMessage
              trainingDataStatus={trainingDataStatus}
              setInputMessage={setInputMessage}
              isMobile={isMobile}
            />
          )}
          {messages.map((message, index) => (
            <Message key={index} message={message} copyMessage={copyMessage} />
          ))}
          {(isLoading || isTyping) && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInputArea
          isMobile={isMobile}
          inputRef={inputRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyDown={handleKeyDown}
          isLoading={isLoading}
          connectionStatus={connectionStatus}
          sendMessage={sendMessage}
        />
      </>
    )}
  </div>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(CONFIG.STATUS.CONNECTION.UNKNOWN);
  const [trainingData, setTrainingData] = useState("");
  const [trainingDataStatus, setTrainingDataStatus] = useState(CONFIG.STATUS.TRAINING_DATA.LOADING);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = CONFIG.API.getApiBase();
  const ENDPOINTS = CONFIG.API.getEndpoints(API_BASE);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isLoading]);

  useEffect(() => {
    loadTrainingData();
    checkBackendConnection();
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    document.body.style.overflow = isOpen && window.innerWidth < 768 ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const loadTrainingData = async () => {
    setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.LOADING);

    for (const path of CONFIG.TRAINING_DATA_PATHS) {
      try {
        const response = await UTILS.fetchWithTimeout(path, {
          method: "GET",
          headers: {
            "Content-Type": CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
            Accept: CONFIG.FETCH.HEADERS.ACCEPT_JSON,
          },
          timeout: CONFIG.FETCH.TIMEOUT,
        });

        if (!response.ok) throw new Error(`Failed: ${response.status}`);

        const data = await response.text();
        if (UTILS.isValidTrainingData(data)) {
          setTrainingData(data);
          setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.LOADED);
          return;
        }
      } catch {
        /* try next path */
      }
    }

    if (CONFIG.DEFAULT_TRAINING_DATA && UTILS.isValidTrainingData(CONFIG.DEFAULT_TRAINING_DATA)) {
      setTrainingData(CONFIG.DEFAULT_TRAINING_DATA);
      setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.FALLBACK);
      return;
    }

    setTrainingData(CONFIG.MESSAGES.NO_TRAINING_DATA);
    setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.FAILED);
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(ENDPOINTS.HEALTH_CHECK, {
        method: "GET",
        headers: { "Content-Type": CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON },
      });
      setConnectionStatus(
        response.ok ? CONFIG.STATUS.CONNECTION.CONNECTED : CONFIG.STATUS.CONNECTION.OFFLINE
      );
    } catch {
      setConnectionStatus(CONFIG.STATUS.CONNECTION.OFFLINE);
      setTimeout(checkBackendConnection, 5000);
    }
  };

  const typeMessage = async (message, callback) => {
    setIsTyping(true);
    const words = message.split(" ");
    let currentMessage = "";

    for (let i = 0; i < words.length; i++) {
      currentMessage += (i === 0 ? "" : " ") + words[i];
      callback(currentMessage);
      await UTILS.sleep(
        CONFIG.UI.ANIMATIONS.TYPING_DELAY.BASE + Math.random() * CONFIG.UI.ANIMATIONS.TYPING_DELAY.RANDOM
      );
    }

    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    const newMessages = [...messages, { role: "user", content: userMessage, timestamp: new Date() }];
    setMessages(newMessages);
    setIsLoading(true);

    const tempMessage = { role: "assistant", content: "", timestamp: new Date(), isTyping: true };
    setMessages([...newMessages, tempMessage]);

    try {
      const prompt = PROMPT_TEMPLATE.buildHybridPrompt(userMessage, trainingData);
      const endpoints = CONFIG.API.getEndpoints(CONFIG.API.getApiBase());

      const response = await fetch(endpoints.BACKEND_PROXY, {
        method: "POST",
        headers: { "Content-Type": CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.content?.parts?.[0]?.text ||
        data.text ||
        CONFIG.MESSAGES.NO_RESPONSE;

      const finalMessage = { role: "assistant", content: "", timestamp: new Date() };
      setMessages([...newMessages, finalMessage]);

      await typeMessage(aiResponse, (partialMessage) => {
        setMessages([...newMessages, { ...finalMessage, content: partialMessage }]);
      });

      setConnectionStatus(CONFIG.STATUS.CONNECTION.CONNECTED);
    } catch (error) {
      let errorMessage = CONFIG.MESSAGES.DEFAULT_ERROR;
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage += CONFIG.MESSAGES.CONNECTION_ERROR;
        setConnectionStatus(CONFIG.STATUS.CONNECTION.OFFLINE);
      } else {
        errorMessage += CONFIG.MESSAGES.RETRY_MESSAGE;
      }
      setMessages([
        ...newMessages,
        { role: "assistant", content: errorMessage, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) checkBackendConnection();
  };

  const panelProps = {
    connectionStatus,
    trainingDataStatus,
    chatHistory,
    restoreLastChat: () => {
      if (chatHistory.length > 0) {
        const lastChat = chatHistory[chatHistory.length - 1];
        setMessages(lastChat.messages);
        setChatHistory(chatHistory.slice(0, -1));
      }
    },
    clearChat: () => {
      if (messages.length > 0) {
        setChatHistory([...chatHistory, { messages, timestamp: new Date() }]);
      }
      setMessages([]);
    },
    messages,
    toggleMinimize: () => setIsMinimized(!isMinimized),
    isMinimized,
    toggleChat,
    inputRef,
    inputMessage,
    setInputMessage,
    handleKeyDown,
    isLoading,
    isTyping,
    sendMessage,
    copyMessage: (content) => UTILS.copyToClipboard(content).catch(() => {}),
    messagesEndRef,
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-neutral-950 text-white shadow-xl shadow-black/40 transition hover:scale-105 hover:border-white/30 hover:bg-neutral-900"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-neutral-950 bg-emerald-400" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 hidden md:block">
          <ChatPanel isMobile={false} {...panelProps} />
        </div>
      )}

      {isOpen && (
        <div className="md:hidden">
          <ChatPanel isMobile {...panelProps} />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
