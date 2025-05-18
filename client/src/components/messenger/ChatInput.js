import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, InputAdornment, Popover } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import { useMessenger } from '../../context/MessengerContext';

export default function ChatInput() {
  const { currentChat, sendMessage, sendTyping } = useMessenger();
  const [text, setText] = useState('');
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const inputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(currentChat, text);
      setText('');
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    sendTyping(currentChat, !!e.target.value);
  };

  const handleEmojiClick = (emojiData) => {
    setText(prevText => prevText + emojiData.emoji);
    inputRef.current.focus();
  };

  const openEmojiPicker = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const closeEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  return (
    <Box component="form" onSubmit={handleSend} sx={{ 
      display: 'flex', 
      p: 2, 
      borderTop: '1px solid #eee', 
      bgcolor: '#fff',
      alignItems: 'center'
    }}>
      <TextField
        inputRef={inputRef}
        value={text}
        onChange={handleTyping}
        placeholder="Введите сообщение..."
        fullWidth
        size="small"
        sx={{ mr: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={openEmojiPicker}>
                <EmojiEmotionsIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      
      <IconButton 
        type="submit" 
        color="primary" 
        disabled={!text.trim()}
        sx={{ ml: 1 }}
      >
        <SendIcon />
      </IconButton>

      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={closeEmojiPicker}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '& .EmojiPickerReact': {
            boxShadow: 'none',
            border: '1px solid #ddd'
          }
        }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width={300}
          height={350}
          searchDisabled={false}
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
          categories={[
            { category: 'smileys_people', name: 'Смайлы' },
            { category: 'animals_nature', name: 'Животные и природа' },
            { category: 'food_drink', name: 'Еда и напитки' },
            { category: 'travel_places', name: 'Путешествия' },
            { category: 'activities', name: 'Активности' },
            { category: 'objects', name: 'Объекты' },
            { category: 'symbols', name: 'Символы' },
            { category: 'flags', name: 'Флаги' }
          ]}
        />
      </Popover>
    </Box>
  );
}