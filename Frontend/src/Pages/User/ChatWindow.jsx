import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { Send, Paperclip } from "lucide-react";
import { FaUserCircle, FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { checkUserSubscription } from "../../api/subscriptionapi";
import {
  getChatMessages,
  sendChatMessage,
  getSubscribedUsers,
  createOrGetChat,
} from "../../api/chatapi";
import { toast } from "react-toastify";

const wsBaseUrl = import.meta.env.VITE_WS_URL;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState({
    teachers: [],
    fellow_students: [],
    students_in_my_classes: [],
  });
  const authToken = useSelector((state) => state.auth.authToken);
  const user = useSelector((state) => state.auth.user);
  // const userRole = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();
  const location = useLocation();
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for file input
  const [isSending, setIsSending] = useState(false);


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

        const data = await getSubscribedUsers();
        setChatData({
          teachers: data.teachers || [],
          fellow_students: data.fellow_students || [],
          students_in_my_classes: data.students_in_my_classes || [],
        });

        // Check if a student ID was passed via state
        const selectedUserId = location.state?.selectedUserId;
        if (selectedUserId) {
          handleUserClick(selectedUserId); // Automatically open chat with the selected user
        }
      } catch (error) {
        toast.error("Failed to load chat data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [authToken, navigate, user, location.state]); // Add location.state to dependencies

  // Set up WebSocket for real-time messaging
  useEffect(() => {
    const setupWebSocket = async () => {
      if (!currentChat || !authToken) return;

      try {
        const chatMessages = await getChatMessages(currentChat.id);
        setMessages(chatMessages);

        if (ws.current) ws.current.close();

        const socket = new WebSocket(
          `${wsBaseUrl}/chat/${currentChat.id}/?token=${authToken}`
        );

        ws.current = socket;

        socket.onopen = () => console.log("WebSocket connected");

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.sender !== user.username) {
            setMessages((prev) => {
              const messageExists = prev.some((msg) => msg.id === data.id);
              if (!messageExists) {
                return [...prev, { ...data }];
              }
              return prev;
            });
          }
        };

        socket.onclose = () => console.log("WebSocket disconnected");
        socket.onerror = (err) => console.error("WebSocket error:", err);
      } catch (err) {
        toast.error("Failed to load messages.");
      }
    };

    setupWebSocket();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [currentChat, authToken, user?.username]);

  const handleSendMessage = async () => {
    if (!currentChat || (!messageInput.trim() && !mediaFile)) return;
    
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append("chat_id", currentChat.id);
      if (messageInput.trim()) formData.append("message", messageInput);
      if (mediaFile) formData.append("media", mediaFile);

      const serverMessage = await sendChatMessage(currentChat.id, formData);
      setMessages((prev) => [...prev, { ...serverMessage, isSentByMe: true }]);
      setMessageInput("");
      setMediaFile(null);
      fileInputRef.current.value = null; // Reset file input
    } catch (error) {
      toast.error("Failed to send message.");
    }finally {
      setIsSending(false);
    }
  };

  // Format timestamp for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Just now"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleUserClick = async (userId) => {
    try {
      const chat = await createOrGetChat(userId);
      setCurrentChat(chat);
    } catch (err) {
      toast.error("Failed to open chat.");
    }
  };

  const renderMedia = (msg) => {
    if (!msg.media_url) return null;

    switch (msg.media_type) {
      case "image":
        return <img src={msg.media_url} alt="Shared media" className="max-w-full h-auto rounded" />;
      case "video":
        return (
          <video controls className="max-w-full h-auto rounded">
            <source src={msg.media_url} />
          </video>
        );
      case "document":
        return (
          <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">
            View Document
          </a>
        );
      default:
        return (
          <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">
            Download File
          </a>
        );
    }
  };

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
      <div className="min-h-screen flex flex-col pt-20 bg-gradient-to-br from-teal-50 to-white">
        <section className="flex-1 max-w-7xl mx-auto w-full py-4 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white p-4 rounded-2xl shadow border border-teal-100 max-h-[80vh] overflow-y-auto">
            <p className="text-base font-medium text-gray-600 mb-4">
              Hello <span className="font-bold text-teal-600 capitalize">{user?.username}</span>
            </p>

            {/* Render based on user role */}
            {user?.role === "student" && (
              <>
                {/* Teachers (for students) */}
                {chatData.teachers.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaChalkboardTeacher className="text-teal-600" /> My Teachers
                    </h2>
                    <ul className="space-y-3 capitalize">
                      {chatData.teachers.map((t) => (
                        <li
                          key={t.id}
                          onClick={() => handleUserClick(t.id)}
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-teal-50 transition duration-200 ${
                            currentChat?.other_user?.id === t.id ? "bg-teal-100" : ""
                          }`}
                        >
                          <FaUserCircle className="text-teal-600 w-6 h-6" />
                          <span className="text-sm font-medium text-gray-800">
                            {t.username}{" "}
                            {!t.is_subscribed && (
                              <span className="text-red-500">(Not Active Plan)</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Fellow Students (for students) */}
                {chatData.fellow_students.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center gap-2">
                      <FaUserFriends className="text-teal-600" /> Fellow Students
                    </h2>
                    <ul className="space-y-3 capitalize">
                      {chatData.fellow_students.map((s) => (
                        <li
                          key={s.id}
                          onClick={() => handleUserClick(s.id)}
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-teal-50 transition duration-200 ${
                            currentChat?.other_user?.id === s.id ? "bg-teal-100" : ""
                          }`}
                        >
                          <FaUserCircle className="text-teal-600 w-6 h-6" />
                          <span className="text-sm font-medium text-gray-800">
                            {s.username}{" "}
                            {!s.is_subscribed && (
                              <span className="text-red-500">(Not Active Plan)</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

            {user?.role === "teacher" && (
              <>
                {/* Students in My Classes (for teachers) */}
                {chatData.students_in_my_classes.length > 0 ? (
                  <>
                    <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center gap-2">
                      <FaUserFriends className="text-teal-600" /> My Students
                    </h2>
                    <ul className="space-y-3 capitalize">
                      {chatData.students_in_my_classes.map((s) => (
                        <li
                          key={s.id}
                          onClick={() => handleUserClick(s.id)}
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-teal-50 transition duration-200 ${
                            currentChat?.other_user?.id === s.id ? "bg-teal-100" : ""
                          }`}
                        >
                          <FaUserCircle className="text-teal-600 w-6 h-6" />
                          <span className="text-sm font-medium text-gray-800">
                            {s.username}{" "}
                            {!s.is_subscribed && (
                              <span className="text-red-500">(Not Active Plan)</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No students have joined your classes yet.</p>
                )}
              </>
            )}
            {!user?.role && <p className="text-gray-500 text-sm">User role not defined.</p>}
          </aside>

          {/* Chat Area */}
          <div className="w-full md:w-3/4 bg-white p-4 rounded-2xl shadow border border-teal-100 h-[70vh] md:h-[80vh] flex flex-col">
            {currentChat ? (
              <>
                <div className="flex items-center mb-3 border-b pb-2 sticky top-0 bg-white z-10">
                  <FaUserCircle className="w-8 h-8 text-teal-600 mr-2" />
                  <p className="font-semibold text-lg capitalize">
                    {currentChat.other_user?.username || "Chat"}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2 scroll-smooth flex flex-col-reverse">
                  <div ref={messagesEndRef} />
                  {[...messages].reverse().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isSentByMe || msg.sender === user.username
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow-sm ${
                          msg.isSentByMe || msg.sender === user.username
                            ? "bg-teal-100 text-right"
                            : "bg-gray-100 text-left"
                        }`}
                      >
                        {msg.text && <p className="text-sm text-gray-800">{msg.text}</p>}
                        {renderMedia(msg)}
                        <p className="text-xs text-gray-500 mt-1">{formatDate(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {mediaFile && (
                  <p className="text-sm text-gray-600 mt-2 ml-10">Selected: {mediaFile.name}</p>
                )}
                <div className="mt-3 flex items-center sticky bottom-0 bg-white pt-2">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-teal-600 hover:text-teal-800"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                  <button
                      onClick={handleSendMessage}
                      disabled={isSending}
                      className={`ml-3 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl transition flex items-center justify-center w-10 h-10 ${
                        isSending ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                </div>
                
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-base text-center">
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
