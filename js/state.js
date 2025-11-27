/**
 * 全局状态管理模块
 * 负责管理应用的数据状态，包括数据的读取、保存和同步
 */

/**
 * 全局状态管理类
 * 使用localStorage存储数据，并提供数据变化的监听机制
 */
class AppState {
  constructor() {
    // 从localStorage加载数据
    this.data = this.loadData();
    // 存储各模块的监听器
    this.listeners = {};
  }

  /**
   * 从localStorage加载数据
   * @returns {Object} 应用数据对象
   */
  loadData() {
    try {
      const savedData = localStorage.getItem('blogData');
      return savedData ? JSON.parse(savedData) : this.getDefaultData();
    } catch (error) {
      console.error('加载数据失败:', error);
      return this.getDefaultData();
    }
  }

  /**
   * 保存数据到localStorage
   * 并触发数据变化事件
   */
  saveData() {
    try {
      localStorage.setItem('blogData', JSON.stringify(this.data));
      this.notifyChange();
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  /**
   * 获取默认数据结构
   * @returns {Object} 默认数据对象
   */
  getDefaultData() {
    return {
      profile: {
        avatar: '../assets/images/head.jpg',
        nickname: 'FaceAuthentic',
        birthDate: '庚辰年九月廿三',
        city: '上海',
        signature: '别困在自己的死胡同里',
        tags: ['AI探索者', '学习者'],
        email: 'example@example.com',
        profession: '前端开发工程师',
        hobbies: '阅读、游戏、编程',
        bio: '热爱技术，喜欢探索新事物。专注于前端开发，对用户体验有深入理解。在工作之余，喜欢阅读各类书籍，玩一些有趣的游戏，记录生活中的点点滴滴。',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Node.js', 'Git', 'Webpack'],
        socialLinks: {
          github: '#',
          twitter: '#',
          linkedin: '#'
        }
      },
      books: [],
      games: [],
      notes: []
    };
  }

  /**
   * 通知数据变化
   * 触发自定义事件，通知所有监听器数据已变化
   */
  notifyChange() {
    window.dispatchEvent(new CustomEvent('appDataChange', {
      detail: { data: this.data }
    }));
  }

  /**
   * 添加数据变化监听器
   * @param {string} module - 模块名称
   * @param {Function} callback - 回调函数
   */
  addListener(module, callback) {
    if (!this.listeners[module]) {
      this.listeners[module] = [];
    }
    this.listeners[module].push(callback);
  }

  /**
   * 移除数据变化监听器
   * @param {string} module - 模块名称
   * @param {Function} callback - 回调函数
   */
  removeListener(module, callback) {
    if (this.listeners[module]) {
      this.listeners[module] = this.listeners[module].filter(cb => cb !== callback);
    }
  }

  /**
   * 通知特定模块的监听器数据已变化
   * @param {string} module - 模块名称
   * @param {*} data - 新数据
   */
  notifyListeners(module, data) {
    if (this.listeners[module]) {
      this.listeners[module].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for module ${module}:`, error);
        }
      });
    }
  }

  /**
   * 获取模块数据
   * @param {string} module - 模块名称
   * @returns {*} 模块数据
   */
  getModuleData(module) {
    return this.data[module];
  }

  /**
   * 更新模块数据
   * @param {string} module - 模块名称
   * @param {*} data - 新数据
   */
  updateModuleData(module, data) {
    this.data[module] = data;
    this.saveData();
    // 通知监听器数据已变化
    this.notifyListeners(module, data);
  }

  /**
   * 添加新记录
   * @param {string} module - 模块名称
   * @param {Object} record - 记录对象
   * @returns {string} 新记录的ID
   */
  addRecord(module, record) {
    const id = this.generateId();
    const newRecord = { ...record, id };
    this.data[module].push(newRecord);
    this.saveData();
    return id;
  }

  /**
   * 更新记录
   * @param {string} module - 模块名称
   * @param {string} id - 记录ID
   * @param {Object} updates - 更新数据
   * @returns {boolean} 是否更新成功
   */
  updateRecord(module, id, updates) {
    const index = this.data[module].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[module][index] = { ...this.data[module][index], ...updates };
      this.saveData();
      return true;
    }
    return false;
  }

  /**
   * 删除记录
   * @param {string} module - 模块名称
   * @param {string} id - 记录ID
   * @returns {boolean} 是否删除成功
   */
  deleteRecord(module, id) {
    const index = this.data[module].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[module].splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// 创建全局状态实例
const appState = new AppState();

// 导出全局状态实例
if (typeof module !== 'undefined' && module.exports) {
  module.exports = appState;
} else {
  window.appState = appState;
}