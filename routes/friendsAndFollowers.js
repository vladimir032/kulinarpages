const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');
const Follower = require('../models/Follower');
const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
  const { userId, targetUserId, action } = req.body;
  if (!userId || !targetUserId || !action) {
    console.error('userId, targetUserId или action не переданы', { userId, targetUserId, action });
    return res.status(400).json({ message: 'userId, targetUserId и action обязательны' });
  }
  if (!userId || !targetUserId) {
    console.error('userId или targetUserId не переданы', { userId, targetUserId, action });
    return res.status(400).json({ message: 'userId и targetUserId обязательны' });
  }
  if (userId === targetUserId) {
    return res.status(400).json({ message: 'Нельзя добавить себя в друзья или подписаться на себя' });
  }

  try {
    if (action === 'friend') {
      const existingFriendRequest = await Friend.findOne({
        $or: [
          { user: targetUserId, friend: userId },
          { user: userId, friend: targetUserId }
        ]
      });

      if (existingFriendRequest) {
        if (existingFriendRequest.status === 'pending') {
          return res.status(400).json({ message: 'Запрос на дружбу уже отправлен.' });
        } else if (existingFriendRequest.status === 'accepted') {
          return res.status(400).json({ message: 'Вы уже друзья.' });
        }
      }
      console.log('Создаём Friend:', { user: targetUserId, friend: userId });
      const newFriendRequest = new Friend({
        user: userId,
        friend: targetUserId,
        status: 'pending'
      });
      await newFriendRequest.save();
      return res.status(200).json({ message: 'Запрос на дружбу отправлен.' });
    }

    if (action === 'follow') {
      const existingFollower = await Follower.findOne({ user: targetUserId, follower: userId });

      if (existingFollower) {
        return res.status(400).json({ message: 'Вы уже подписаны на этого пользователя.' });
      }

      console.log('Создаём Follower:', { user: targetUserId, follower: userId });
      const newFollower = new Follower({
        user: targetUserId,
        follower: userId
      });
      await newFollower.save();
      return res.status(200).json({ message: 'Подписка успешно оформлена.' });
    }

    res.status(400).json({ message: 'Неверное действие.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

router.post('/friend/accept', async (req, res) => {
  const { userId, targetUserId } = req.body;
  console.log('[ACCEPT] Запрос на принятие заявки:', { body: req.body });
  try {
    console.log('[ACCEPT] Ищу заявку:', { user: targetUserId, friend: userId, status: 'pending' });
    const friendRequest = await Friend.findOne({ user: targetUserId, friend: userId, status: 'pending' });
    console.log('[ACCEPT] Результат поиска заявки:', friendRequest);
    if (!friendRequest) {
      console.log('[ACCEPT] Не найдено!');
      return res.status(400).json({ message: 'Запрос не найден или уже отклонен.' });
    }
    console.log('[ACCEPT] Принимаем заявку в друзья:', { user: targetUserId, friend: userId });
    await friendRequest.acceptRequest();
    res.status(200).json({ message: 'Заявка в друзья подтверждена.' });
  } catch (error) {
    console.error('[ACCEPT] Ошибка:', error);

    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

router.post('/friend/reject', async (req, res) => {
  const { userId, targetUserId } = req.body;
  console.log('[REJECT] Запрос на отклонение заявки:', { body: req.body });
  try {
    console.log('[REJECT] Ищу заявку:', { user: targetUserId, friend: userId, status: 'pending' });
    const friendRequest = await Friend.findOne({ user: targetUserId, friend: userId, status: 'pending' });
    console.log('[REJECT] Результат поиска заявки:', friendRequest);
    if (!friendRequest) {
      console.log('[REJECT] Не найдено!');
      return res.status(400).json({ message: 'Запрос не найден или уже отклонен.' });
    }
    console.log('[REJECT] Отклоняем заявку в друзья:', { user: targetUserId, friend: userId });
    await friendRequest.rejectRequest();
    res.status(200).json({ message: 'Заявка в друзья отклонена.' });
  } catch (error) {
    console.error('[REJECT] Ошибка:', error);

    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

router.get('/friend-requests/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await Friend.find({ friend: userId, status: 'pending' })
      .populate('user', 'username avatar status');
    const requestList = requests.map(req => ({
      userId: req.user._id, 
      username: req.user.username,
      avatar: req.user.avatar,
      status: req.user.status
    }));
    res.status(200).json(requestList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const friends = await Friend.find({
      $or: [
        { user: userId, status: 'accepted' },
        { friend: userId, status: 'accepted' }
      ]
    }).populate('user friend', 'username avatar status');
    const friendList = friends.map(friend => {
      const friendUser = friend.user._id.toString() === userId ? friend.friend : friend.user;
      return {
        _id: friendUser._id,
        username: friendUser.username,
        avatar: friendUser.avatar,
        status: friendUser.status
      };
    });

    res.status(200).json(friendList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

router.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await Follower.find({ user: userId }).populate('follower', 'username avatar status');
    const followerList = followers.map(follower => ({
      _id: follower.follower._id,
      username: follower.follower.username,
      avatar: follower.follower.avatar,
      status: follower.follower.status
    }));
    res.status(200).json(followerList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});


module.exports = router;
