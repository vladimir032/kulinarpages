import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import UserProfileModal from '../users/modalfriend';
import { useAuth } from '../../context/AuthContext';


const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?._id;

  // Лог для отладки
  React.useEffect(() => {
    if (modalOpen && selectedUser) {
      console.log('[FRIENDSLIST] Открыта модалка для:', selectedUser);
      console.log('[FRIENDSLIST] currentUserId:', currentUserId);
      console.log('[FRIENDSLIST] Проверка currentUserId:', user?._id === currentUserId);
    }
  }, [modalOpen, selectedUser, currentUserId]);

  useEffect(() => {
    axios.get(`/api/users/friends/${userId}`)
      .then(response => {
        setFriends(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении списка друзей:', error);
      });
  }, [userId]);

  return (
    <Box maxWidth="md" mx="auto" py={6}>
      <Typography variant="h4" fontWeight={700} color="primary" align="center" mb={4}>
        Мои друзья
      </Typography>
      {friends.length === 0 ? (
        <Typography align="center" color="text.secondary">
          У вас пока нет друзей <span role="img" aria-label="Нет друзей">😢</span>
        </Typography>
      ) : (
        <Stack spacing={2}>
          {friends.map(friend => (
              <Paper
                key={friend.username}
                elevation={2}
                sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.015)', boxShadow: 6 }, cursor: 'pointer' }}
                onClick={() => { setSelectedUser(friend); setModalOpen(true); }}
              >
              <Avatar
                src={friend.avatar || '/avatar.png'}
                alt={friend.username}
                sx={{ width: 56, height: 56, mr: 2, bgcolor: 'green.100', border: 2, borderColor: 'success.light' }}
                imgProps={{ onError: e => { e.target.onerror = null; e.target.src = '/avatar.png'; } }}
              >
                {!friend.avatar && friend.username[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" color="text.primary">
                  {friend.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {friend.status || 'Без статуса'}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
      <UserProfileModal
        open={modalOpen}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        currentUserId={currentUserId}
      />
    </Box>
  );
};

export default FriendsList;
