import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const Message = ({ message, showDate }) => {
  const { user } = useAuth();
  
  // Защитные проверки данных
  if (!message || !message.sender || !user) {
    console.error('Invalid message or user data:', { message, user });
    return null;
  }

  const senderId = message.sender._id?.toString();
  const userId = user._id?.toString();
  const isMe = senderId === userId;
  const messageDate = new Date(message.createdAt);
  const isValidDate = !isNaN(messageDate.getTime());

  return (
    <>
      {showDate && isValidDate && (
        <Typography sx={{ 
          fontSize: 12, 
          color: 'text.secondary', 
          textAlign: 'center', 
          my: 1 
        }}>
          {messageDate.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })}
        </Typography>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMe ? 'row-reverse' : 'row', 
        alignItems: 'flex-end', 
        mb: 1 
      }}>
        <Avatar 
          src={message.sender.avatar} 
          sx={{ 
            ml: isMe ? 2 : 0, 
            mr: isMe ? 0 : 2, 
            width: 32, 
            height: 32 
          }}
        >
          {message.sender.username?.[0]?.toUpperCase()}
        </Avatar>

        <Box sx={{ 
          bgcolor: isMe ? 'primary.light' : 'grey.100', 
          p: 1.5, 
          borderRadius: 2, 
          maxWidth: '70%', 
          minWidth: 60,
          boxShadow: 1
        }}>
          <Typography sx={{ fontSize: 15, wordBreak: 'break-word' }}>
            {message.text}
          </Typography>
          
          {isValidDate && (
            <Typography sx={{ 
              fontSize: 11, 
              color: 'text.secondary', 
              textAlign: 'right', 
              mt: 0.5 
            }}>
              {messageDate.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      username: PropTypes.string,
      avatar: PropTypes.string
    }),
    text: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ])
  }).isRequired,
  showDate: PropTypes.bool
};

Message.defaultProps = {
  showDate: false
};

export default React.memo(Message);