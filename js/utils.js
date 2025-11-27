/**
 * 工具函数模块
 * 包含项目中使用的通用工具函数
 */

/**
 * 初始化Pell富文本编辑器
 * @param {HTMLElement} element - 编辑器容器元素
 * @param {string} content - 初始内容
 * @param {Function} onChange - 内容变化回调函数
 * @returns {Object} 编辑器实例
 */
function initPellEditor(element, content, onChange) {
  const editor = pell.init({
    element: element,
    defaultParagraphSeparator: 'p',
    styleWithCSS: false,
    actions: [
      'bold',
      'italic',
      {
        name: 'heading1',
        result: () => {
          document.execCommand('formatBlock', false, 'h1');
        }
      },
      {
        name: 'heading2',
        result: () => {
          document.execCommand('formatBlock', false, 'h2');
        }
      },
      {
        name: 'heading3',
        result: () => {
          document.execCommand('formatBlock', false, 'h3');
        }
      },
      'olist',
      'ulist'
    ],
    onChange: (html) => {
      onChange(html);
    }
  });
  
  // 设置初始内容
  editor.content.innerHTML = content;
  
  return editor;
}

/**
 * 初始化图片缩放功能
 * @param {HTMLElement} container - 包含图片的容器元素
 */
function initImageZoom(container) {
  mediumZoom(container.querySelectorAll('img'), {
    background: 'rgba(0, 0, 0, 0.8)',
    scrollOffset: 0,
    margin: 20
  });
}

/**
 * 计算游戏入坑年数
 * @param {string} startDate - 入坑日期(YYYY-MM-DD)
 * @returns {number} 入坑年数
 */
function calculateGameYears(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期对象或日期字符串
 * @param {string} format - 格式字符串，默认为'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间(毫秒)
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 显示加载指示器
 */
function showLoadingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'loading-indicator';
  indicator.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(indicator);
}

/**
 * 隐藏加载指示器
 */
function hideLoadingIndicator() {
  const indicator = document.querySelector('.loading-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success', 'error', 'info'
 * @param {number} duration - 显示时长(毫秒)，默认为3000
 */
function showMessage(message, type = 'info', duration = 3000) {
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.textContent = message;
  
  document.body.appendChild(messageElement);
  
  // 添加显示动画
  setTimeout(() => {
    messageElement.classList.add('show');
  }, 10);
  
  // 设置自动隐藏
  setTimeout(() => {
    messageElement.classList.remove('show');
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 300);
  }, duration);
}

/**
 * 创建DOM元素
 * @param {string} tagName - 标签名
 * @param {Object} attributes - 属性对象
 * @param {string|HTMLElement|Array} children - 子元素
 * @returns {HTMLElement} 创建的DOM元素
 */
function createElement(tagName, attributes = {}, children = []) {
  const element = document.createElement(tagName);
  
  // 设置属性
  Object.keys(attributes).forEach(key => {
    if (key === 'className') {
      element.className = attributes[key];
    } else if (key === 'style' && typeof attributes[key] === 'object') {
      Object.assign(element.style, attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  
  // 添加子元素
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }
  
  return element;
}

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPellEditor,
    initImageZoom,
    calculateGameYears,
    formatDate,
    debounce,
    throttle,
    showLoadingIndicator,
    hideLoadingIndicator,
    showMessage,
    createElement
  };
} else {
  window.utils = {
    initPellEditor,
    initImageZoom,
    calculateGameYears,
    formatDate,
    debounce,
    throttle,
    showLoadingIndicator,
    hideLoadingIndicator,
    showMessage,
    createElement
  };
}