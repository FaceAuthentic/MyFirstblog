/**
 * 游戏模块JavaScript文件
 * 负责游戏数据的加载、显示、添加、编辑和删除功能
 */

class GameManager {
    /**
     * 构造函数
     * 初始化游戏管理器
     */
    constructor() {
        // 游戏数据存储
        this.games = [];
        this.filteredGames = [];
        this.currentFilter = '';
        
        // 当前编辑的游戏ID
        this.editingGameId = null;
        
        // 初始化DOM元素引用
        this.initDOMElements();
        
        // 初始化游戏模块
        this.init();
    }
    
    /**
     * 初始化DOM元素引用
     */
    initDOMElements() {
        this.gamesContainer = document.getElementById('games-container');
        this.searchInput = document.getElementById('search-input');
        this.addGameBtn = document.getElementById('add-game-btn');
        this.gameModal = document.getElementById('game-modal');
        this.gameForm = document.getElementById('game-form');
        this.modalTitle = document.getElementById('modal-title');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.emptyState = document.getElementById('empty-state');
        
        // 表单字段
        this.gameNameInput = document.getElementById('game-name');
        this.gameTypeInput = document.getElementById('game-type');
        this.gameCategoryInput = document.getElementById('game-category');
        this.gameStartDateInput = document.getElementById('game-start-date');
    }
    
    /**
     * 初始化游戏模块
     * 加载游戏数据并渲染页面
     */
    init() {
        this.loadGamesFromStorage();
        this.renderGames();
        this.setupEventListeners();
    }
    
    /**
     * 从本地存储加载游戏数据
     */
    loadGamesFromStorage() {
        const storedGames = localStorage.getItem('games');
        if (storedGames) {
            this.games = JSON.parse(storedGames);
        } else {
            // 如果没有存储的游戏数据，初始化一些示例数据
            this.games = [
                {
                    id: this.generateId(),
                    name: '塞尔达传说：王国之泪',
                    type: '动作冒险',
                    category: '单机游戏',
                    date: '2023-05-12',
                    duration: '120小时'
                },
                {
                    id: this.generateId(),
                    name: '英雄联盟',
                    type: 'MOBA',
                    category: '网络游戏',
                    date: '2023-06-15',
                    duration: '500小时'
                },
                {
                    id: this.generateId(),
                    name: '我的世界',
                    type: '沙盒',
                    category: '单机游戏',
                    date: '2023-04-20',
                    duration: '80小时'
                }
            ];
            this.saveGamesToStorage();
            this.filteredGames = [...this.games];
        }
    }

