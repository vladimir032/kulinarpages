import React, { createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const MessengerContext = createContext();

// Начальное состояние с защитными значениями
const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  unread: {},
  loadingChats: false,
  loadingMessages: false,
  // lastMessage теперь часть каждого чата
};

// Валидатор состояния
const validateState = (state) => ({
  chats: Array.isArray(state.chats) ? state.chats : [],
  currentChat: state.currentChat || null,
  messages: Array.isArray(state.messages) ? state.messages : [],
  onlineUsers: Array.isArray(state.onlineUsers) ? state.onlineUsers : [],
  typingUsers: Array.isArray(state.typingUsers) ? state.typingUsers : [],
  unread: typeof state.unread === 'object' && state.unread !== null ? state.unread : {},
  loadingChats: Boolean(state.loadingChats),
  loadingMessages: Boolean(state.loadingMessages),
});

// Защищенный редюсер
function messengerReducer(state, action) {
  const currentState = validateState(state);

  switch (action.type) {
    case 'SET_CHATS':
      // Сохраняем lastMessage для каждого чата, если есть
      return {
        ...currentState,
        chats: action.chats.map(chat => ({
          ...chat,
          lastMessage: chat.lastMessage || null
        })),
        loadingChats: false
      };

    case 'SET_CURRENT_CHAT':
      return { 
        ...currentState, 
        currentChat: action.chatId || null, 
        messages: [] 
      };

    case 'SET_MESSAGES': {
      // Обновляем lastMessage в чате, если messages не пустой
      let updatedChats = currentState.chats;
      if (Array.isArray(action.messages) && action.messages.length > 0) {
        const lastMsg = action.messages[action.messages.length - 1];
        updatedChats = currentState.chats.map(chat =>
          chat._id === lastMsg.chat ? { ...chat, lastMessage: lastMsg } : chat
        );
      }
      return {
        ...currentState,
        messages: Array.isArray(action.messages) ? action.messages : [],
        chats: updatedChats,
        loadingMessages: false
      };
    }

    case 'ADD_MESSAGE': {
      const newMessage = action.message && typeof action.message === 'object' ? action.message : null;
      let updatedChats = currentState.chats;
      if (newMessage) {
        updatedChats = currentState.chats.map(chat =>
          chat._id === newMessage.chat ? { ...chat, lastMessage: newMessage } : chat
        );
      }
      return {
        ...currentState,
        messages: newMessage ? [...currentState.messages, newMessage] : currentState.messages,
        chats: updatedChats
      };
    }

    case 'UPDATE_MESSAGE':
      return validateState({
        ...currentState,
        messages: currentState.messages.map(msg => 
          msg._id === action.payload.tempId ? action.payload.newMessage : msg
        )
      });

    case 'SET_ONLINE':
      return validateState({
        ...currentState,
        onlineUsers: Array.isArray(action.users) ? action.users : []
      });

    case 'SET_TYPING':
      return validateState({
        ...currentState,
        typingUsers: Array.isArray(action.users) ? action.users : []
      });

    case 'SET_UNREAD':
      return validateState({
        ...currentState,
        unread: action.unread && typeof action.unread === 'object' ? action.unread : {}
      });

    case 'SET_LOADING_CHATS':
      return validateState({
        ...currentState,
        loadingChats: Boolean(action.value)
      });

    case 'SET_LOADING_MESSAGES':
      return validateState({
        ...currentState,
        loadingMessages: Boolean(action.value)
      });

    case 'RESET_STATE':
      return validateState(initialState);

    default:
      return currentState;
  }
}

