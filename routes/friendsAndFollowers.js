const express = require('express');
const router = express.Router();
const Friend = require('../models/friend');
const Follower = require('../models/Follower');
const auth = require('../middleware/auth');

// Отправить заявку в друзья
router.post('/add', auth, async (req, res) => {
  const { userId, targetUserId, action } = req.body;

  // Проверка обязательных полей
  if (!userId || !targetUserId) {
    console.error('userId или targetUserId не переданы', { userId, targetUserId, action });
    return res.status(400).json({ message: 'userId и targetUserId обязательны' });
  }
  if (userId === targetUserId) {
    return res.status(400).json({ message: 'Нельзя добавить себя в друзья или подписаться на себя' });
  }

  try {
    if (action === 'friend') {
      // Проверка, если запрос уже существует
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

      // Создаем новый запрос на дружбу
      console.log('Создаём Friend:', { user: targetUserId, friend: userId });
      const newFriendRequest = new Friend({
        user: targetUserId,
        friend: userId,
        status: 'pending'
      });
      await newFriendRequest.save();
      return res.status(200).json({ message: 'Запрос на дружбу отправлен.' });
    }

    if (action === 'follow') {
      // Проверка, если пользователь уже подписан
      const existingFollower = await Follower.findOne({ user: targetUserId, follower: userId });

      if (existingFollower) {
        return res.status(400).json({ message: 'Вы уже подписаны на этого пользователя.' });
      }

      // Создаем новую подписку
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

// Подтвердить заявку в друзья
router.post('/friend/accept', async (req, res) => {
  const { userId, targetUserId } = req.body;

  try {
    const friendRequest = await Friend.findOne({ user: targetUserId, friend: userId, status: 'pending' });

    if (!friendRequest) {
      return res.status(400).json({ message: 'Запрос не найден или уже отклонен.' });
    }

    await friendRequest.acceptRequest();
    res.status(200).json({ message: 'Заявка в друзья подтверждена.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

// Отклонить заявку в друзья
router.post('/friend/reject', async (req, res) => {
  const { userId, targetUserId } = req.body;

  try {
    const friendRequest = await Friend.findOne({ user: targetUserId, friend: userId, status: 'pending' });

    if (!friendRequest) {
      return res.status(400).json({ message: 'Запрос не найден или уже отклонен.' });
    }

    await friendRequest.rejectRequest();
    res.status(200).json({ message: 'Заявка в друзья отклонена.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

// Получить входящие заявки в друзья
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

// Роут для получения списка друзей
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

// Роут для получения списка подписчиков
router.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follower.find({ user: userId }).populate('follower', 'username avatar status');

    const followerList = followers.map(follower => ({
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
