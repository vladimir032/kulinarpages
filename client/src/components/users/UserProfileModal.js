import React, { useState } from 'react';
import { Modal, Paper, IconButton, Box, Avatar, Typography, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useMessenger } from '../../context/MessengerContext';

export default function UserProfileModal({ open, user, onClose, currentUserId }) {
  const [status, setStatus] = useState('idle'); 
  const { openChat } = useMessenger();

  const handleSubscribe = async () => {
    setStatus('pending');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/add', {
        userId: currentUserId,
        targetUserId: user._id,
        action: 'follow'
      }, {
        headers: { 'x-auth-token': token }
      });
      setStatus('success');
      alert('Вы успешно подписались!');
    } catch (error) {
      setStatus('error');
      alert('Ошибка при подписке');
    }
  };

  const handleSendFriendRequest = async () => {
    setStatus('pending');
    try {
      const token = localStorage.getItem('token');
      console.log('[FRIEND REQUEST] currentUserId (отправитель):', currentUserId);
      console.log('[FRIEND REQUEST] user._id (получатель):', user?._id);
      console.log('[FRIEND REQUEST] user объект:', user);
      const response = await axios.post('/api/users/add', {
        userId: currentUserId,
        targetUserId: user._id,
        action: 'friend'
      }, {
        headers: { 'x-auth-token': token }
      });
      console.log('[FRIEND REQUEST] Ответ сервера:', response?.data);
      setStatus('success');
      alert('Заявка на дружбу отправлена');
    } catch (error) {
      setStatus('error');
      console.error('[FRIEND REQUEST] Ошибка:', error);
      alert('Ошибка при отправке заявки');
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
          <Avatar 
            src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : undefined} 
            sx={{ width: 80, height: 80, mb: 1 }}
          >
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6">{user.username}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
          {user.status && <Typography sx={{ mt: 1 }}>{user.status}</Typography>}
        </Box>

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={async () => {
                    await openChat(user._id);
                    if (typeof window !== 'undefined') {
                      // открваем MessengerModal
                      const evt = new CustomEvent('open-messenger');
                      window.dispatchEvent(evt);
                    }
                    onClose();
                  }}
                >
                  Написать
                </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleSubscribe}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Подписка...' : 'Подписаться'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleSendFriendRequest}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Отправка заявки...' : 'Отправить заявку в друзья'}
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose} sx={{ mt: 2 }}>
          Закрыть
        </Button>
      </Paper>
    </Modal>
  );
}
