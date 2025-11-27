/**
 * 导航组件模块
 * 负责处理导航栏的显示、高亮和页面切换
 */

/**
 * 导航组件类
 */
class Navigation {
  constructor() {
    this.currentModule = 'home';
    this.navItems = [
      { id: 'home', name: '首页', url: 'index.html' },
      { id: 'profile', name: '个人信息', url: 'pages/profile.html' },
      { id: 'books', name: '读书', url: 'pages/books.html' },
      { id: 'games', name: '游戏', url: 'pages/games.html' },
      { id: 'notes', name: '笔记', url: 'pages/notes.html' }
    ];
    
    this.init();
  }

  /**
   * 初始化导航
   */
  init() {
    this.createNavigation();
    this.updateActiveNav();
    this.setupEventListeners();
  }

  /**
   * 创建导航栏
   */
  createNavigation() {
    const header = document.querySelector('header') || this.createHeader();
    
    // 创建导航菜单
    const nav = document.createElement('nav');
    nav.className = 'main-nav';
    
    const navList = document.createElement('ul');
    navList.className = 'nav-list';
    
    this.navItems.forEach(item => {
      const navItem = document.createElement('li');
      navItem.className = 'nav-item';
      navItem.dataset.module = item.id;
      
      const navLink = document.createElement('a');
      navLink.href = item.url;
      navLink.className = 'nav-link';
      navLink.textContent = item.name;
      
      navItem.appendChild(navLink);
      navList.appendChild(navItem);
    });
    
    nav.appendChild(navList);
    header.appendChild(nav);
  }

  /**
   * 创建header元素
   * @returns {HTMLElement} header元素
   */
  createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    document.body.insertBefore(header, document.body.firstChild);
    return header;
  }

  /**
   * 更新当前活动导航项
   */
  updateActiveNav() {
    // 从URL路径确定当前模块
    const path = window.location.pathname;
    const pageName = path.split('/').pop().split('.')[0];
    
    if (pageName === 'index' || pageName === '') {
      this.currentModule = 'home';
    } else {
      this.currentModule = pageName;
    }
    
    // 更新导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.module === this.currentModule) {
        item.classList.add('active');
      }
    });
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听导航点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
    
    // 监听浏览器前进后退
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  /**
   * 处理导航点击事件
   * @param {Event} event - 点击事件对象
   */
  handleNavClick(event) {
    event.preventDefault();
    
    const target = event.target.closest('.nav-link');
    if (!target) return;
    
    let href = target.getAttribute('href');
    if (!href) return;
    
    // 检查当前页面是否在子目录中
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/pages/');
    
    // 如果在子目录中，需要调整路径
    if (isInSubdirectory && !href.startsWith('http') && !href.startsWith('../')) {
      // 如果是首页链接，需要返回上一级目录
      if (href === 'index.html') {
        href = '../' + href;
      } 
      // 如果是其他页面链接，需要添加../前缀
      else if (href.startsWith('pages/')) {
        href = '../' + href;
      }
    }
    
    // 显示加载指示器
    if (typeof utils !== 'undefined' && utils.showLoadingIndicator) {
      utils.showLoadingIndicator();
    }
    
    // 模拟页面加载延迟
    setTimeout(() => {
      // 使用window.location.href进行页面跳转
      window.location.href = href;
    }, 300);
  }

  /**
   * 处理浏览器前进后退事件
   */
  handlePopState() {
    this.updateActiveNav();
  }

  /**
   * 获取当前模块
   * @returns {string} 当前模块ID
   */
  getCurrentModule() {
    return this.currentModule;
  }

  /**
   * 设置导航栏样式
   * @param {string} style - 样式类型: 'full' 或 'compact'
   */
  setNavStyle(style) {
    const header = document.querySelector('.site-header');
    if (header) {
      header.className = `site-header ${style}`;
    }
  }

  /**
   * 设置活动导航项
   * @param {string} moduleId - 模块ID
   */
  setActive(moduleId) {
    this.currentModule = moduleId;
    
    // 更新导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.module === moduleId) {
        item.classList.add('active');
      }
    });
  }
}

// 导出导航组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
} else {
  window.Navigation = Navigation;
}