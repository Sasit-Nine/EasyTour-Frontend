import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';

// สร้าง context
const ChatContext = createContext();

// สร้าง reducer สำหรับจัดการกับข้อความและลูกค้า
const chatReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        customers: state.customers.map(customer => {
          if (customer.id === action.customerId) {
            return {
              ...customer,
              lastMessage: action.payload.content,
              unreadCount: action.payload.sender === 'customer' ? customer.unreadCount + 1 : customer.unreadCount
            };
          }
          return customer;
        })
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        messages: state.messages.map(message => 
          message.sender === action.sender && !message.read && message.to === action.to
            ? { ...message, read: true } 
            : message
        ),
        // ถ้ามีการ markAsRead จาก admin ให้ลบ unreadCount ของลูกค้าคนนั้น
        customers: action.sender === 'customer' 
          ? state.customers.map(customer => 
              customer.id === action.customerId 
                ? { ...customer, unreadCount: 0 } 
                : customer
            )
          : state.customers
      };
    case 'LOAD_CUSTOMERS':
      return {
        ...state,
        customers: action.payload
      };
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    default:
      return state;
  }
};

// สร้าง Provider component
export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    customers: []
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // สร้างข้อมูลทดสอบเมื่อ provider เริ่มทำงาน
  useEffect(() => {
    if (user) {
      // สร้างข้อมูลลูกค้าจำลอง
      const demoCustomers = [
        {
          id: user.id || 'customer-1',
          name: user.name || 'ลูกค้าทดสอบ',
          email: user.email || 'customer@example.com',
          profilePic: null,
          lastMessage: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?',
          unreadCount: 2
        }
      ];
      
      // ข้อความจำลองสำหรับการทดสอบ
      const demoMessages = [
        {
          id: '1',
          content: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?',
          sender: 'admin',
          to: user.id || 'customer-1',
          customerId: user.id || 'customer-1',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          content: 'หากคุณมีข้อสงสัยเกี่ยวกับแพ็คเกจทัวร์ สามารถสอบถามได้เลยค่ะ',
          sender: 'admin',
          to: user.id || 'customer-1',
          customerId: user.id || 'customer-1',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ];
      
      dispatch({ type: 'LOAD_CUSTOMERS', payload: demoCustomers });
      dispatch({ type: 'LOAD_MESSAGES', payload: demoMessages });
    }
  }, [user]);

  // ฟังก์ชันส่งข้อความจากลูกค้า
  const sendCustomerMessage = (content) => {
    if (!user) return;
    
    const customerId = user.id || 'customer-1';
    
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: 'customer',
      to: 'admin',
      customerId,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: newMessage,
      customerId
    });
  };

  // ฟังก์ชันส่งข้อความจาก admin
  const sendAdminMessage = (content, customerId) => {
    if (!customerId) return;
    
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: 'admin',
      to: customerId,
      customerId,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: newMessage,
      customerId
    });
  };

  // ฟังก์ชันทำเครื่องหมายว่าอ่านแล้วสำหรับลูกค้า
  const markCustomerMessagesAsRead = () => {
    if (!user) return;
    
    dispatch({ 
      type: 'MARK_AS_READ', 
      sender: 'admin',
      to: user.id || 'customer-1'
    });
  };

  // ฟังก์ชันทำเครื่องหมายว่าอ่านแล้วสำหรับ admin
  const markAdminMessagesAsRead = (customerId) => {
    dispatch({ 
      type: 'MARK_AS_READ', 
      sender: 'customer',
      to: 'admin',
      customerId
    });
  };

  // ดึงข้อความสำหรับลูกค้าที่เข้าสู่ระบบปัจจุบัน
  const getCustomerMessages = () => {
    if (!user) return [];
    
    const customerId = user.id || 'customer-1';
    return state.messages.filter(msg => msg.customerId === customerId);
  };

  // ดึงข้อความสำหรับลูกค้าที่เลือกโดย admin
  const getMessagesForCustomer = (customerId) => {
    if (!customerId) return [];
    return state.messages.filter(msg => msg.customerId === customerId);
  };

  // คำนวณจำนวนข้อความที่ยังไม่ได้อ่านสำหรับลูกค้า
  const getCustomerUnreadCount = () => {
    if (!user) return 0;
    
    const customerId = user.id || 'customer-1';
    return state.messages.filter(
      msg => msg.customerId === customerId && msg.sender === 'admin' && !msg.read
    ).length;
  };

  return (
    <ChatContext.Provider value={{ 
      customers: state.customers,
      messages: getCustomerMessages(),
      unreadCount: getCustomerUnreadCount(),
      selectedCustomer,
      setSelectedCustomer,
      getMessagesForCustomer,
      sendCustomerMessage,
      sendAdminMessage,
      markCustomerMessagesAsRead,
      markAdminMessagesAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// สร้าง hook สำหรับการเข้าถึง context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};