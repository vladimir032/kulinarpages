import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge, Box, Typography, Skeleton } from '@mui/material';
import { useMessenger } from '../../context/MessengerContext';

export default function ChatList({ onSelect }) {
  const { chats, currentChat, onlineUsers, loadingChats, user, unread } = useMessenger();

  const truncateText = (text) => {
    if (!text) return 'Нет сообщений';
    if (text.length <= 40) return text;
    return text.substring(0, 40).replace(/\s+\S*$/, '...');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loadingChats) {
    return (
      <Box sx={{ width: { xs: '100%', md: 320 }, p: 2 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ width: { xs: '100%', md: 320 }, bgcolor: '#fafafa', borderRight: { md: '1px solid #eee' }, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>Чаты</Typography>
      
      {chats.length === 0 ? (
        <Typography sx={{ p: 2, color: 'text.secondary' }}>
          У вас пока нет чатов
        </Typography>
      ) : (
        <List>
          {chats.map(chat => {
            const other = chat.participants.find(u => u && u._id !== user?._id);
            const isOnline = onlineUsers.includes(other?._id);
            const lastMsgText = truncateText(chat.lastMessage?.text);
            const unreadCount = unread[chat._id] || 0;
            
            return (
              <ListItem
                key={chat._id}
                button
                selected={currentChat === chat._id}
                onClick={() => onSelect(chat._id)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                <ListItemAvatar>
                  <Badge
                    color={unreadCount > 0 ? 'error' : (isOnline ? 'success' : 'default')}
                    badgeContent={unreadCount > 0 ? unreadCount : null}
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar src={other?.avatar}>{other?.username?.[0]?.toUpperCase()}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={other?.username || 'Неизвестный пользователь'}
                  secondary={
                    <>
                      {lastMsgText}
                      {chat.lastMessage?.createdAt && (
                        <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                          {formatDate(chat.lastMessage.createdAt)}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
