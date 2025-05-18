/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStatistics:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *           description: Общее количество пользователей
 *         totalRecipes:
 *           type: number
 *           description: Общее количество рецептов
 *         totalSavedRecipes:
 *           type: number
 *           description: Общее количество сохраненных рецептов
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API для администраторов
 */

/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Получить общую статистику
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Общая статистика
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStatistics'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin/users/{id}/block:
 *   put:
 *     summary: Заблокировать пользователя
 *     tags: [Admin]
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
 *         description: Пользователь заблокирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User blocked
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin/users/{id}/unblock:
 *   put:
 *     summary: Разблокировать пользователя
 *     tags: [Admin]
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
 *         description: Пользователь разблокирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User unblocked
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /admin/users/{id}/restrict:
 *   put:
 *     summary: Ограничить пользователя на определенный срок
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restrictionUntil:
 *                 type: string
 *                 format: date-time
 *                 description: Дата окончания ограничения
 *     responses:
 *       200:
 *         description: Пользователь ограничен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User restricted
 *                 restrictionUntil:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
