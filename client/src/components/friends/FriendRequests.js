import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Paper, Stack, Button } from '@mui/material';

const FriendRequests = ({ userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    axios.get(`/api/users/friend-requests/${userId}`)
      .then(response => {
        setFriendRequests(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке заявок:', error);
      });
  }, [userId]);

  const acceptRequest = (targetUserId) => {
    axios.post('/api/users/friend/accept', { userId, targetUserId })
      .then(() => {
        setFriendRequests(friendRequests.filter(request => request.userId !== targetUserId));
      })
      .catch(error => {
        console.error('Ошибка при принятии заявки:', error);
      });
  };

  const rejectRequest = (targetUserId) => {
    axios.post('/api/users/friend/reject', { userId, targetUserId })
      .then(() => {
        // список при отклонении
        setFriendRequests(friendRequests.filter(request => request.userId !== targetUserId));
      })
      .catch(error => {
        console.error('Ошибка при отклонении заявки:', error);
      });
  };

  return (
    <Box maxWidth="md" mx="auto" py={6}>
      <Typography variant="h4" fontWeight={700} color="primary" align="center" mb={4}>
        Заявки в друзья
      </Typography>
      {friendRequests.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Нет новых заявок в друзья
        </Typography>
      ) : (
        <Stack spacing={2}>
          {friendRequests.map(request => (
            <Paper
              key={request.userId}
              elevation={2}
              sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.015)', boxShadow: 6 } }}
            >
              <Avatar
                src={request.avatar ? (request.avatar.startsWith('http') ? request.avatar : `http://localhost:5000${request.avatar}`) : '/avatar.png'}
                alt={request.username}
                sx={{ width: 56, height: 56, mr: 2, bgcolor: 'blue.100', border: 2, borderColor: 'primary.light' }}
                imgProps={{ onError: e => { e.target.onerror = null; e.target.src = '/avatar.png'; } }}
              >
                {!request.avatar && request.username[0]}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" color="text.primary">
                  {request.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.status || 'Без статуса'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => acceptRequest(request.userId)}
                sx={{ ml: 2, minWidth: 100, fontWeight: 600, boxShadow: 2 }}
              >
                Принять
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => rejectRequest(request.userId)}
                sx={{ ml: 2, minWidth: 100, fontWeight: 600, borderWidth: 2 }}
              >
                Отклонить
              </Button>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FriendRequests;
