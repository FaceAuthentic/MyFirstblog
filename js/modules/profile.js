/**
 * 个人信息模块
 * 负责管理个人信息的展示和交互
 */

// 确保AppState类可用
if (typeof AppState === 'undefined') {
  console.error('AppState类未定义，请确保已正确引入state.js文件');
}

// 默认个人资料数据
const defaultProfileData = {
  avatar: 'assets/images/head.jpg',
  name: 'FaceAuthentic',
  title: 'Web开发者',
  birthDate: '庚辰年九月廿三',
  city: '上海',
  email: 'example@example.com',
  hobbies: '阅读、游戏、编程',
  bio: '别困在自己的死胡同里',
  skills: ['AI探索者', '学习者'],
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  }
};

/**
 * 个人信息管理类
 * 负责初始化个人信息页面，加载和渲染个人信息数据
 */
class ProfileManager {
  constructor() {
    // 初始化个人信息数据
    this.profileData = null;
    
    // 初始化全局状态管理
    this.appState = window.appState || new AppState();
    
    // 初始化DOM元素引用
    this.initElements();
    
    // 初始化
    this.init();
  }

  /**
   * 初始化DOM元素引用
   * @returns {void}
   */
  initElements() {
    this.elements = {
      avatar: document.querySelector('.avatar-img'),
      name: document.querySelector('.profile-name'),
      title: document.querySelector('.profile-title'),
      birthDate: document.querySelector('[data-field="birthDate"] .detail-value') || document.querySelector('.detail-item:nth-child(1) .detail-value'),
      city: document.querySelector('[data-field="city"] .detail-value') || document.querySelector('.detail-item:nth-child(2) .detail-value'),
      email: document.querySelector('[data-field="email"] .detail-value') || document.querySelector('.detail-item:nth-child(3) .detail-value'),
      hobbies: document.querySelector('[data-field="hobbies"] .detail-value') || document.querySelector('.detail-item:nth-child(4) .detail-value'),
      bio: document.querySelector('.profile-bio p'),
      skillTags: document.querySelector('.skill-tags'),
      socialLinks: {
        github: document.querySelector('.social-github'),
        twitter: document.querySelector('.social-twitter'),
        linkedin: document.querySelector('.social-linkedin')
      }
    };
  }

  /**
   * 初始化个人信息模块
   * @returns {Promise<void>}
   */
  async init() {
    try {
      // 检查utils对象是否可用
      if (typeof utils === 'undefined') {
        console.error('utils对象未定义，请确保已正确引入utils.js文件');
        return;
      }
      
      // 加载个人资料数据
      this.profileData = await this.loadProfileData();
      
      // 渲染个人信息
      this.renderProfile(this.profileData);
      
      // 监听数据变化
      this.appState.addListener('profile', (data) => {
        this.profileData = data;
        this.renderProfile(data);
      });
    } catch (error) {
      console.error('初始化个人信息模块失败:', error);
    }
  }

  /**
   * 从全局状态加载个人信息数据
   * @returns {Promise<Object>} 个人资料数据
   */
  async loadProfileData() {
    try {
      // 从AppState获取个人资料数据
      const profileData = await this.appState.getModuleData('profile');
      
      // 如果没有数据，使用默认数据
      if (!profileData || Object.keys(profileData).length === 0) {
        return defaultProfileData;
      } else {
        // 确保数据结构正确，特别是昵称字段
        return {
          ...defaultProfileData,
          ...profileData,
          name: profileData.name || profileData.nickname || defaultProfileData.name
        };
      }
    } catch (error) {
      console.error('加载个人信息数据失败:', error);
      // 使用默认数据
      return defaultProfileData;
    }
  }

  /**
   * 渲染个人信息到页面
   * @param {Object} profileData - 个人资料数据
   * @returns {void}
   */
  renderProfile(profileData) {
    if (!this.elements || !profileData) return;
    
    // 更新头像
    if (this.elements.avatar && profileData.avatar) {
      this.elements.avatar.src = profileData.avatar;
      this.elements.avatar.alt = profileData.name || '个人头像';
    }
    
    // 更新姓名
    if (this.elements.name && profileData.name) {
      this.elements.name.textContent = profileData.name;
    }
    
    // 更新职业/标题
    if (this.elements.title && profileData.title) {
      this.elements.title.textContent = profileData.title;
    }
    
    // 更新出生年月
    if (this.elements.birthDate && profileData.birthDate) {
      this.elements.birthDate.textContent = profileData.birthDate;
    }
    
    // 更新所在城市
    if (this.elements.city && profileData.city) {
      this.elements.city.textContent = profileData.city;
    }
    
    // 更新邮箱
    if (this.elements.email && profileData.email) {
      this.elements.email.textContent = profileData.email;
    }
    
    // 更新爱好
    if (this.elements.hobbies && profileData.hobbies) {
      this.elements.hobbies.textContent = profileData.hobbies;
    }
    
    // 更新个人简介/个性签名
    if (this.elements.bio && profileData.bio) {
      this.elements.bio.textContent = profileData.bio;
    }
    
    // 更新技能标签
    if (this.elements.skillTags && profileData.skills) {
      this.renderSkillTags(profileData.skills);
    }
    
    // 更新社交链接
    this.renderSocialLinks(profileData.socialLinks);
  }

  /**
   * 渲染技能标签
   * @param {Array} skills - 技能标签数组
   * @returns {void}
   */
  renderSkillTags(skills) {
    if (!this.elements.skillTags || !skills || !Array.isArray(skills)) return;
    
    // 清空现有标签
    this.elements.skillTags.innerHTML = '';
    
    // 添加新标签
    skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      this.elements.skillTags.appendChild(tag);
    });
  }

  /**
   * 渲染社交媒体链接
   * @param {Object} socialLinks - 社交媒体链接对象
   * @returns {void}
   */
  renderSocialLinks(socialLinks) {
    if (!socialLinks || !this.elements.socialLinks) return;
    
    // 更新GitHub链接
    if (socialLinks.github && this.elements.socialLinks.github) {
      this.elements.socialLinks.github.href = socialLinks.github;
    }
    
    // 更新Twitter链接
    if (socialLinks.twitter && this.elements.socialLinks.twitter) {
      this.elements.socialLinks.twitter.href = socialLinks.twitter;
    }
    
    // 更新LinkedIn链接
    if (socialLinks.linkedin && this.elements.socialLinks.linkedin) {
      this.elements.socialLinks.linkedin.href = socialLinks.linkedin;
    }
  }



  /**
   * 更新个人信息
   * @param {Object} updates - 要更新的数据
   */
  updateProfile(updates) {
    if (!updates) return;
    
    // 合并更新数据
    const updatedProfile = { ...this.profileData, ...updates };
    
    // 更新全局状态
    this.appState.updateModuleData('profile', updatedProfile);
    
    // 更新本地数据
    this.profileData = updatedProfile;
  }
}

// 页面加载完成后初始化个人信息模块
document.addEventListener('DOMContentLoaded', function() {
  // 初始化全局状态管理
  window.appState = window.appState || new AppState();
  
  // 初始化导航
  const navigation = new Navigation();
  
  // 初始化图片缩放
  utils.initImageZoom(document.querySelector('.profile-card'));
  
  // 初始化个人信息模块
  window.profileManager = new ProfileManager();
});
