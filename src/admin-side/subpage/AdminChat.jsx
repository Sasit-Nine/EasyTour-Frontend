import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ALL_CHATS, QUERY_MESSAGES, MUTATION_SEND_MESSAGE } from '../../services/Graphql';
import { Input, Button, Spin } from 'antd';
import { UserIcon } from '@heroicons/react/24/outline';

const AdminChat = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Query to get all customers with chats
  const { data: chatsData, loading: chatsLoading } = useQuery(QUERY_ALL_CHATS, {
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    },
    pollInterval: 10000, // Poll every 10 seconds to check for new messages
  });

  // Query to get messages for selected customer
  const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useQuery(QUERY_MESSAGES, {
    variables: { customerId: selectedCustomer?.id || "" },
    skip: !selectedCustomer,
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
      refetchMessages();
      setMessageInput('');
    }
  });

  // Update customers list when chat data changes
  useEffect(() => {
    if (chatsData && chatsData.customers) {
      setCustomers(chatsData.customers);
    }
  }, [chatsData]);

  // Update messages when message data changes or when selected customer changes
  useEffect(() => {
    if (messagesData && messagesData.messages) {
      setMessages(messagesData.messages);
      scrollToBottom();
    }
  }, [messagesData, selectedCustomer]);

  // Function to scroll to bottom of message container
  const scrollToBottom = () => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedCustomer) return;

    sendMessage({
      variables: {
        customerId: selectedCustomer.id,
        content: messageInput,
      },
    });
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
            {chatsLoading ? (
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
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spin />
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
                {messages.length === 0 && !messagesLoading && (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    ไม่มีข้อความ เริ่มการสนทนากับลูกค้า
                  </div>
                )}
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