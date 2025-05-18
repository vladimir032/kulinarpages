import React from 'react';
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
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
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

export default function ProfileView({
  profile,
  editMode,
  form,
  privacy,
  saving,
  statusOptions,
  genderOptions,
  cuisineOptions,
  onEditModeChange,
  onChange,
  onAvatarChange,
  onCoverPhotoChange,
  onHobbiesChange,
  onSave,
  onPrivacyChange
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4 }}>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box
          sx={{
            width: '100%',
            height: isMobile ? 140 : 220,
            background: `url(${editMode ? form.coverPhoto : profile.coverPhoto || ''}) center/cover, linear-gradient(90deg,#ffe0b2,#ffccbc)`,
            borderRadius: 4,
            boxShadow: 2,
          }}
        />
        {editMode && (
          <Button component="label" variant="outlined" size="small" sx={{ position: 'absolute', top: 12, right: 24, zIndex: 2 }}>
            Загрузить фон
            <input type="file" accept="image/*" hidden onChange={onCoverPhotoChange} />
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
                sx={{ width: isMobile ? 80 : 120, height: isMobile ? 80 : 120, fontSize: 48, border: '4px solid #fff', boxShadow: 2, mt: -12 }}
              >
                {!profile.avatar && profile.username[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5">{profile.username}</Typography>
              {!privacy.email && <Typography color="text.secondary">{profile.email}</Typography>}
              {editMode && (
                <Button component="label" variant="outlined" size="small" sx={{ mt: 1 }}>
                  Загрузить фото
                  <input type="file" accept="image/*" hidden onChange={onAvatarChange} />
                </Button>
              )}
              <Box sx={{ width: '100%' }}>
                {editMode ? (
                  <TextField
                    select
                    label="Статус"
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {statusOptions.map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography sx={{ mt: 2 }}><b>Статус:</b> {profile.status}</Typography>
                )}
                  <Stack
                    direction={isMobile ? 'column' : 'row'}
                    spacing={isMobile ? 1.5 : 1}
                    sx={{
                      mt: 2,
                      ...(isMobile
                        ? {}
                        : {
                            justifyContent: 'space-between',
                            width: '100%',
                          }),
                    }}
                  >
                  <Button 
                    variant="contained" fullWidth={isMobile}
                    color="primary" 
                    href="/friends"
                    size="small"
                    sx={{
                      flex: 1,
                      minWidth: 0, 
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      py: 0.5,
                      px: 1,
                      width: '90%',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Друзья
                  </Button>
                  <Button 
                    variant="contained" fullWidth={isMobile}
                    color="secondary" 
                    href="/followers"
                    size="small"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      py: 0.5,
                      px: 1,
                      whiteSpace: 'nowrap',
                      mx: 1,
                    }}
                  >
                    Подписчики
                  </Button>
                  <Button 
                    variant="contained" fullWidth={isMobile}
                    color="warning" 
                    href="/friend-requests"
                    size="small"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      py: 0.5,
                      px: 1,
                      whiteSpace: 'nowrap',
                      width: '90%'
                    }}
                  >
                    Заявки
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  <Typography variant={isMobile ? 'h6' : 'h5'}>О себе</Typography>
                  {editMode ? (
                    <>
                      <TextField
                        label="О себе"
                        name="about"
                        value={form.about}
                        onChange={onChange}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        select
                        label="Пол"
                        name="gender"
                        value={form.gender}
                        onChange={onChange}
                        fullWidth
                      >
                        {genderOptions.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt || 'Не выбрано'}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Дата рождения"
                        name="birthdate"
                        type="date"
                        value={form.birthdate}
                        onChange={onChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Город"
                        name="city"
                        value={form.city}
                        onChange={onChange}
                        fullWidth
                        InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Телефон"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        fullWidth
                        InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Увлечения (через запятую)"
                        name="hobbies"
                        value={form.hobbies.join(', ')}
                        onChange={onHobbiesChange}
                        fullWidth
                      />
                      <TextField
                        select
                        label="Любимая кухня"
                        name="favoriteCuisine"
                        value={form.favoriteCuisine}
                        onChange={onChange}
                        fullWidth
                        InputProps={{ startAdornment: <FavoriteIcon sx={{ mr: 1 }} /> }}
                      >
                        {cuisineOptions.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Профессия"
                        name="profession"
                        value={form.profession}
                        onChange={onChange}
                        fullWidth
                        InputProps={{ startAdornment: <WorkIcon sx={{ mr: 1 }} /> }}
                      />
                      <TextField
                        label="Цитата"
                        name="quote"
                        value={form.quote}
                        onChange={onChange}
                        fullWidth
                        InputProps={{ startAdornment: <FormatQuoteIcon sx={{ mr: 1 }} /> }}
                      />
                      <Box>
                        <Typography sx={{ mb: 1 }}><ColorLensIcon sx={{ mr: 1 }} /> Цвет темы</Typography>
                        <input
                          type="color"
                          name="themeColor"
                          value={form.themeColor}
                          onChange={onChange}
                          style={{ width: 48, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                        />
                      </Box>
                      <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1.5 : 2}>
                        <TextField
                          label="VK"
                          name="vk"
                          value={form.vk}
                          onChange={onChange}
                          fullWidth
                          InputProps={{ startAdornment: <LanguageIcon sx={{ mr: 1 }} /> }}
                        />
                        <TextField
                          label="Telegram"
                          name="telegram"
                          value={form.telegram}
                          onChange={onChange}
                          fullWidth
                          InputProps={{ startAdornment: <TelegramIcon sx={{ mr: 1 }} /> }}
                        />
                        <TextField
                          label="Instagram"
                          name="instagram"
                          value={form.instagram}
                          onChange={onChange}
                          fullWidth
                          InputProps={{ startAdornment: <InstagramIcon sx={{ mr: 1 }} /> }}
                        />
                      </Stack>
                      <TextField
                        label="Сайт/блог"
                        name="website"
                        value={form.website}
                        onChange={onChange}
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
              {editMode && (
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: isMobile ? 2 : 3, bgcolor: '#fafafa' }} elevation={isMobile ? 0 : 1}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Настройки приватности</Typography>
                    <Stack spacing={1}>
                        {[
                            { key: 'email', label: 'email' },
                            { key: 'birthdate', label: 'дату рождения' },
                            { key: 'city', label: 'город' },
                            { key: 'phone', label: 'телефон' },
                            { key: 'vk', label: 'VK' },
                            { key: 'telegram', label: 'Telegram' },
                            { key: 'instagram', label: 'Instagram' },
                            { key: 'website', label: 'сайт/блог' },
                            { key: 'favoriteCuisine', label: 'любимую кухню' },
                            { key: 'profession', label: 'профессию' },
                            { key: 'quote', label: 'цитату' },
                            { key: 'hobbies', label: 'увлечения' },
                            { key: 'gender', label: 'пол' },
                            { key: 'about', label: '"О себе"' }
                        ].map(({ key, label }) => (
                            <label key={key}>
                            <input 
                                type="checkbox" 
                                checked={!!privacy[key]} 
                                onChange={onPrivacyChange(key)} 
                            /> 
                            Скрывать {label}
                            </label>
                        ))}
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} mt={isMobile ? 3 : 4} justifyContent="flex-end">
          {editMode ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={saving}
            >
              Сохранить
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEditModeChange(true)}
            >
              Редактировать
            </Button>
          )}
          {editMode && (
            <Button variant="text" onClick={() => onEditModeChange(false)} disabled={saving}>Отмена</Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}