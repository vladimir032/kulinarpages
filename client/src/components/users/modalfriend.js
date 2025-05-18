import React, { useState } from 'react';
import { Modal, Paper, IconButton, Box, Avatar, Typography, Button, TextField, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useMessenger } from '../../context/MessengerContext';

export default function UserProfileModal({ open, user, onClose, currentUserId }) {
  const { openChat } = useMessenger();
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
          {user.status && <Typography sx={{ mt: 1 }}>{user.status}</Typography>}
        </Box>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mb: 1 }}
            onClick={async () => {
              try {
                console.log('[MODALFRIEND] Попытка открыть чат:');
                console.log('[MODALFRIEND] currentUserId:', currentUserId);
                console.log('[MODALFRIEND] user._id (собеседник):', user?._id);
                console.log('[MODALFRIEND] user объект:', user);
                await openChat(user._id);
                if (typeof window !== 'undefined') {
                  const evt = new CustomEvent('open-messenger');
                  window.dispatchEvent(evt);
                }
                onClose();
              } catch (e) {
                console.error('[MODALFRIEND] Ошибка при открытии чата:', e);
              }
            }}
          >
            Написать
          </Button>
      </Paper>
    </Modal>
  );
}
