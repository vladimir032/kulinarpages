/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeStats:
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
 *         likes:
 *           type: number
 *           description: Количество лайков
 *         interactions:
 *           type: number
 *           description: Количество взаимодействий
 *     UserStats:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID пользователя
 *         savedRecipesCount:
 *           type: number
 *           description: Количество сохраненных рецептов
 *         likedRecipesCount:
 *           type: number
 *           description: Количество лайкнутых рецептов
 *         interactionsCount:
 *           type: number
 *           description: Количество взаимодействий
 */

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API для получения статистики
 */

/**
 * @swagger
 * /statistics/recipes:
 *   get:
 *     summary: Получить статистику по рецептам
 *     tags: [Statistics]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Статистика по рецептам
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /statistics/users/{id}:
 *   get:
 *     summary: Получить статистику по конкретному пользователю
 *     tags: [Statistics]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статистика по пользователю
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /statistics/export:
 *   get:
 *     summary: Экспорт данных в различных форматах
 *     tags: [Statistics]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [txt, sql, csv, xlsx, json]
 *         required: true
 *         description: Формат экспорта
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           enum: [users, recipes]
 *           default: users
 *         description: Тип данных для экспорта
 *     responses:
 *       200:
 *         description: Экспортированные данные
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: binary
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           application/sql:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Неверный формат или тип данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       404:
 *         description: Данные не найдены
 *       500:
 *         description: Ошибка сервера
 */
