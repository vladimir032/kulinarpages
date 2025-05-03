import React from 'react';
import UserSearch from './UserSearch';
import { useAuth } from '../../context/AuthContext';

export default function UserSearchWrapper(props) {
  const { user } = useAuth();
  return <UserSearch currentUserId={user?._id} {...props} />;
}
