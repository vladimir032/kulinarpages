import React, { useState, useEffect } from 'react';
import { Modal, Paper, IconButton, Box, Avatar, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useMessenger } from '../../context/MessengerContext';

export default function UserProfileModal({ open, user, onClose, currentUserId }) {
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  const [friendRequestStatus, setFriendRequestStatus] = useState('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none');
  const { openChat } = useMessenger();

  useEffect(() => {
    if (open && user) {
      setSubscribeStatus('idle');
      setFriendRequestStatus('idle');
      checkCurrentStatus();
    }
  }, [open, user]);

  const checkCurrentStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      const followersRes = await axios.get(`/api/friendsAndFollowers/followers/${user._id}`, {
        headers: { 'x-auth-token': token }
      });
      setIsSubscribed(followersRes.data.some(f => f._id === currentUserId));

      const friendsRes = await axios.get(`/api/friendsAndFollowers/friends/${currentUserId}`, {
        headers: { 'x-auth-token': token }
      });
      const requestsRes = await axios.get(`/api/friendsAndFollowers/friend-requests/${currentUserId}`, {
        headers: { 'x-auth-token': token }
      });

      if (friendsRes.data.some(f => f._id === user._id)) {
        setFriendStatus('accepted');
      } else if (requestsRes.data.some(r => r.userId === user._id)) {
        setFriendStatus('pending');
      } else {
        setFriendStatus('none');
      }
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
    }
  };

  const handleSubscribe = async () => {
    setSubscribeStatus('pending');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/add', {
        userId: currentUserId,
        targetUserId: user._id,
        action: 'follow'
      }, {
        headers: { 'x-auth-token': token }
      });
      await checkCurrentStatus();
      setIsSubscribed(true);
      setSubscribeStatus('accepted');
    } catch (error) {
      setSubscribeStatus('error');
    }
  };
  
  const handleSendFriendRequest = async () => {
    setFriendRequestStatus('pending');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/add', {
        userId: currentUserId,
        targetUserId: user._id,
        action: 'friend'
      }, {
        headers: { 'x-auth-token': token }
      });
      await checkCurrentStatus();
      setFriendStatus('pending');
      setFriendRequestStatus('accepted');
    } catch (error) {
      setFriendRequestStatus('error');
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar src={user.avatar} sx={{ width: 80, height: 80, mb: 1 }}>
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6">{user.username}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
        </Box>

        <Button
          variant="contained"
          color="accepted"
          fullWidth
          sx={{ mb: 1 }}
          onClick={async () => {
            await openChat(user._id);
            window.dispatchEvent(new CustomEvent('open-messenger'));
            onClose();
          }}
        >
          Написать
        </Button>

        <Button
          onClick={handleSubscribe}
          disabled={isSubscribed || subscribeStatus === 'pending'}
          variant="contained"
          color="primary"
        >
          {isSubscribed
            ? 'Вы подписаны'
            : subscribeStatus === 'pending'
              ? 'Подписка...'
              : 'Подписаться'}
        </Button>

        <Button
          onClick={handleSendFriendRequest}
          disabled={friendStatus === 'pending' || friendStatus === 'accepted' || friendRequestStatus === 'pending'}
          variant="contained"
          color="secondary"
          sx={{ ml: 2 }}
        >
          {friendStatus === 'accepted'
            ? 'Уже в друзьях'
            : friendStatus === 'pending' || friendRequestStatus === 'pending'
              ? 'Заявка отправлена'
              : 'Отправить заявку в друзья'}
        </Button>
      </Paper>
    </Modal>
  );
}
