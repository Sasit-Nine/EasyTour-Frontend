import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_MESSAGES, MUTATION_SEND_MESSAGE, MUTATION_MARK_AS_READ } from '../../services/Graphql';
import { Input, Button, Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';

const CustomerChat = () => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Query to get messages
  const { data, loading, refetch } = useQuery(QUERY_MESSAGES, {
    variables: { customerId: user?.documentId || "" },
    skip: !user,
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    },
    pollInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Mutation to send a message
  const [sendMessage] = useMutation(MUTATION_SEND_MESSAGE, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    },
    onCompleted: () => {
      refetch();
      setMessageInput('');
    }
  });

  // Mutation to mark messages as read
  const [markAsRead] = useMutation(MUTATION_MARK_AS_READ, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  });

  // Update messages when data changes
  useEffect(() => {
    if (data && data.messages) {
      setMessages(data.messages);
      scrollToBottom();
    }
  }, [data]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isChatOpen && user) {
      markAsRead({
        variables: { customerId: user.documentId }
      });
    }
  }, [isChatOpen, user, markAsRead]);

  // Scroll to bottom when new messages arrive or chat is opened
  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !user) return;

    sendMessage({
      variables: {
        customerId: user.documentId,
        content: messageInput,
      },
    });
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Count unread messages from admin
  const unreadCount = messages.filter(msg => msg.sender === 'admin' && !msg.read).length;

  if (!user) {
    return null; // Don't show chat for non-logged in users
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-[#F8644B] text-white p-3 rounded-full shadow-lg hover:bg-[#E05A43] transition-colors duration-200"
      >
        {isChatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#F8644B] text-white p-3">
            <h3 className="font-medium">แชทกับเจ้าหน้าที่</h3>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-3 bg-gray-50">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spin />
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <p>ยังไม่มีข้อความ</p>
                    <p>เริ่มสนทนากับเจ้าหน้าที่ได้เลย</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`mb-3 flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.sender === 'customer' 
                            ? 'bg-[#F8644B] text-white' 
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <div>{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'customer' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex">
              <Input.TextArea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 mr-2 rounded"
              />
              <Button 
                type="primary"
                onClick={handleSendMessage}
                className="bg-[#F8644B] hover:bg-[#E05A43]"
              >
                ส่ง
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerChat;