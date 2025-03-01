import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';

// สร้าง context
const ChatContext = createContext();

// สร้าง reducer สำหรับจัดการกับข้อความ
const chatReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_MESSAGES':
      return action.payload;
    case 'ADD_MESSAGE':
      return [...state, action.payload];
    case 'MARK_AS_READ':
      return state.map(message => 
        message.sender === 'admin' && !message.read 
          ? { ...message, read: true } 
          : message
      );
    default:
      return state;
  }
};

// สร้าง Provider component
export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, dispatch] = useReducer(chatReducer, []);
  const [unreadCount, setUnreadCount] = useState(0);

  // สร้างข้อความทดสอบเมื่อ provider เริ่มทำงาน
  useEffect(() => {
    if (user) {
      // ข้อความจำลองสำหรับการทดสอบ
      const demoMessages = [
        {
          id: '1',
          content: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          content: 'หากคุณมีข้อสงสัยเกี่ยวกับแพ็คเกจทัวร์ สามารถสอบถามได้เลยค่ะ',
          sender: 'admin',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ];
      
      dispatch({ type: 'LOAD_MESSAGES', payload: demoMessages });
    }
  }, [user]);

  // อัพเดท unreadCount เมื่อมีการเปลี่ยนแปลงที่ messages
  useEffect(() => {
    if (messages) {
      const count = messages.filter(msg => msg.sender === 'admin' && !msg.read).length;
      setUnreadCount(count);
    }
  }, [messages]);

  // ฟังก์ชันส่งข้อความ
  const sendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: 'customer',
      timestamp: new Date().toISOString(),
      read: true
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    
    // จำลองการตอบกลับจาก admin (หลังจากส่งข้อความไป 1 วินาที)
    setTimeout(() => {
      const responses = [
        'ขอบคุณสำหรับข้อความค่ะ จะดำเนินการให้ทันทีนะคะ',
        'ได้ค่ะ ทางเราจะดูแลเรื่องนี้ให้ค่ะ',
        'มีอะไรให้ช่วยเพิ่มเติมไหมคะ?',
        'ขอบคุณที่ติดต่อเรา ทางเราจะพยายามตอบกลับให้เร็วที่สุดค่ะ',
        'เข้าใจค่ะ ต้องขออภัยในความไม่สะดวกด้วยนะคะ'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const adminReply = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: adminReply });
    }, 1000);
  };

  // ฟังก์ชันทำเครื่องหมายว่าอ่านแล้ว
  const markAsRead = () => {
    dispatch({ type: 'MARK_AS_READ' });
  };

  return (
    <ChatContext.Provider value={{ messages, unreadCount, sendMessage, markAsRead }}>
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