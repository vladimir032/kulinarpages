import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyFridge.css';

const MyFridge = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [limitedRecipes, setLimitedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState('shelf1');

  // Load ingredients from localStorage on component mount
  useEffect(() => {
    const savedIngredients = localStorage.getItem('myFridgeIngredients');
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  // Save ingredients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('myFridgeIngredients', JSON.stringify(ingredients));
  }, [ingredients]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      const newIngredient = {
        id: Date.now(),
        name: inputValue.trim(),
        shelf: selectedShelf
      };
      setIngredients([...ingredients, newIngredient]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (ingredients.length === 0) {
      setError('Пожалуйста, добавьте хотя бы один ингредиент');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ingredientNames = ingredients.map(ing => ing.name);
      const response = await axios.post('/api/recipes/find', { ingredients: ingredientNames });
      setAvailableRecipes(response.data.available);
      setLimitedRecipes(response.data.limited);
    } catch (error) {
      setError('Ошибка при поиске рецептов. Пожалуйста, попробуйте позже.');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIngredientsForShelf = (shelf) => {
    return ingredients.filter(ing => ing.shelf === shelf);
  };

  return (
    <div className="my-fridge-container">
      <div className="fridge">
        <div className="fridge-door">
          <div className="fridge-handle"></div>
          <div className="fridge-content">
            <div className="shelf shelf1">
              <h3>Верхняя полка</h3>
              <div className="shelf-items">
                {getIngredientsForShelf('shelf1').map(ingredient => (
                  <span key={ingredient.id} className="ingredient-tag">
                    {ingredient.name}
                    <button onClick={() => handleRemoveIngredient(ingredient.id)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="shelf shelf2">
              <h3>Средняя полка</h3>
              <div className="shelf-items">
                {getIngredientsForShelf('shelf2').map(ingredient => (
                  <span key={ingredient.id} className="ingredient-tag">
                    {ingredient.name}
                    <button onClick={() => handleRemoveIngredient(ingredient.id)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="shelf shelf3">
              <h3>Нижняя полка</h3>
              <div className="shelf-items">
                {getIngredientsForShelf('shelf3').map(ingredient => (
                  <span key={ingredient.id} className="ingredient-tag">
                    {ingredient.name}
                    <button onClick={() => handleRemoveIngredient(ingredient.id)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="fridge-controls">
          <div className="input-group">
            <select 
              value={selectedShelf} 
              onChange={(e) => setSelectedShelf(e.target.value)}
              className="shelf-select"
            >
              <option value="shelf1">Верхняя полка</option>
              <option value="shelf2">Средняя полка</option>
              <option value="shelf3">Нижняя полка</option>
            </select>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Введите ингредиент"
              onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
            />
            <button type="button" onClick={handleAddIngredient}>
              Добавить
            </button>
          </div>

          <button 
            className="search-button" 
            onClick={handleSubmit}
            disabled={ingredients.length === 0 || loading}
          >
            {loading ? 'Поиск...' : 'Найти рецепты'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <div className="recipes-section">
        {availableRecipes.length > 0 && (
          <div className="recipe-list">
            <h2>Доступные рецепты</h2>
            <div className="recipe-grid">
              {availableRecipes.map(recipe => (
                <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="recipe-card">
                  <img src={recipe.imageUrl} alt={recipe.title} />
                  <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <p>Время приготовления: {recipe.prepTime} мин</p>
                    <p>Сложность: {recipe.difficulty}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {limitedRecipes.length > 0 && (
          <div className="recipe-list limited">
            <h2>Ограниченные рецепты</h2>
            <p className="subtitle">Не хватает несколько ингредиентов</p>
            <div className="recipe-grid">
              {limitedRecipes.map(recipe => (
                <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="recipe-card">
                  <img src={recipe.imageUrl} alt={recipe.title} />
                  <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <p>Время приготовления: {recipe.prepTime} мин</p>
                    <p>Не хватает ингредиентов:</p>
                    <ul className="missing-ingredients">
                      {recipe.missingIngredients.map((ing, index) => (
                        <li key={index}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && availableRecipes.length === 0 && limitedRecipes.length === 0 && ingredients.length > 0 && (
          <div className="no-recipes">
            <p>К сожалению, рецептов с данными ингредиентами не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFridge;