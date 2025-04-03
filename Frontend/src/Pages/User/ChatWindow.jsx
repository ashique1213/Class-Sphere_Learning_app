import React from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { Send,Users } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const recentChats = [
  { name: "Friends Forever", lastMessage: "Hi there!", time: "Yesterday, 12:50pm" },
  { name: "Mera Gang", lastMessage: "How are you?", time: "Yesterday, 12:50pm" },
  { name: "Hiking", lastMessage: "I'm going to...", time: "Yesterday, 12:50pm" },
];

const messages = [
  { sender: "Anil", text: "Hey there!", time: "Today, 8:30pm" },
  { sender: "Anil", text: "How are you?", time: "Today, 8:30pm" },
  { sender: "You", text: "Hello", time: "Today, 8:33pm" },
  { sender: "You", text: "I am fine and how are you?", time: "Today, 8:34pm" },
  { sender: "Anil", text: "I am doing well. Can we meet tomorrow?", time: "Today, 8:35pm" },
  { sender: "You", text: "Yes Sure!", time: "Today, 8:36pm" },
];

const ChatWindow = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col pt-20 bg-gradient-to-br from-teal-50 to-white">
        <section className="flex-1 max-w-7xl mx-auto w-full py-4 px-4 md:px-8 lg:px-16 gap-6 flex">
          {/* Sidebar */}
          <div className="w-1/5 bg-white p-4 rounded-xl shadow-md border border-teal-100 overflow-auto h-[80vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Chats</h2>
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <h3 className="text-gray-700 font-medium mb-2">Recent</h3>
            <ul className="space-y-2">
              {recentChats.map((chat, index) => (
                <li key={index} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                  <FaUserCircle className="w-8 h-8 text-gray-700" />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{chat.name}</p>
                    <p className="text-gray-600 text-xs truncate w-32">{chat.lastMessage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white p-4 rounded-xl shadow-md border border-teal-100 h-[80vh]">
            <div className="flex items-center mb-4">
              <FaUserCircle className="w-10 h-10 text-gray-700 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">Anil</p>
                <p className="text-gray-500 text-sm">Online - Last seen, 2:20pm</p>
              </div>
            </div>
            <hr className="border-teal-100 mb-4" />
            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-2 rounded-lg text-sm ${message.sender === "You" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white py-2 flex items-center border-t border-gray-300">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button className="ml-2 bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-all duration-300">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ChatWindow;