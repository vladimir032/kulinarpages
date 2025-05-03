import React from 'react';
import { useAuth } from '../../context/AuthContext';
import FriendsList from './FriendsList';
import FollowersList from './FollowersList';
import FriendRequests from './FriendRequests';

export function FriendsListWrapper(props) {
  const { user } = useAuth();
  return <FriendsList userId={user?._id} {...props} />;
}

export function FollowersListWrapper(props) {
  const { user } = useAuth();
  return <FollowersList userId={user?._id} {...props} />;
}

export function FriendRequestsWrapper(props) {
  const { user } = useAuth();
  return <FriendRequests userId={user?._id} {...props} />;
}
