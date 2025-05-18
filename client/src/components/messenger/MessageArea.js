import React, { useEffect, useRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useMessenger } from '../../context/MessengerContext';
import Message from './Message';
import PropTypes from 'prop-types';

const MessageArea = () => {
  const { messages = [], currentChat, chats = [], loadingMessages, typingUsers = [] } = useMessenger();
  const bottomRef = useRef();
  const chat = chats?.find(c => c._id === currentChat) || null;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeTypingUsers = Array.isArray(typingUsers) ? typingUsers : [];

  if (!chat) {
    return (
      <Box sx={{ 
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Typography variant="body1" color="text.secondary">
          Выберите чат для начала общения
        </Typography>
      </Box>
    );
  }

  // Получаем список участников с проверкой
  const participants = Array.isArray(chat.participants) 
    ? chat.participants.filter(Boolean).map(u => u.username).join(', ')
    : '';

  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto',
      p: 2,
      bgcolor: 'background.default'
    }}>
      {/* Заголовок чата */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {participants || 'Групповой чат'}
      </Typography>

      {/* Индикатор загрузки */}
      {loadingMessages && (
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 1 }} />
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        </Box>
      )}

      {/* Сообщения */}
      {!loadingMessages && safeMessages.length === 0 ? (
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography color="text.secondary">
            Нет сообщений. Начните диалог первым!
          </Typography>
        </Box>
      ) : (
        safeMessages.map((msg, i) => {
          const prevDate = i > 0 ? new Date(safeMessages[i-1]?.createdAt).toDateString() : null;
          const currentDate = new Date(msg.createdAt).toDateString();
          const showDate = i === 0 || prevDate !== currentDate;

          return (
            <Message 
              key={msg._id || `msg-${i}`}
              message={msg}
              showDate={showDate}
            />
          );
        })
      )}

      {/* Индикатор набора текста */}
      {safeTypingUsers.length > 0 && (
        <Typography 
          sx={{ 
            fontSize: 13, 
            color: 'primary.main', 
            mt: 1,
            fontStyle: 'italic'
          }}
        >
          {safeTypingUsers.join(', ')} {safeTypingUsers.length > 1 ? 'печатают...' : 'печатает...'}
        </Typography>
      )}

      {/* Якорь для автопрокрутки */}
      <div ref={bottomRef} />
    </Box>
  );
};

MessageArea.propTypes = {
  // Проверка типов для контекста
  context: PropTypes.shape({
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        text: PropTypes.string,
        sender: PropTypes.object,
        createdAt: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date)
        ])
      })
    ),
    currentChat: PropTypes.string,
    chats: PropTypes.array,
    loadingMessages: PropTypes.bool,
    typingUsers: PropTypes.arrayOf(PropTypes.string)
  })
};

export default React.memo(MessageArea);