/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         avatar:
 *           type: string
 *           description: URL аватара пользователя
 *         status:
 *           type: string
 *           description: Статус пользователя
 *         about:
 *           type: string
 *           description: Информация о пользователе
 *         gender:
 *           type: string
 *           description: Пол пользователя
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           description: Хобби пользователя
 *         favoriteRecipes:
 *           type: array
 *           items:
 *             type: string
 *           description: Любимые рецепты пользователя
 *         savedRecipes:
 *           type: array
 *           items:
 *             type: string
 *           description: Сохраненные рецепты пользователя
 *         coverPhoto:
 *           type: string
 *           description: URL обложки профиля
 *         privacySettings:
 *           type: object
 *           description: Настройки приватности
 *         birthdate:
 *           type: string
 *           format: date
 *           description: Дата рождения
 *         city:
 *           type: string
 *           description: Город проживания
 *         phone:
 *           type: string
 *           description: Телефон
 *         vk:
 *           type: string
 *           description: Ссылка на ВКонтакте
 *         telegram:
 *           type: string
 *           description: Ссылка на Telegram
 *         instagram:
 *           type: string
 *           description: Ссылка на Instagram
 *         website:
 *           type: string
 *           description: Личный сайт
 *         favoriteCuisine:
 *           type: string
 *           description: Любимая кухня
 *         profession:
 *           type: string
 *           description: Профессия
 *         quote:
 *           type: string
 *           description: Цитата
 *         themeColor:
 *           type: string
 *           description: Цвет темы пользователя
 *         role:
 *           type: string
 *           description: Роль пользователя
 *           enum: [user, admin]
 *         isBlocked:
 *           type: boolean
 *           description: Флаг блокировки пользователя
 *         restrictionUntil:
 *           type: string
 *           format: date-time
 *           description: Дата окончания ограничения
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания аккаунта
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         avatar:
 *           type: string
 *           description: URL аватара пользователя
 *         stats:
 *           type: object
 *           properties:
 *             recipesCount:
 *               type: number
 *               description: Количество рецептов пользователя
 *             likesCount:
 *               type: number
 *               description: Количество лайков на рецептах пользователя
 *             viewsCount:
 *               type: number
 *               description: Количество просмотров рецептов пользователя
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для работы с пользователями
 */

/**
 * @swagger
 * /users/saved-recipes:
 *   get:
 *     summary: Получить сохраненные рецепты пользователя
 *     tags: [Users]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список сохраненных рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Получить профиль текущего пользователя
 *     tags: [Users]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя с дополнительной статистикой
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Обновить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *               status:
 *                 type: string
 *               about:
 *                 type: string
 *               gender:
 *                 type: string
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *               favoriteRecipes:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverPhoto:
 *                 type: string
 *               privacySettings:
 *                 type: object
 *               birthdate:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *               vk:
 *                 type: string
 *               telegram:
 *                 type: string
 *               instagram:
 *                 type: string
 *               website:
 *                 type: string
 *               favoriteCuisine:
 *                 type: string
 *               profession:
 *                 type: string
 *               quote:
 *                 type: string
 *               themeColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
