import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormHelperText,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const { username, email, password, password2 } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (value) => {
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*~(),.?":{}|<>]/.test(value);

    setPasswordRequirements({
      length: hasMinLength,
      uppercase: hasUppercase,
      specialChar: hasSpecialChar,
    });

    if (!hasMinLength || !hasUppercase || !hasSpecialChar) {
      setPasswordError('Пароль не соответствует требованиям');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }

    if (!validatePassword(password)) {
      setError('Пароль не соответствует требованиям');
      return;
    }

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Имя пользователя"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={handleChange}
            error={!!passwordError && password.length > 0}
          />
          {password.length > 0 && (
            <FormHelperText component="div" sx={{ mb: 2 }}>
              <Typography variant="caption" display="block">
                Требования к паролю:
              </Typography>
              <Typography 
                variant="caption" 
                display="block" 
                color={passwordRequirements.length ? 'success.main' : 'error.main'}
              >
                • Не менее 8 символов
              </Typography>
              <Typography 
                variant="caption" 
                display="block" 
                color={passwordRequirements.uppercase ? 'success.main' : 'error.main'}
              >
                • Минимум 1 заглавная буква
              </Typography>
              <Typography 
                variant="caption" 
                display="block" 
                color={passwordRequirements.specialChar ? 'success.main' : 'error.main'}
              >
                • Минимум 1 специальный символ (!@#$%^&* и т.д.)
              </Typography>
            </FormHelperText>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Подтвердите пароль"
            type="password"
            id="password2"
            value={password2}
            onChange={handleChange}
            error={password2.length > 0 && password !== password2}
            helperText={password2.length > 0 && password !== password2 ? 'Пароли не совпадают' : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.specialChar}
          >
            Зарегистрироваться
          </Button>
          <h3 span style={{ textAlign: 'center'}}>Уже есть аккаунт?  <a span style={{textDecoration: 'none', color: '#ff5722'}}href="/login">Войти</a></h3>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;