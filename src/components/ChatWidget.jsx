import { useEffect, useRef } from 'react';

const ChatbaseWidget = () => {
  const isLoadedRef = useRef(false);
  const onLoadRef = useRef(null); // Store the onLoad function reference

  useEffect(() => {
    // Prevent double loading
    if (isLoadedRef.current) return;

    // Check if Chatbase is already initialized
    if (window.chatbase && window.chatbase("getState") === "initialized") {
      isLoadedRef.current = true;
      return;
    }

    // Your Chatbase initialization script
    const initializeChatbase = () => {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };

        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          }
        });
      }

      const onLoad = function() {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "OlxoEDml0kLdxELksJg-s";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
        isLoadedRef.current = true;
      };

      // Store the onLoad function reference for cleanup
      onLoadRef.current = onLoad;

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    };

    initializeChatbase();

    return () => {
      // Remove event listener if component unmounts before page load
      if (document.readyState !== "complete" && onLoadRef.current) {
        window.removeEventListener("load", onLoadRef.current);
      }
    };
  }, []);

  // This component doesn't render any visible JSX
  return null;
};

export default ChatbaseWidget;