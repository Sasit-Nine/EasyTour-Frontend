import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { Input, Button, Spin } from 'antd';
import { UserIcon } from '@heroicons/react/24/outline';

const AdminChat = () => {
  const { 
    customers, 
    selectedCustomer, 
    setSelectedCustomer, 
    getMessagesForCustomer, 
    sendAdminMessage, 
    markAdminMessagesAsRead 
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // อัพเดทข้อความเมื่อลูกค้าที่เลือกเปลี่ยนแปลง
  useEffect(() => {
    if (selectedCustomer) {
      setMessages(getMessagesForCustomer(selectedCustomer.id));
      markAdminMessagesAsRead(selectedCustomer.id);
    }
  }, [selectedCustomer, getMessagesForCustomer, markAdminMessagesAsRead]);

  // อัพเดทข้อความอยู่เสมอเพื่อให้ได้ข้อความล่าสุด
  useEffect(() => {
    if (selectedCustomer) {
      const intervalId = setInterval(() => {
        setMessages(getMessagesForCustomer(selectedCustomer.id));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedCustomer, getMessagesForCustomer]);

  // Function to scroll to bottom of message container
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedCustomer) return;

    sendAdminMessage(messageInput, selectedCustomer.id);
    setMessageInput('');
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-medium text-gray-900 mb-6">ระบบแชท</h1>
      
      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Customer list sidebar */}
        <div className="w-1/4 border-r">
          <div className="p-4 border-b">
            <Input
              placeholder="ค้นหาลูกค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {customers.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Spin />
              </div>
            ) : (
              <ul>
                {filteredCustomers.map(customer => (
                  <li 
                    key={customer.id}
                    className={`p-4 cursor-pointer hover:bg-gray-100 border-b ${selectedCustomer?.id === customer.id ? 'bg-orange-50' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex items-center">
                      {customer.profilePic ? (
                        <img src={customer.profilePic} alt={customer.name} className="h-10 w-10 rounded-full mr-3" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {customer.lastMessage || 'ไม่มีข้อความ'}
                        </div>
                      </div>
                      {customer.unreadCount > 0 && (
                        <div className="ml-auto bg-[#F8644B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {customer.unreadCount}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    ไม่พบลูกค้า
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-3/4 flex flex-col">
          {selectedCustomer ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center">
                {selectedCustomer.profilePic ? (
                  <img src={selectedCustomer.profilePic} alt={selectedCustomer.name} className="h-10 w-10 rounded-full mr-3" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{selectedCustomer.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedCustomer.email || selectedCustomer.phone || 'ไม่มีข้อมูลติดต่อ'}
                  </div>
                </div>
              </div>
              
              {/* Messages container */}
              <div 
                id="message-container"
                className="flex-1 p-4 overflow-y-auto"
              >
                {messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    ไม่มีข้อความ เริ่มการสนทนากับลูกค้า
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`mb-4 flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender === 'admin' 
                            ? 'bg-[#F8644B] text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div>{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t">
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
                    className="flex-1 mr-2"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    style={{ backgroundColor: '#F8644B', borderColor: '#F8644B' }}
                    type="primary"
                  >
                    ส่ง
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-lg mb-2">เลือกลูกค้าเพื่อเริ่มการสนทนา</div>
              <div className="text-sm">เลือกลูกค้าจากรายการทางด้านซ้าย</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;