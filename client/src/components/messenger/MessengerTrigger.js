import React, { useState, useEffect } from 'react';
import MessengerModal from './MessengerModal';

export default function MessengerTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-messenger', handler);
    return () => window.removeEventListener('open-messenger', handler);
  }, []);

  return <MessengerModal open={open} onClose={() => setOpen(false)} />;
}
