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
  Container,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMessenger } from '../../context/MessengerContext';

function UserProfileModal({ open, user, onClose, currentUserId }) {
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  const [friendRequestStatus, setFriendRequestStatus] = useState('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
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
      const requestsRes = await axios.get(`/api/friendsAndFollowers/friend-requests/${user._id}`, {
        headers: { 'x-auth-token': token }
      });
      setFriendRequestSent(requestsRes.data.some(r => r.userId === currentUserId));
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
      setSubscribeStatus('success');
      setIsSubscribed(true);
      alert('Вы успешно подписались!');
    } catch (error) {
      setSubscribeStatus('error');
      alert('Ошибка при подписке');
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
      setFriendRequestStatus('success');
      setFriendRequestSent(true);
      alert('Заявка на дружбу отправлена');
    } catch (error) {
      setFriendRequestStatus('error');
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
          color="success"
          fullWidth
          sx={{ mb: 1 }}
          onClick={async () => {
            await openChat(user._id);
            if (typeof window !== 'undefined') {
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
          disabled={isSubscribed || subscribeStatus === 'pending'}
        >
          {isSubscribed ? 'Вы подписаны' : subscribeStatus === 'pending' ? 'Подписка...' : 'Подписаться'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleSendFriendRequest}
          disabled={friendRequestSent || friendRequestStatus === 'pending'}
        >
          {friendRequestSent ? 'Заявка отправлена' : friendRequestStatus === 'pending' ? 'Отправка заявки...' : 'Отправить заявку в друзья'}
        </Button>

        <Button variant="outlined" fullWidth onClick={onClose}>
          Закрыть
        </Button>
      </Paper>
    </Modal>
  );
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
export default function UserSearch({ currentUserId, onUserSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
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
    setHistory(prev => [
      { user, timestamp: Date.now() },
      ...prev.filter(entry => entry.user._id !== user._id)
    ]);
    if (onUserSelect) onUserSelect(user);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

return (
  <Container 
    component="main" 
    maxWidth="md"
    sx={{ 
      mt: 4,
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }}
  >
    <TextField
      label="Поиск пользователя (username или email)"
      value={query}
      onChange={handleInputChange}
      fullWidth
      sx={{ mb: 2 }}
    />

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

    {loading && <CircularProgress size={32} />}
    {error && !loading && <Typography color="error">{error}</Typography>}
    
    <List>
      {results.map(user => (
        <ListItem key={user._id} button onClick={() => handleUserClick(user)}>
          <ListItemAvatar>
            <Avatar src={user.avatar}>
              {user.username[0]?.toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.username} secondary={user.email} />
        </ListItem>
      ))}
    </List>

    <UserProfileModal
      open={modalOpen}
      user={selectedUser}
      onClose={handleModalClose}
      currentUserId={currentUserId}
    />
  </Container>
);
}
