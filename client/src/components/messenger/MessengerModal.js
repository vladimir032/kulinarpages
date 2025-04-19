import React, { useState } from 'react';
import { Modal, Box, Paper, IconButton, useMediaQuery, Tabs, Tab, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatList from './ChatList';
import MessageArea from './MessageArea';
import ChatInput from './ChatInput';
import { useMessenger } from '../../context/MessengerContext';

export default function MessengerModal({ open, onClose }) {
  const { currentChat, loadMessages } = useMessenger();
  const mobile = useMediaQuery('(max-width:600px)');
  const [tab, setTab] = useState(0);

  const handleSelectChat = (chatId) => {
    loadMessages(chatId);
    setTab(1);
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', width: mobile ? '100%' : 800, height: mobile ? '100%' : 600, mx: 'auto', mt: mobile ? 0 : 6, bgcolor: 'transparent', outline: 'none' }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}>
              <CloseIcon />
            </IconButton>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #eee', minHeight: 44 }}>
              <Tab label="Чаты" sx={{ minHeight: 44 }}/>
              <Tab label="Диалог" sx={{ minHeight: 44 }} disabled={!currentChat}/>
            </Tabs>
            <Box sx={{ display: tab === 0 ? 'flex' : 'none', flex: 1, overflow: 'hidden' }}>
              <ChatList onSelect={handleSelectChat} />
            </Box>
            <Box sx={{ display: tab === 1 ? 'flex' : 'none', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
              <MessageArea />
              {currentChat && <ChatInput />}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}
