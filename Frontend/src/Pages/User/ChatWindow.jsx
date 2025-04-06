import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { Send } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkUserSubscription } from "../../api/subscriptionapi";
import {
  getChatMessages,
  sendChatMessage,
  getSubscribedUsers,
  createOrGetChat,
} from "../../api/chatapi";
import { toast } from "react-toastify";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial data (subscription status and subscribed users)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!authToken || !user) {
        toast.warn("Please log in to access chat.");
        navigate("/signup?mode=signin");
        return;
      }

      try {
        setLoading(true);
        const subscriptionData = await checkUserSubscription();
        setCurrentSubscription(subscriptionData);

        if (
          !subscriptionData?.subscribed ||
          subscriptionData.subscription?.plan?.name === "free"
        ) {
          toast.info("Chat is available only with a paid plan.");
          navigate("/plans");
          return;
        }

        const users = await getSubscribedUsers();
        setSubscribedUsers(users || []); // Fallback to empty array if null
      } catch (error) {
        toast.error("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [authToken, navigate, user]);

  // Set up WebSocket for real-time messaging
  useEffect(() => {
    const setupWebSocket = async () => {
      if (!currentChat || !authToken) return;

      try {
        const chatMessages = await getChatMessages(currentChat.id);
        setMessages(chatMessages);

        if (ws.current) ws.current.close();

        const socket = new WebSocket(
          `ws://localhost:8000/ws/chat/${currentChat.id}/?token=${authToken}`
        );

        ws.current = socket;

        socket.onopen = () => console.log("WebSocket connected");

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.message && data.sender !== user.username) {
            setMessages((prev) => [...prev, { ...data }]);
          }
        };

        socket.onclose = () => console.log("WebSocket disconnected");
        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          toast.error("Chat connection lost.");
        };
      } catch (err) {
        toast.error("Failed to load messages.");
      }
    };

    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket cleanup completed");
      }
    };
  }, [currentChat, authToken, user?.username]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentChat || !ws.current) return;

    const messageData = {
      chat_id: currentChat.id,
      message: messageInput,
      sender: user.username,
      timestamp: new Date().toISOString(),
    };

    try {
      ws.current.send(JSON.stringify(messageData));
      await sendChatMessage(currentChat.id, messageInput);
      setMessages((prev) => [...prev, { ...messageData, isSentByMe: true }]);
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  // Format timestamp for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Just now"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Loading state UI
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex flex-col pt-20">
          <div className="flex-1 flex items-center justify-center">
            <p>Loading chat...</p>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  // Main UI
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col pt-20 bg-gradient-to-br from-teal-50 to-white">
        <section className="flex-1 max-w-7xl mx-auto w-full py-4 px-4 md:px-8 lg:px-16 gap-6 flex">
          {/* Subscribed Users List */}
          <div className="w-1/5 bg-white p-4 rounded-xl shadow-md border border-teal-100 overflow-auto h-[80vh]">
            <h2 className="text-lg font-bold mb-2">Subscribed Users </h2>
            <p className="text-lg font-bold mb-2">Hello {user?.username }</p>
            {subscribedUsers.length > 0 ? (
              <ul className="space-y-2">
                {subscribedUsers.map((u) => (
                  <li
                    key={u.id}
                    onClick={async () => {
                      try {
                        const chat = await createOrGetChat(u.id);
                        setCurrentChat(chat);
                      } catch (err) {
                        toast.error("Failed to open chat.");
                      }
                    }}
                    className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FaUserCircle className="w-6 h-6 text-gray-700" />
                    <span className="text-sm font-medium">{u.username}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No subscribed users found.</p>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white p-4 rounded-xl shadow-md border border-teal-100 h-[80vh]">
            {currentChat ? (
              <>
                <div className="flex items-center mb-4">
                  <FaUserCircle className="w-8 h-8 mr-2" />
                  <p className="font-bold">{currentChat.other_user?.username || "Chat"}</p>
                </div>
                <hr className="mb-2" />
                <div className="flex-1 overflow-y-auto space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.isSentByMe || msg.sender === user.username
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-lg ${
                          msg.isSentByMe || msg.sender === user.username
                            ? "bg-green-100 text-right"
                            : "bg-gray-100 text-left"
                        }`}
                      >
                        <p className="text-sm">{msg.message || msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border p-2 rounded-lg"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-teal-600 text-white p-2 rounded-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a user to start chatting.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ChatWindow;