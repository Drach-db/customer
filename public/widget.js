(function() {
  'use strict';

  // Получаем конфигурацию из window.MarketelWidget
  const config = window.MarketelWidget || {};
  const {
    projectId,
    widgetId,
    welcomeMessage = 'Здравствуйте! Чем можем помочь?',
    primaryColor = '#6366F1',
    position = 'bottom-right'
  } = config;

  if (!projectId || !widgetId) {
    console.error('Marketel Widget: projectId and widgetId are required');
    return;
  }

  // Создаем контейнер для виджета
  const container = document.createElement('div');
  container.id = 'marketel-widget-container';
  container.style.cssText = `
    position: fixed;
    ${position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
    bottom: 20px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Создаем кнопку виджета
  const button = document.createElement('button');
  button.id = 'marketel-widget-button';
  button.innerHTML = '💬';
  button.style.cssText = `
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background-color: ${primaryColor};
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  `;

  button.onmouseover = () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
  };

  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  };

  // Создаем iframe с чатом
  const chatFrame = document.createElement('iframe');
  chatFrame.id = 'marketel-widget-iframe';
  chatFrame.src = `${window.location.origin}/widget?projectId=${projectId}&widgetId=${widgetId}&color=${encodeURIComponent(primaryColor)}&message=${encodeURIComponent(welcomeMessage)}`;
  chatFrame.style.cssText = `
    display: none;
    position: fixed;
    ${position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
    bottom: 90px;
    width: 380px;
    height: 600px;
    max-height: calc(100vh - 120px);
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    z-index: 999998;
  `;

  let isOpen = false;

  button.onclick = () => {
    isOpen = !isOpen;
    chatFrame.style.display = isOpen ? 'block' : 'none';
    button.innerHTML = isOpen ? '✕' : '💬';
  };

  // Добавляем элементы на страницу
  container.appendChild(button);
  document.body.appendChild(container);
  document.body.appendChild(chatFrame);

  // Слушаем сообщения от iframe
  window.addEventListener('message', (event) => {
    if (event.data.type === 'marketel-widget-close') {
      isOpen = false;
      chatFrame.style.display = 'none';
      button.innerHTML = '💬';
    }
  });
})();
