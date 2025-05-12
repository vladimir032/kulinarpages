/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         password:
 *           type: string
 *           format: password
 *           description: Пароль пользователя
 *     RegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         password:
 *           type: string
 *           format: password
 *           description: Пароль пользователя
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT токен для авторизации
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Статус операции
 *         message:
 *           type: string
 *           description: Сообщение о результате операции
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: ID пользователя
 *             username:
 *               type: string
 *               description: Имя пользователя
 *             email:
 *               type: string
 *               description: Email пользователя
 *             role:
 *               type: string
 *               description: Роль пользователя
 *         token:
 *           type: string
 *           description: JWT токен для авторизации
 *     LoginRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID записи
 *         userId:
 *           type: string
 *           description: ID пользователя
 *         email:
 *           type: string
 *           description: Email пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         ip:
 *           type: string
 *           description: IP-адрес
 *         userAgent:
 *           type: string
 *           description: User-Agent браузера
 *         loginAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время входа
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для аутентификации и авторизации
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Ошибка валидации или пользователь с таким email/username уже существует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Email уже используется!
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Ошибка сервера
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Неверный email или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Неверный email или пароль!
 *       403:
 *         description: Пользователь заблокирован или ограничен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: В связи с нарушением правил платформы, вы были заблокированы.
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Получить данные авторизованного пользователя
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /auth/login-history:
 *   get:
 *     summary: Получить историю входов пользователя
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: История входов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoginRecord'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