    /**
     * 保存游戏数据到本地存储
     */
    saveGamesToStorage() {
        localStorage.setItem('games', JSON.stringify(this.games));
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 添加游戏按钮点击事件
        this.addGameBtn.addEventListener('click', () => {
            this.openModal();
        });
        
        // 取消按钮点击事件
        this.cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 保存按钮点击事件
        this.saveBtn.addEventListener('click', () => {
            this.saveGame();
        });
        
        // 表单提交事件
        this.gameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGame();
        });
        
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e);
        });
        
        // 点击模态框外部关闭
        this.gameModal.addEventListener('click', (e) => {
            if (e.target === this.gameModal) {
                this.closeModal();
            }
        });
    }

    /**
     * 渲染游戏列表
     */
    renderGames() {
        // 清空容器
        this.gamesContainer.innerHTML = '';
        
        // 如果没有游戏，显示空状态
        if (this.filteredGames.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        // 隐藏空状态
        this.emptyState.style.display = 'none';
        
        // 渲染游戏卡片
        this.filteredGames.forEach(game => {
            const gameCard = this.createGameCard(game);
            this.gamesContainer.appendChild(gameCard);
        });
    }

    /**
     * 创建游戏卡片
     * @param {Object} game - 游戏对象
     * @returns {HTMLElement} 游戏卡片元素
     */
    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // 计算游戏时长（年）
        const startDate = new Date(game.date);
        const currentDate = new Date();
        const yearsPlayed = Math.floor((currentDate - startDate) / (365 * 24 * 60 * 60 * 1000));
        
        card.innerHTML = `
            <div class="game-cover">
                <div class="game-cover-placeholder">🎮</div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-meta">
                    <span class="game-type">${game.type}</span>
                    <span class="game-category">${game.category}</span>
                </div>
                <div class="game-date">开始时间: ${game.date}</div>
                <div class="game-duration">已游玩: ${yearsPlayed}年</div>
                <div class="game-actions">
                    <button class="btn-edit" data-id="${game.id}">编辑</button>
                    <button class="btn-delete" data-id="${game.id}">删除</button>
                </div>
            </div>
        `;
        
        // 添加事件监听器
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');
        
        editBtn.addEventListener('click', () => {
            this.editGame(game.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.deleteGame(game.id);
        });
        
        return card;
    }

    /**
     * 打开模态框
     * @param {Object} game - 游戏对象（可选，用于编辑）
     */
    openModal(game = null) {
        if (game) {
            // 编辑模式
            this.editingGameId = game.id;
            this.modalTitle.textContent = '编辑游戏';
            this.gameNameInput.value = game.name;
            this.gameTypeInput.value = game.type;
            this.gameCategoryInput.value = game.category;
            this.gameStartDateInput.value = game.date;
        } else {
            // 添加模式
            this.editingGameId = null;
            this.modalTitle.textContent = '添加游戏';
            this.gameForm.reset();
        }
        
        this.gameModal.style.display = 'flex';
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        this.gameModal.style.display = 'none';
        this.gameForm.reset();
        this.editingGameId = null;
    }

    /**
     * 保存游戏
     */
    saveGame() {
        const gameData = {
            name: this.gameNameInput.value.trim(),
            type: this.gameTypeInput.value,
            category: this.gameCategoryInput.value,
            date: this.gameStartDateInput.value
        };
        
        // 验证表单
        if (!gameData.name || !gameData.date) {
            alert('请填写游戏名称和开始日期');
            return;
        }
        
        if (this.editingGameId) {
            // 更新现有游戏
            const index = this.games.findIndex(g => g.id === this.editingGameId);
            if (index !== -1) {
                this.games[index] = { ...this.games[index], ...gameData };
            }
        } else {
            // 添加新游戏
            const newGame = {
                id: this.generateId(),
                ...gameData
            };
            this.games.push(newGame);
        }
        
        this.saveGamesToStorage();
        
        // 重新应用当前过滤器
        if (this.currentFilter) {
            this.searchInput.value = this.currentFilter;
            this.handleSearch({ target: { value: this.currentFilter } });
        } else {
            this.filteredGames = [...this.games];
            this.renderGames();
        }
        
        this.closeModal();
    }

    /**
     * 编辑游戏
     * @param {string} gameId - 游戏ID
     */
    editGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game) {
            this.openModal(game);
        }
    }

    /**
     * 处理搜索
     * @param {Event} e - 输入事件
     */
    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        this.currentFilter = query;
        
        if (query === '') {
            this.filteredGames = [...this.games];
        } else {
            this.filteredGames = this.games.filter(game => 
                game.name.toLowerCase().includes(query) ||
                game.type.toLowerCase().includes(query) ||
                game.category.toLowerCase().includes(query)
            );
        }
        
        this.renderGames();
    }

    /**
     * 删除游戏
     * @param {string} gameId - 游戏ID
     */
    deleteGame(gameId) {
        if (confirm('确定要删除这个游戏吗？')) {
            this.games = this.games.filter(g => g.id !== gameId);
            this.saveGamesToStorage();
            
            // 重新应用当前过滤器
            if (this.currentFilter) {
                this.searchInput.value = this.currentFilter;
                this.handleSearch({ target: { value: this.currentFilter } });
            } else {
                this.filteredGames = [...this.games];
                this.renderGames();
            }
        }
    }

    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// 当DOM加载完成后初始化游戏模块
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航
    if (typeof Navigation !== 'undefined') {
        const navigation = new Navigation();
        // 设置当前活动导航项为游戏模块
        navigation.setActive('games');
    }
    
    window.gameManager = new GameManager();
});
