/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор рецепта
 *         title:
 *           type: string
 *           description: Название рецепта
 *         description:
 *           type: string
 *           description: Описание рецепта
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: string
 *           description: Список ингредиентов
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Пошаговые инструкции приготовления
 *         imageUrl:
 *           type: string
 *           description: URL изображения рецепта
 *         difficulty:
 *           type: string
 *           description: Сложность приготовления
 *           enum: [Легкий, Средний, Сложный]
 *         calories:
 *           type: number
 *           description: Калорийность блюда
 *         prepTime:
 *           type: number
 *           description: Время приготовления в минутах
 *         category:
 *           type: string
 *           description: Категория рецепта
 *           enum: [Салаты, Десерты, Супы, Пиццы, Напитки, Горячее]
 *         author:
 *           type: string
 *           description: ID автора рецепта
 *         views:
 *           type: number
 *           description: Количество просмотров рецепта
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания рецепта
 *     RecipeInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *       properties:
 *         title:
 *           type: string
 *           description: Название рецепта
 *         description:
 *           type: string
 *           description: Описание рецепта
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: string
 *           description: Список ингредиентов
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Пошаговые инструкции приготовления
 *         imageUrl:
 *           type: string
 *           description: URL изображения рецепта
 *         difficulty:
 *           type: string
 *           description: Сложность приготовления
 *           enum: [Легкий, Средний, Сложный]
 *         calories:
 *           type: number
 *           description: Калорийность блюда
 *         prepTime:
 *           type: number
 *           description: Время приготовления в минутах
 *         category:
 *           type: string
 *           description: Категория рецепта
 *           enum: [Салаты, Десерты, Супы, Пиццы, Напитки, Горячее]
 */

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API для работы с рецептами
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Получить все рецепты
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Список всех рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/popular:
 *   get:
 *     summary: Получить популярные рецепты
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Список из 6 самых популярных рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Получить рецепт по ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Детальная информация о рецепте
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Рецепт не найден
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Создать новый рецепт
 *     tags: [Recipes]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       200:
 *         description: Созданный рецепт
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Обновить рецепт
 *     tags: [Recipes]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       200:
 *         description: Обновленный рецепт
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Не авторизован или не имеет прав на редактирование
 *       404:
 *         description: Рецепт не найден
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Удалить рецепт
 *     tags: [Recipes]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Рецепт успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Recipe removed
 *       401:
 *         description: Не авторизован или не имеет прав на удаление
 *       404:
 *         description: Рецепт не найден
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/{id}/save:
 *   post:
 *     summary: Сохранить/убрать рецепт из сохраненных
 *     tags: [Recipes]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Обновленный список сохраненных рецептов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/find:
 *   post:
 *     summary: Найти рецепты по имеющимся ингредиентам
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Список имеющихся ингредиентов
 *     responses:
 *       200:
 *         description: Результаты поиска рецептов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                   description: Рецепты, которые можно приготовить из имеющихся ингредиентов
 *                 limited:
 *                   type: array
 *                   items:
 *                     type: object
 *                     allOf:
 *                       - $ref: '#/components/schemas/Recipe'
 *                       - type: object
 *                         properties:
 *                           missingIngredients:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Список недостающих ингредиентов
 *                   description: Рецепты, для которых не хватает до 3 ингредиентов
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/admin/statistics:
 *   get:
 *     summary: Получить статистику для администратора
 *     tags: [Recipes, Admin]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Статистика
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                   description: Общее количество пользователей
 *                 totalRecipes:
 *                   type: number
 *                   description: Общее количество рецептов
 *                 totalSavedRecipes:
 *                   type: number
 *                   description: Общее количество сохраненных рецептов
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (только для администраторов)
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /recipes/admin/users:
 *   get:
 *     summary: Получить список всех пользователей (для администратора)
 *     tags: [Recipes, Admin]
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
 * /recipes/admin/users/{id}/block:
 *   put:
 *     summary: Заблокировать пользователя (для администратора)
 *     tags: [Recipes, Admin]
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
 * /recipes/admin/users/{id}/unblock:
 *   put:
 *     summary: Разблокировать пользователя (для администратора)
 *     tags: [Recipes, Admin]
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
 * /recipes/admin/users/{id}/restrict:
 *   put:
 *     summary: Ограничить пользователя на определенный срок (для администратора)
 *     tags: [Recipes, Admin]
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
