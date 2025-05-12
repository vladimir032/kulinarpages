/**
 * @swagger
 * components:
 *   schemas:
 *     PeriodStats:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Период (дата или час)
 *         count:
 *           type: number
 *           description: Количество
 *     UserStatsItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         loginCount:
 *           type: number
 *           description: Количество входов
 *         savedRecipesCount:
 *           type: number
 *           description: Количество сохраненных рецептов
 *         recipesCount:
 *           type: number
 *           description: Количество созданных рецептов
 *         viewsCount:
 *           type: number
 *           description: Количество просмотров рецептов
 *     RecipeStatsItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID рецепта
 *         title:
 *           type: string
 *           description: Название рецепта
 *         views:
 *           type: number
 *           description: Количество просмотров
 *         commentsCount:
 *           type: number
 *           description: Количество комментариев
 *         category:
 *           type: string
 *           description: Категория рецепта
 *         likes:
 *           type: number
 *           description: Количество лайков
 *     LikesDynamics:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Период (дата или час)
 *         likes:
 *           type: number
 *           description: Количество лайков
 *     ViewsDynamics:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Период (дата или час)
 *         views:
 *           type: number
 *           description: Количество просмотров
 *     CategoryStats:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Название категории
 *         count:
 *           type: number
 *           description: Количество рецептов
 *         likes:
 *           type: number
 *           description: Количество лайков
 *         views:
 *           type: number
 *           description: Количество просмотров
 *     IpStats:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: IP-адрес
 *         count:
 *           type: number
 *           description: Количество входов
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           description: Список пользователей
 */

/**
 * @swagger
 * tags:
 *   name: AdminStats
 *   description: API для получения расширенной статистики администратором
 */

/**
 * @swagger
 * /admin-stats/new-users:
 *   get:
 *     summary: Получить статистику новых пользователей по периодам
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: by
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: day
 *         description: Группировка по часам или дням
 *     responses:
 *       200:
 *         description: Статистика новых пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeriodStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/new-recipes:
 *   get:
 *     summary: Получить статистику новых рецептов по периодам
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: by
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: day
 *         description: Группировка по часам или дням
 *     responses:
 *       200:
 *         description: Статистика новых рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeriodStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/top-users:
 *   get:
 *     summary: Получить список самых активных пользователей
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список самых активных пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserStatsItem'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/top-recipes:
 *   get:
 *     summary: Получить список самых популярных рецептов
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список самых популярных рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeStatsItem'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/likes-dynamics:
 *   get:
 *     summary: Получить динамику лайков по периодам
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: by
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: day
 *         description: Группировка по часам или дням
 *     responses:
 *       200:
 *         description: Динамика лайков
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikesDynamics'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/views-dynamics:
 *   get:
 *     summary: Получить динамику просмотров по периодам
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: by
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: day
 *         description: Группировка по часам или дням
 *     responses:
 *       200:
 *         description: Динамика просмотров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ViewsDynamics'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/categories:
 *   get:
 *     summary: Получить статистику по категориям рецептов
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Статистика по категориям
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin-stats/top-ips:
 *   get:
 *     summary: Получить список самых активных IP-адресов
 *     tags: [AdminStats]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список самых активных IP-адресов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IpStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */
