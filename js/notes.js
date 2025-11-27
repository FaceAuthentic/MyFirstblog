/**
 * 笔记模块JavaScript文件
 * 负责笔记数据的加载、显示、添加、编辑和删除功能
 */

class NoteManager {
    /**
     * 构造函数
     * 初始化笔记管理器
     */
    constructor() {
        // 笔记数据存储
        this.notes = [];
        this.filteredNotes = [];
        this.currentFilter = '';
        
        // 当前编辑的笔记ID
        this.editingNoteId = null;
        
        // Pell编辑器实例
        this.editor = null;
        
        // 初始化DOM元素引用
        this.initDOMElements();
        
        // 初始化笔记模块
        this.init();
    }
    
    /**
     * 初始化DOM元素引用
     */
    initDOMElements() {
        this.notesContainer = document.getElementById('notes-container');
        this.searchInput = document.getElementById('search-input');
        this.addNoteBtn = document.getElementById('add-note-btn');
        this.noteModal = document.getElementById('note-modal');
        this.noteForm = document.getElementById('note-form');
        this.modalTitle = document.getElementById('modal-title');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.emptyState = document.getElementById('empty-state');
        
        // 表单字段
        this.noteTitleInput = document.getElementById('note-title');
        this.noteImageInput = document.getElementById('note-image');
        this.noteEditor = document.getElementById('note-editor');
    }
    
    /**
     * 初始化笔记模块
     * 加载笔记数据并渲染页面
     */
    init() {
        this.loadNotesFromStorage();
        this.initPellEditor();
        this.renderNotes();
        this.setupEventListeners();
    }
    
    /**
     * 从本地存储加载笔记数据
     */
    loadNotesFromStorage() {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            this.notes = JSON.parse(storedNotes);
        } else {
            // 如果没有存储的笔记数据，初始化一些示例数据
            this.notes = [
                {
                    id: this.generateId(),
                    title: 'JavaScript学习笔记',
                    content: '<h3>基础概念</h3><p>JavaScript是一种高级的、解释型的编程语言。</p><h3>变量声明</h3><p>在ES6中，我们可以使用let和const来声明变量。</p>',
                    image: '',
                    date: '2023-06-15',
                    likes: 5
                },
                {
                    id: this.generateId(),
                    title: 'CSS布局技巧',
                    content: '<h3>Flexbox布局</h3><p>Flexbox是一种一维布局方法，用于在行或列中排列元素。</p><h3>Grid布局</h3><p>Grid是一种二维布局系统，可以同时处理行和列。</p>',
                    image: '',
                    date: '2023-06-10',
                    likes: 3
                },
                {
                    id: this.generateId(),
                    title: 'HTML5新特性',
                    content: '<h3>语义化标签</h3><p>HTML5引入了许多语义化标签，如header、nav、section等。</p><h3>多媒体支持</h3><p>HTML5原生支持音频和视频元素。</p>',
                    image: '',
                    date: '2023-06-05',
                    likes: 8
                }
            ];
            this.saveNotesToStorage();
        }
        this.filteredNotes = [...this.notes];
    }
    
    /**
     * 保存笔记数据到本地存储
     */
    saveNotesToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }
    
    /**
     * 初始化Pell富文本编辑器
     */
    initPellEditor() {
        this.editor = utils.initPellEditor(
            this.noteEditor,
            '',
            (html) => {
                // 内容变化时的回调，可以在这里添加自动保存等功能
            }
        );
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 添加笔记按钮点击事件
        this.addNoteBtn.addEventListener('click', () => {
            this.openModal();
        });
        
        // 取消按钮点击事件
        this.cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 表单提交事件
        this.noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote();
        });
        
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e);
        });
        
        // 点击模态框外部关闭
        this.noteModal.addEventListener('click', (e) => {
            if (e.target === this.noteModal) {
                this.closeModal();
            }
        });
    }
    
    /**
     * 渲染笔记列表
     */
    renderNotes() {
        // 清空容器
        this.notesContainer.innerHTML = '';
        
        // 如果没有笔记，显示空状态
        if (this.filteredNotes.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        // 隐藏空状态
        this.emptyState.style.display = 'none';
        
        // 渲染笔记卡片
        this.filteredNotes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            this.notesContainer.appendChild(noteCard);
        });
    }
    
    /**
     * 创建笔记卡片
     * @param {Object} note - 笔记对象
     * @returns {HTMLElement} 笔记卡片元素
     */
    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        
        // 格式化日期
        const formattedDate = utils.formatDate(note.date);
        
        // 获取内容预览（去除HTML标签，只取前100个字符）
        const contentPreview = this.stripHtml(note.content).substring(0, 100) + '...';
        
        card.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <div class="note-date">${formattedDate}</div>
            </div>
            <div class="note-content-preview">${contentPreview}</div>
            ${note.image ? `<div class="note-image"><img src="${note.image}" alt="${note.title}"></div>` : ''}
            <div class="note-footer">
                <div class="note-likes">
                    <span class="like-icon">👍</span>
                    <span class="like-count">${note.likes || 0}</span>
                </div>
                <div class="note-actions">
                    <button class="btn-like" data-id="${note.id}">点赞</button>
                    <button class="btn-edit" data-id="${note.id}">编辑</button>
                    <button class="btn-delete" data-id="${note.id}">删除</button>
                </div>
            </div>
        `;
        
        // 添加事件监听器
        const likeBtn = card.querySelector('.btn-like');
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');
        
        likeBtn.addEventListener('click', () => {
            this.likeNote(note.id);
        });
        
        editBtn.addEventListener('click', () => {
            this.editNote(note.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.deleteNote(note.id);
        });
        
        return card;
    }
    
    /**
     * 打开模态框
     * @param {Object} note - 笔记对象（可选，用于编辑）
     */
    openModal(note = null) {
        if (note) {
            // 编辑模式
            this.editingNoteId = note.id;
            this.modalTitle.textContent = '编辑笔记';
            this.noteTitleInput.value = note.title;
            this.noteImageInput.value = note.image || '';
            this.editor.content.innerHTML = note.content;
        } else {
            // 添加模式
            this.editingNoteId = null;
            this.modalTitle.textContent = '添加笔记';
            this.noteForm.reset();
            this.editor.content.innerHTML = '';
        }
        
        this.noteModal.style.display = 'flex';
    }
    
    /**
     * 关闭模态框
     */
    closeModal() {
        this.noteModal.style.display = 'none';
        this.noteForm.reset();
        this.editor.content.innerHTML = '';
        this.editingNoteId = null;
    }
    
    /**
     * 保存笔记
     */
    saveNote() {
        const noteData = {
            title: this.noteTitleInput.value.trim(),
            content: this.editor.content.innerHTML,
            image: this.noteImageInput.value.trim(),
            date: utils.formatDate(new Date())
        };
        
        // 验证表单
        if (!noteData.title) {
            utils.showMessage('请填写笔记标题', 'error');
            return;
        }
        
        if (!noteData.content || noteData.content === '<p><br></p>') {
            utils.showMessage('请填写笔记内容', 'error');
            return;
        }
        
        if (this.editingNoteId) {
            // 更新现有笔记
            const index = this.notes.findIndex(n => n.id === this.editingNoteId);
            if (index !== -1) {
                this.notes[index] = { ...this.notes[index], ...noteData };
            }
        } else {
            // 添加新笔记
            const newNote = {
                id: this.generateId(),
                ...noteData,
                likes: 0
            };
            this.notes.push(newNote);
        }
        
        this.saveNotesToStorage();
        
        // 重新应用当前过滤器
        if (this.currentFilter) {
            this.searchInput.value = this.currentFilter;
            this.handleSearch({ target: { value: this.currentFilter } });
        } else {
            this.filteredNotes = [...this.notes];
            this.renderNotes();
        }
        
        utils.showMessage('笔记保存成功', 'success');
        this.closeModal();
    }
    
    /**
     * 编辑笔记
     * @param {string} noteId - 笔记ID
     */
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.openModal(note);
        }
    }
    
    /**
     * 删除笔记
     * @param {string} noteId - 笔记ID
     */
    deleteNote(noteId) {
        if (confirm('确定要删除这个笔记吗？')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveNotesToStorage();
            
            // 重新应用当前过滤器
            if (this.currentFilter) {
                this.searchInput.value = this.currentFilter;
                this.handleSearch({ target: { value: this.currentFilter } });
            } else {
                this.filteredNotes = [...this.notes];
                this.renderNotes();
            }
            
            utils.showMessage('笔记删除成功', 'success');
        }
    }
    
    /**
     * 点赞笔记
     * @param {string} noteId - 笔记ID
     */
    likeNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.likes = (note.likes || 0) + 1;
            this.saveNotesToStorage();
            this.renderNotes();
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
            this.filteredNotes = [...this.notes];
        } else {
            this.filteredNotes = this.notes.filter(note => 
                note.title.toLowerCase().includes(query) ||
                this.stripHtml(note.content).toLowerCase().includes(query)
            );
        }
        
        this.renderNotes();
    }
    
    /**
     * 去除HTML标签
     * @param {string} html - HTML字符串
     * @returns {string} 纯文本字符串
     */
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    
    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// 当DOM加载完成后初始化笔记模块
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航
    if (typeof Navigation !== 'undefined') {
        const navigation = new Navigation();
        // 设置当前活动导航项为笔记模块
        navigation.setActive('notes');
    }
    
    window.noteManager = new NoteManager();
});