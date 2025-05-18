/**
 * @swagger
 * components:
 *   schemas:
 *     FriendRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя, отправляющего запрос
 *         targetUserId:
 *           type: string
 *           description: ID пользователя, которому отправляется запрос
 *         action:
 *           type: string
 *           enum: [friend, follow]
 *           description: Тип действия (дружба или подписка)
 *     FriendRequestAction:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя, принимающего/отклоняющего запрос
 *         targetUserId:
 *           type: string
 *           description: ID пользователя, отправившего запрос
 *     FriendRequestItem:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя, отправившего запрос
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         avatar:
 *           type: string
 *           description: URL аватара пользователя
 *         status:
 *           type: string
 *           description: Статус пользователя
 *     FriendItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         avatar:
 *           type: string
 *           description: URL аватара пользователя
 *         status:
 *           type: string
 *           description: Статус пользователя
 */

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: API для работы с друзьями и подписчиками
 */

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Добавить друга или подписаться на пользователя
 *     tags: [Friends]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequest'
 *     responses:
 *       200:
 *         description: Запрос успешно отправлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Запрос на дружбу отправлен.
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Запрос на дружбу уже отправлен.
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/friend/accept:
 *   post:
 *     summary: Принять запрос на дружбу
 *     tags: [Friends]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestAction'
 *     responses:
 *       200:
 *         description: Запрос на дружбу принят
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заявка в друзья подтверждена.
 *       400:
 *         description: Запрос не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Запрос не найден или уже отклонен.
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/friend/reject:
 *   post:
 *     summary: Отклонить запрос на дружбу
 *     tags: [Friends]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestAction'
 *     responses:
 *       200:
 *         description: Запрос на дружбу отклонен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заявка в друзья отклонена.
 *       400:
 *         description: Запрос не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Запрос не найден или уже отклонен.
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/friend-requests/{userId}:
 *   get:
 *     summary: Получить список запросов в друзья
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список запросов в друзья
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequestItem'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/friends/{userId}:
 *   get:
 *     summary: Получить список друзей пользователя
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список друзей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendItem'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/followers/{userId}:
 *   get:
 *     summary: Получить список подписчиков пользователя
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список подписчиков
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendItem'
 *       500:
 *         description: Ошибка сервера
 */
