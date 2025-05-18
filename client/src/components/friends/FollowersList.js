import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import UserProfileModal from '../users/modalfriend';
import { useAuth } from '../../context/AuthContext';

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?._id;

  useEffect(() => {
    axios.get(`/api/users/followers/${userId}`)
      .then(response => {
        setFollowers(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении списка подписчиков:', error);
      });
  }, [userId]);

  return (
    <>
      <Box maxWidth="md" mx="auto" py={6}>
        <Typography variant="h4" fontWeight={700} color="primary" align="center" mb={4}>
          Мои подписчики
        </Typography>
        {followers.length === 0 ? (
          <Typography align="center" color="text.secondary">
            У вас пока нет подписчиков <span role="img" aria-label="Нет подписчиков">😢</span>
          </Typography>
        ) : (
          <Stack spacing={2}>
            {followers.map(follower => (
              <Paper
                key={follower.username}
                elevation={2}
                sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.015)', boxShadow: 6 }, cursor: 'pointer' }}
                onClick={() => { setSelectedUser(follower); setModalOpen(true); }}
              >
                <Avatar
                  src={follower.avatar || '/avatar.png'}
                  alt={follower.username}
                  sx={{ width: 56, height: 56, mr: 2, bgcolor: 'indigo.100', border: 2, borderColor: 'primary.light' }}
                  imgProps={{ onError: e => { e.target.onerror = null; e.target.src = '/avatar.png'; } }}
                >
                  {!follower.avatar && follower.username[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.primary">
                    {follower.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {follower.status || 'Без статуса'}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      <UserProfileModal
        open={modalOpen}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default FollowersList;
