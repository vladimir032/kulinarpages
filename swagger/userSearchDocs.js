/**
 * @swagger
 * components:
 *   schemas:
 *     UserSearchResult:
 *       type: object
 *       properties:
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: Результаты поиска пользователей
 *         total:
 *           type: number
 *           description: Общее количество найденных пользователей
 *         page:
 *           type: number
 *           description: Текущая страница
 *         pages:
 *           type: number
 *           description: Общее количество страниц
 */

/**
 * @swagger
 * tags:
 *   name: UserSearch
 *   description: API для поиска пользователей
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Поиск пользователей
 *     tags: [UserSearch]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Поисковый запрос (имя пользователя или email)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Количество результатов на странице
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Результаты поиска пользователей
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSearchResult'
 *       400:
 *         description: Ошибка валидации параметров
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
 *       500:
 *         description: Ошибка сервера
 */
