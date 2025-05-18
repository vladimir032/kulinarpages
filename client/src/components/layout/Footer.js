import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__columns">
      <div className="footer__column">
        <div className="footer__item"><strong>Адрес:</strong> г.Гродно, ул. Ожешко 22</div>
        <div className="footer__item"><strong>Email:</strong> <a href="mailto:support_diplom@gmail.com" className="footer__link">support_diplom@gmail.com</a></div>
        <div className="footer__item"><strong>Телефон:</strong> 80-70-80</div>
      </div>
      <div className="footer__column">
        <div className="footer__item">Спонсоры</div>
        <div className="footer__item">Стратегические цели</div>
        <div className="footer__item">Руководство</div>
      </div>
      <div className="footer__column">
        <div className="footer__item"><a href="/privacy" className="footer__link">Политика конфиденциальности</a></div>
        <div className="footer__item"><a href="/license" className="footer__link">Лицензионное соглашение</a></div>
        <div className="footer__item"><a href="/docs" className="footer__link">Документация</a></div>
      </div>
    </div>
    <div className="footer__bottom">
      <span>© {new Date().getFullYear()} Кулинария и рецепты для Вас. Все права защищены.</span>
    </div>
  </footer>
);

export default Footer;
