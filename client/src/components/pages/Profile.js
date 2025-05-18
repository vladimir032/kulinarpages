import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import ProfileView from './ProfileView';

const STATUS_OPTIONS = ['готовлю', 'жду вдохновения', 'ищу рецепт'];
const GENDER_OPTIONS = ['мужской', 'женский', 'другое', ''];
const CUISINE_OPTIONS = ['Русская', 'Итальянская', 'Японская', 'Кавказская', 'Французская', 'Мексиканская', 'Азиатская', 'Другая'];

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
    }
    setSaving(false);
  };

  const handlePrivacyChange = (field) => (e) => {
    setPrivacy(p => ({ ...p, [field]: e.target.checked }));
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!profile) return <Box sx={{ p: 4 }}>Ошибка загрузки профиля</Box>;

  return (
    <ProfileView
      profile={profile}
      editMode={editMode}
      form={form}
      privacy={privacy}
      saving={saving}
      statusOptions={STATUS_OPTIONS}
      genderOptions={GENDER_OPTIONS}
      cuisineOptions={CUISINE_OPTIONS}
      onEditModeChange={setEditMode}
      onChange={handleChange}
      onAvatarChange={handleAvatarChange}
      onCoverPhotoChange={handleCoverPhotoChange}
      onHobbiesChange={handleHobbiesChange}
      onSave={handleSave}
      onPrivacyChange={handlePrivacyChange}
    />
  );
}