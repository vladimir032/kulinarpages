import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  MenuItem, 
  Chip, 
  Stack, 
  Paper, 
  CircularProgress, 
  Grid 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

const STATUS_OPTIONS = [
  'готовлю',
  'жду вдохновения',
  'ищу рецепт'
];
const GENDER_OPTIONS = ['мужской', 'женский', 'другое', ''];
const CUISINE_OPTIONS = [
  'Русская', 'Итальянская', 'Японская', 'Кавказская', 'Французская', 'Мексиканская', 'Азиатская', 'Другая'
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [privacy, setPrivacy] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/users/profile', {
        headers: { 'x-auth-token': token }
      });
      setProfile(data);
      setForm({
        coverPhoto: data.coverPhoto || '',
        avatar: data.avatar || '',
        status: data.status || '',
        about: data.about || '',
        gender: data.gender || '',
        hobbies: data.hobbies || [],
        birthdate: data.birthdate || '',
        city: data.city || '',
        phone: data.phone || '',
        vk: data.vk || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        website: data.website || '',
        favoriteCuisine: data.favoriteCuisine || '',
        profession: data.profession || '',
        quote: data.quote || '',
        themeColor: data.themeColor || '#ff5722',
      });
      setPrivacy(data.privacySettings || {});
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, coverPhoto: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleHobbiesChange = (e) => {
    setForm(f => ({ ...f, hobbies: e.target.value.split(',').map(h => h.trim()).filter(Boolean) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.patch('/api/users/profile', { ...form, privacySettings: privacy }, {
        headers: { 'x-auth-token': token }
      });
      setProfile(data);
      setEditMode(false);
    } catch (e) {
      // handle error
    }
    setSaving(false);
  };

  const handlePrivacyChange = (field) => (e) => {
    setPrivacy(p => ({ ...p, [field]: e.target.checked }));
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!profile) return <Box sx={{ p: 4 }}>Ошибка загрузки профиля</Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4 }}>
      {/* COVER PHOTO */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box
          sx={{
            width: '100%',
            height: 220,
            background: `url(${editMode ? form.coverPhoto : profile.coverPhoto || ''}) center/cover, linear-gradient(90deg,#ffe0b2,#ffccbc)`,
            borderRadius: 4,
            boxShadow: 2,
          }}
        />
        {editMode && (
          <Button component="label" variant="outlined" size="small" sx={{ position: 'absolute', top: 12, right: 24, zIndex: 2 }}>
            Загрузить фон
            <input type="file" accept="image/*" hidden onChange={handleCoverPhotoChange} />
          </Button>
        )}
      </Box>
      <Paper sx={{ p: 4, mt: -10, position: 'relative', zIndex: 2 }} elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" spacing={2}>
              <Avatar
                src={editMode ? form.avatar : profile.avatar || ''}
                alt="avatar"
                sx={{ width: 120, height: 120, fontSize: 48, border: '4px solid #fff', boxShadow: 2, mt: -12 }}
              >
                {!profile.avatar && profile.username[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5">{profile.username}</Typography>
              {!privacy.email && <Typography color="text.secondary">{profile.email}</Typography>}
              {editMode && (
                <Button component="label" variant="outlined" size="small" sx={{ mt: 1 }}>
                  Загрузить фото
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </Button>
              )}
              <Box sx={{ width: '100%' }}>
                {editMode ? (
                  <TextField
                    select
                    label="Статус"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography sx={{ mt: 2 }}><b>Статус:</b> {profile.status}</Typography>
                )}
              </Box>
              {/* Статистика */}
              
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ mb: 1 }}>О себе</Typography>
                  {editMode ? (
                    <>
                      <TextField
                        label="О себе"
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        select
                        label="Пол"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        fullWidth
                      >
                        {GENDER_OPTIONS.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt || 'Не выбрано'}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Дата рождения"
                        name="birthdate"
                        type="date"
                        value={form.birthdate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Город"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Телефон"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Увлечения (через запятую)"
                        name="hobbies"
                        value={form.hobbies.join(', ')}
                        onChange={handleHobbiesChange}
                        fullWidth
                      />
                      <TextField
                        select
                        label="Любимая кухня"
                        name="favoriteCuisine"
                        value={form.favoriteCuisine}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ startAdornment: <FavoriteIcon sx={{ mr: 1 }} /> }}
                      >
                        {CUISINE_OPTIONS.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Профессия"
                        name="profession"
                        value={form.profession}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ startAdornment: <WorkIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Цитата"
                        name="quote"
                        value={form.quote}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{ startAdornment: <FormatQuoteIcon sx={{ mr: 1 }} /> }}
                      />
                      <Box>
                        <Typography sx={{ mb: 1 }}><ColorLensIcon sx={{ mr: 1 }} /> Цвет темы</Typography>
                        <input
                          type="color"
                          name="themeColor"
                          value={form.themeColor}
                          onChange={handleChange}
                          style={{ width: 48, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                        />
                      </Box>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="VK"
                          name="vk"
                          value={form.vk}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{ startAdornment: <LanguageIcon sx={{ mr: 1 }} /> }}
                        />
                        <TextField
                          label="Telegram"
                          name="telegram"
                          value={form.telegram}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{ startAdornment: <TelegramIcon sx={{ mr: 1 }} /> }}
                        />
                        <TextField
                          label="Instagram"
                          name="instagram"
                          value={form.instagram}
                          onChange={handleChange}
                          fullWidth
                          InputProps={{ startAdornment: <InstagramIcon sx={{ mr: 1 }} /> }}
                        />
                      </Stack>
                      <TextField
                        label="Сайт/блог"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        fullWidth
                      />
                    </>
                  ) : (
                    <Stack spacing={1}>
                      <Typography><b>Статус:</b> {profile.status}</Typography>
                      {!privacy.about && <Typography><b>О себе:</b> {profile.about || '—'}</Typography>}
                      {!privacy.gender && <Typography><b>Пол:</b> {profile.gender || '—'}</Typography>}
                      {!privacy.birthdate && <Typography><CakeIcon sx={{ mr: 1, fontSize: 18 }} /><b>Дата рождения:</b> {profile.birthdate || '—'}</Typography>}
                      {!privacy.city && <Typography><LocationOnIcon sx={{ mr: 1, fontSize: 18 }} /><b>Город:</b> {profile.city || '—'}</Typography>}
                      {!privacy.phone && <Typography><PhoneIcon sx={{ mr: 1, fontSize: 18 }} /><b>Телефон:</b> {profile.phone || '—'}</Typography>}
                      {!privacy.hobbies && <Typography><b>Увлечения:</b> {profile.hobbies && profile.hobbies.length > 0 ? (
                        profile.hobbies.map((h, i) => <Chip key={i} label={h} sx={{ mr: 0.5 }} />)
                      ) : '—'}</Typography>}
                      {!privacy.favoriteCuisine && <Typography><FavoriteIcon sx={{ mr: 1, fontSize: 18 }} /><b>Любимая кухня:</b> {profile.favoriteCuisine || '—'}</Typography>}
                      {!privacy.profession && <Typography><WorkIcon sx={{ mr: 1, fontSize: 18 }} /><b>Профессия:</b> {profile.profession || '—'}</Typography>}
                      {!privacy.quote && <Typography><FormatQuoteIcon sx={{ mr: 1, fontSize: 18 }} /><b>Цитата:</b> {profile.quote || '—'}</Typography>}
                      <Typography><ColorLensIcon sx={{ mr: 1, fontSize: 18 }} /><b>Цвет темы:</b> <span style={{ display: 'inline-block', width: 16, height: 16, background: profile.themeColor, borderRadius: 4, border: '1px solid #ccc', verticalAlign: 'middle' }}></span></Typography>
                      {!privacy.vk && <Typography><b>VK:</b> {profile.vk ? <a href={profile.vk} target="_blank" rel="noopener noreferrer">{profile.vk}</a> : '—'}</Typography>}
                      {!privacy.telegram && <Typography><b>Telegram:</b> {profile.telegram ? <a href={profile.telegram} target="_blank" rel="noopener noreferrer">{profile.telegram}</a> : '—'}</Typography>}
                      {!privacy.instagram && <Typography><b>Instagram:</b> {profile.instagram ? <a href={profile.instagram} target="_blank" rel="noopener noreferrer">{profile.instagram}</a> : '—'}</Typography>}
                      {!privacy.website && <Typography><b>Сайт/блог:</b> {profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a> : '—'}</Typography>}
                    </Stack>
                  )}
                </Stack>
              </Grid>
              {/* Privacy settings */}
              {editMode && (
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: '#fafafa' }} elevation={1}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Настройки приватности</Typography>
                    <Stack spacing={1}>
                      <label><input type="checkbox" checked={!!privacy.email} onChange={handlePrivacyChange('email')} /> Скрывать email</label>
                      <label><input type="checkbox" checked={!!privacy.birthdate} onChange={handlePrivacyChange('birthdate')} /> Скрывать дату рождения</label>
                      <label><input type="checkbox" checked={!!privacy.city} onChange={handlePrivacyChange('city')} /> Скрывать город</label>
                      <label><input type="checkbox" checked={!!privacy.phone} onChange={handlePrivacyChange('phone')} /> Скрывать телефон</label>
                      <label><input type="checkbox" checked={!!privacy.vk} onChange={handlePrivacyChange('vk')} /> Скрывать VK</label>
                      <label><input type="checkbox" checked={!!privacy.telegram} onChange={handlePrivacyChange('telegram')} /> Скрывать Telegram</label>
                      <label><input type="checkbox" checked={!!privacy.instagram} onChange={handlePrivacyChange('instagram')} /> Скрывать Instagram</label>
                      <label><input type="checkbox" checked={!!privacy.website} onChange={handlePrivacyChange('website')} /> Скрывать сайт/блог</label>
                      <label><input type="checkbox" checked={!!privacy.favoriteCuisine} onChange={handlePrivacyChange('favoriteCuisine')} /> Скрывать любимую кухню</label>
                      <label><input type="checkbox" checked={!!privacy.profession} onChange={handlePrivacyChange('profession')} /> Скрывать профессию</label>
                      <label><input type="checkbox" checked={!!privacy.quote} onChange={handlePrivacyChange('quote')} /> Скрывать цитату</label>
                      <label><input type="checkbox" checked={!!privacy.hobbies} onChange={handlePrivacyChange('hobbies')} /> Скрывать увлечения</label>
                      <label><input type="checkbox" checked={!!privacy.gender} onChange={handlePrivacyChange('gender')} /> Скрывать пол</label>
                      <label><input type="checkbox" checked={!!privacy.about} onChange={handlePrivacyChange('about')} /> Скрывать "О себе"</label>
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          {editMode ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              Сохранить
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Редактировать
            </Button>
          )}
          {editMode && (
            <Button variant="text" onClick={() => setEditMode(false)} disabled={saving}>Отмена</Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