export const MessengerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const socketRef = useRef();
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const normalizeId = (id) => {
    if (!id) return '';
    return typeof id === 'string' ? id : id.toString();
  };
  const normalizeServerMsg = (msg, currentUserId) => {
    if (!msg || typeof msg !== 'object') return null;
    
    const normalized = { ...msg };
    const currentUserIdStr = normalizeId(currentUserId);

    if (typeof msg.sender === 'string') {
      normalized.sender = {
        _id: msg.sender,
        username: normalizeId(msg.sender) === currentUserIdStr ? 'Вы' : 'Пользователь',
        avatar: ''
      };
    } else if (msg.sender && typeof msg.sender === 'object') {
      normalized.sender = {
        _id: normalizeId(msg.sender._id),
        username: msg.sender.username || 'Пользователь',
        avatar: msg.sender.avatar || ''
      };
    }
    
    return normalized;
  };

  useEffect(() => {
    if (!token) return;
    
    const fetchChats = async () => {
      try {
        dispatch({ type: 'SET_LOADING_CHATS', value: true });
        const res = await axios.get('/api/messenger/chats', { 
          headers: { 'x-auth-token': token } 
        });
        
        dispatch({ 
          type: 'SET_CHATS', 
          chats: Array.isArray(res.data) ? res.data : [] 
        });
      } catch (error) {
        console.error('Failed to load chats:', error);
        dispatch({ type: 'SET_CHATS', chats: [] });
      } finally {
        dispatch({ type: 'SET_LOADING_CHATS', value: false });
      }
    };

    const fetchUnread = async () => {
      try {
        const res = await axios.get('/api/messenger/messages/unread-count', {
          headers: { 'x-auth-token': token }
        });
        dispatch({ type: 'SET_UNREAD', unread: res.data });
      } catch (error) {
        console.error('Failed to load unread counts:', error);
        dispatch({ type: 'SET_UNREAD', unread: {} });
      }
    };

    fetchChats();
    fetchUnread();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const socket = io('http://localhost:5000', { 
      auth: { token },
      reconnectionAttempts: 3,
      timeout: 5000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('online', users => {
      dispatch({ 
        type: 'SET_ONLINE', 
        users: Array.isArray(users) ? users : [] 
      });
    });

    socket.on('message', msg => {
      if (!msg || !msg.chat) return;
      
      const normalizedMsg = normalizeServerMsg(msg, user?._id);
      if (normalizedMsg) {
        dispatch({ 
          type: 'ADD_MESSAGE', 
          message: normalizedMsg 
        });
      }
    });

    socket.on('typing', users => {
      dispatch({ 
        type: 'SET_TYPING', 
        users: Array.isArray(users) ? users : [] 
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user?._id]);

  const loadMessages = async (chatId, limit = 20) => {
    if (!chatId) return;
    
    try {
      dispatch({ type: 'SET_LOADING_MESSAGES', value: true });
      dispatch({ type: 'SET_CURRENT_CHAT', chatId });
      
      const { data } = await axios.get(
        `/api/messenger/messages/${chatId}?limit=${limit}`, 
        { headers: { 'x-auth-token': token } }
      );

      const normalizedMessages = Array.isArray(data) 
        ? data.map(msg => normalizeServerMsg(msg, user?._id)).filter(Boolean)
        : [];

      dispatch({ 
        type: 'SET_MESSAGES', 
        messages: normalizedMessages 
      });
      socketRef.current?.emit('join', chatId);
    } catch (error) {
      console.error('Failed to load messages:', error);
      dispatch({ type: 'SET_MESSAGES', messages: [] });
    } finally {
      dispatch({ type: 'SET_LOADING_MESSAGES', value: false });
    }
  };

  const sendMessage = async (chatId, text) => {
    if (!chatId || !text || !user?._id || !socketRef.current) {
      console.error('Invalid message data:', { chatId, text, user });
      return;
    }
    const currentUserId = normalizeId(user._id);
    const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMsg = {
      _id: tempId,
      chat: chatId,
      sender: { 
        _id: currentUserId, 
        username: user.username || 'Вы', 
        avatar: user.avatar || '' 
      },
      text,
      createdAt: new Date().toISOString(),
      read: false
    };

    dispatch({ type: 'ADD_MESSAGE', message: optimisticMsg });

    try {
      socketRef.current.emit('message', { chatId, text });
      const response = await axios.post(
        '/api/messenger/messages',
        { chat: chatId, text, sender: currentUserId },
        { headers: { 'x-auth-token': token } }
      );

      const serverMsg = normalizeServerMsg(response.data, currentUserId);
      if (serverMsg) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            tempId: optimisticMsg._id,
            newMessage: serverMsg
          }
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({
        type: 'SET_MESSAGES',
        messages: state.messages.filter(msg => msg._id !== tempId)
      });
    }
  };
  const sendTyping = (chatId, isTyping) => {
    if (!chatId) return;
    socketRef.current?.emit('typing', { chatId, isTyping });
  };

  const openChat = async (userId) => {
    if (!userId) return;
    try {
      const existingChat = state.chats.find(c => 
        c.participants?.some(p => normalizeId(p._id) === normalizeId(userId))
      );

      if (existingChat) {
        loadMessages(existingChat._id);
        return;
      }

      const { data } = await axios.post(
        '/api/messenger/chats',
        { userId },
        { headers: { 'x-auth-token': token } }
      );

      if (data?._id) {
        dispatch({ 
          type: 'SET_CHATS', 
          chats: [data, ...state.chats] 
        });
        loadMessages(data._id);
      }
    } catch (error) {
      console.error('Failed to open chat:', error);
    }
  };

  const contextValue = useMemo(() => ({
    ...state,
    loadMessages,
    sendMessage,
    sendTyping,
    openChat
  }), [state]);

  return (
    <MessengerContext.Provider value={contextValue}>
      {children}
    </MessengerContext.Provider>
  );
};

MessengerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
};