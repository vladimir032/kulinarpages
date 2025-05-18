/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор чата
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *           description: Участники чата
 *         lastMessage:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             sender:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatar:
 *                   type: string
 *             text:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *           description: Последнее сообщение в чате
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания чата
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор сообщения
 *         chat:
 *           type: string
 *           description: ID чата
 *         sender:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             avatar:
 *               type: string
 *           description: Отправитель сообщения
 *         text:
 *           type: string
 *           description: Текст сообщения
 *         read:
 *           type: boolean
 *           description: Прочитано ли сообщение
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания сообщения
 *     MessageInput:
 *       type: object
 *       required:
 *         - chat
 *         - text
 *       properties:
 *         chat:
 *           type: string
 *           description: ID чата
 *         text:
 *           type: string
 *           description: Текст сообщения
 *     ReadMessagesInput:
 *       type: object
 *       required:
 *         - chat
 *       properties:
 *         chat:
 *           type: string
 *           description: ID чата
 *     CreateChatInput:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя, с которым создается чат
 */

/**
 * @swagger
 * tags:
 *   name: Messenger
 *   description: API для работы с сообщениями и чатами
 */

/**
 * @swagger
 * /messenger/messages/unread-count:
 *   get:
 *     summary: Получить количество непрочитанных сообщений
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Количество непрочитанных сообщений
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   description: Количество непрочитанных сообщений
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /messenger/chats:
 *   get:
 *     summary: Получить список чатов пользователя
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список чатов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /messenger/messages/{chatId}:
 *   get:
 *     summary: Получить историю сообщений в чате
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID чата
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Количество сообщений
 *     responses:
 *       200:
 *         description: История сообщений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа к чату
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /messenger/messages:
 *   post:
 *     summary: Отправить сообщение
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageInput'
 *     responses:
 *       200:
 *         description: Отправленное сообщение
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа к чату
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /messenger/messages/read:
 *   put:
 *     summary: Отметить сообщения как прочитанные
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReadMessagesInput'
 *     responses:
 *       200:
 *         description: Сообщения отмечены как прочитанные
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /messenger/chats:
 *   post:
 *     summary: Создать новый чат
 *     tags: [Messenger]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatInput'
 *     responses:
 *       200:
 *         description: Созданный или существующий чат
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Ошибка валидации или попытка создать чат с самим собой
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Нельзя создать чат с собой
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
