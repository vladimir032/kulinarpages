import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Modal,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMessenger } from '../../context/MessengerContext';

// Модальное окно профиля пользователя (упрощённая версия)
function UserProfileModal({ open, user, onClose }) {
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
          <Typography sx={{ mt: 1 }}>{user.status || ''}</Typography>
          {user.phone && <Typography sx={{ mt: 1 }}>{user.phone}</Typography>}
          {user.city && <Typography sx={{ mt: 1 }}>{user.city}</Typography>}
          {user.instagram && <Typography sx={{ mt: 1 }}>{user.instagram}</Typography>}
          {user.telegram && <Typography sx={{ mt: 1 }}>{user.telegram}</Typography>}
          {user.youtube && <Typography sx={{ mt: 1 }}>{user.youtube}</Typography>}
          {user.vk && <Typography sx={{ mt: 1 }}>{user.vk}</Typography>}
          {user.gender && <Typography sx={{ mt: 1 }}>{user.gender}</Typography>}
          {user.about && <Typography sx={{ mt: 1 }}>{user.about}</Typography>}
          {user.hobbies && <Typography sx={{ mt: 1 }}>{user.hobbies}</Typography>}
          {user.favoriteRecipes && <Typography sx={{ mt: 1 }}>{user.favoriteRecipes}</Typography>}

        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
          onClick={async () => {
            await openChat(user._id);
            if (typeof window !== 'undefined') {
              // Открыть MessengerModal (если есть глобальный стейт)
              const evt = new CustomEvent('open-messenger');
              window.dispatchEvent(evt);
            }
            onClose();
          }}
        >
          Написать
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose}>Закрыть</Button>
      </Paper>
    </Modal>
  );
}

export default function UserSearch({ currentUserId, onUserSelect }) {
  const { openChat, setMessengerOpen, setActiveTab } = useMessenger();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState([]); // [{ user, timestamp }]

  // Форматировать дату/время (МСК, DD.MM.YYYY HH:mm)
  const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Moscow'
    });
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (!searchValue.trim()) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/users/search`, {
          params: { query: searchValue, limit: 10, page: 1 },
          headers: { 'x-auth-token': token }
        });
        if (data.results.length === 0) {
          setError('Пользователи не найдены');
        } else {
          setError('');
        }
        setResults(data.results);
      } catch (e) {
        setError('Ошибка поиска пользователей');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };



  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    // История: если пользователь уже есть, обновить время и переместить вверх
    setHistory(prev => {
      const filtered = prev.filter(item => item.user._id !== user._id);
      return [{ user, timestamp: Date.now() }, ...filtered];
    });
    if (onUserSelect) onUserSelect(user);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <TextField
        label="Поиск пользователя (username или email)"
        value={query}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      {/* История поиска */}
      {history.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>История поиска</Typography>
          <List sx={{ bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
            {history.map(item => (
              <ListItem
                key={item.user._id}
                button
                onClick={() => handleUserClick(item.user)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                <ListItemAvatar>
                  <Avatar src={item.user.avatar}>
                    {item.user.username[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.user.username}
                  secondary={item.user.email}
                />
                <Typography sx={{ minWidth: 120, textAlign: 'right', color: 'text.secondary', fontSize: 13 }}>
                  {formatDate(item.timestamp)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={32} />
        </Box>
      )}
      {error && !loading && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>
      )}
      {!loading && !error && results.length > 0 && (
        <List>
          {results.map(user => (
            <ListItem
              key={user._id}
              button
              onClick={() => handleUserClick(user)}
              sx={{ borderBottom: '1px solid #eee', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              disabled={user._id === currentUserId}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar}>
                  {user.username[0]?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}
      <UserProfileModal open={modalOpen} user={selectedUser} onClose={handleModalClose} />
    </Box>
  );
}
