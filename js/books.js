/**
 * 读书模块JavaScript文件
 * 实现书籍数据的增删改查和富文本编辑器集成
 */

// 书籍管理类
class BookManager {
    constructor() {
        this.books = [];
        this.currentEditingBook = null;
        this.pellEditor = null;
        this.init();
    }

    /**
     * 初始化读书模块
     * 加载书籍数据、初始化编辑器、绑定事件
     */
    init() {
        this.loadBooks();
        this.initPellEditor();
        this.bindEvents();
        this.renderBooks();
    }

    /**
     * 从localStorage加载书籍数据
     * @returns {Array} 书籍数组
     */
    loadBooks() {
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            try {
                this.books = JSON.parse(savedBooks);
            } catch (e) {
                console.error('加载书籍数据失败:', e);
                this.books = [];
            }
        }
        return this.books;
    }

    /**
     * 保存书籍数据到localStorage
     * @returns {boolean} 保存是否成功
     */
    saveBooks() {
        try {
            localStorage.setItem('books', JSON.stringify(this.books));
            return true;
        } catch (e) {
            console.error('保存书籍数据失败:', e);
            utils.showMessage('保存失败，请重试', 'error');
            return false;
        }
    }

    /**
     * 初始化Pell富文本编辑器
     */
    initPellEditor() {
        const editorElement = document.getElementById('pell-editor');
        if (editorElement) {
            this.pellEditor = utils.initPellEditor(editorElement);
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 添加书籍按钮
        const addBookBtn = document.getElementById('add-book-btn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => this.openAddBookModal());
        }

        // 搜索框
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                this.searchBooks(e.target.value);
            }, 300));
        }

        // 模态框关闭按钮
        const modalCloseBtn = document.getElementById('modal-close');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeModal());
        }

        // 模态框取消按钮
        const modalCancelBtn = document.getElementById('modal-cancel');
        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => this.closeModal());
        }

        // 模态框保存按钮
        const modalSaveBtn = document.getElementById('modal-save');
        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', () => this.saveBook());
        }

        // 点击模态框外部关闭
        const modal = document.getElementById('book-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // 表单提交事件
        const bookForm = document.getElementById('book-form');
        if (bookForm) {
            bookForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveBook();
            });
        }
    }

    /**
     * 渲染书籍列表
     * @param {Array} booksToRender - 要渲染的书籍数组，默认为所有书籍
     */
    renderBooks(booksToRender = this.books) {
        const booksContainer = document.getElementById('books-container');
        const emptyState = document.getElementById('empty-state');

        if (!booksContainer) return;

        // 清空容器
        booksContainer.innerHTML = '';

        if (booksToRender.length === 0) {
            // 显示空状态
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        // 隐藏空状态
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // 渲染书籍卡片
        booksToRender.forEach(book => {
            const bookCard = this.createBookCard(book);
            booksContainer.appendChild(bookCard);
        });
    }

    /**
     * 创建书籍卡片元素
     * @param {Object} book - 书籍对象
     * @returns {HTMLElement} 书籍卡片元素
     */
    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.bookId = book.id;

        // 书籍封面
        const cover = document.createElement('div');
        cover.className = 'book-cover';
        cover.innerHTML = '📖';

        // 书籍信息
        const info = document.createElement('div');
        info.className = 'book-info';

        const title = document.createElement('h3');
        title.className = 'book-title';
        title.textContent = book.title;

        const author = document.createElement('div');
        author.className = 'book-author';
        author.textContent = book.author;

        const date = document.createElement('div');
        date.className = 'book-date';
        date.textContent = utils.formatDate(book.readDate);

        const notesPreview = document.createElement('div');
        notesPreview.className = 'book-notes-preview';
        notesPreview.textContent = this.stripHtml(book.notes).substring(0, 100) + (book.notes.length > 100 ? '...' : '');

        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(date);
        info.appendChild(notesPreview);

        // 书籍操作区域
        const actions = document.createElement('div');
        actions.className = 'book-actions';

        const expandBtn = document.createElement('button');
        expandBtn.className = 'btn-expand';
        expandBtn.textContent = '展开笔记';
        expandBtn.addEventListener('click', () => this.toggleBookNotes(book.id));

        const cardActions = document.createElement('div');
        cardActions.className = 'book-card-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon edit';
        editBtn.innerHTML = '✏️';
        editBtn.title = '编辑';
        editBtn.addEventListener('click', () => this.editBook(book.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', () => this.deleteBook(book.id));

        cardActions.appendChild(editBtn);
        cardActions.appendChild(deleteBtn);

        actions.appendChild(expandBtn);
        actions.appendChild(cardActions);

        // 完整笔记区域（默认隐藏）
        const notesFull = document.createElement('div');
        notesFull.className = 'book-notes-full';
        notesFull.id = `notes-${book.id}`;

        const notesContent = document.createElement('div');
        notesContent.className = 'book-notes-content';
        notesContent.innerHTML = book.notes;

        notesFull.appendChild(notesContent);

        // 组装卡片
        card.appendChild(cover);
        card.appendChild(info);
        card.appendChild(actions);
        card.appendChild(notesFull);

        return card;
    }

    /**
     * 切换书籍笔记的展开/收起状态
     * @param {string} bookId - 书籍ID
     */
    toggleBookNotes(bookId) {
        const notesElement = document.getElementById(`notes-${bookId}`);
        const expandBtn = document.querySelector(`[data-book-id="${bookId}"] .btn-expand`);

        if (!notesElement || !expandBtn) return;

        const isExpanded = notesElement.classList.contains('show');

        if (isExpanded) {
            notesElement.classList.remove('show');
            expandBtn.classList.remove('expanded');
            expandBtn.textContent = '展开笔记';
        } else {
            notesElement.classList.add('show');
            expandBtn.classList.add('expanded');
            expandBtn.textContent = '收起笔记';
        }
    }

    /**
     * 打开添加书籍模态框
     */
    openAddBookModal() {
        this.currentEditingBook = null;
        this.resetForm();
        this.openModal();
    }

    /**
     * 编辑书籍
     * @param {string} bookId - 书籍ID
     */
    editBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        this.currentEditingBook = book;
        this.populateForm(book);
        this.openModal();
    }

    /**
     * 删除书籍
     * @param {string} bookId - 书籍ID
     */
    deleteBook(bookId) {
        if (!confirm('确定要删除这本书吗？')) return;

        const index = this.books.findIndex(b => b.id === bookId);
        if (index !== -1) {
            this.books.splice(index, 1);
            this.saveBooks();
            this.renderBooks();
            utils.showMessage('书籍已删除', 'success');
        }
    }

    /**
     * 保存书籍（新增或编辑）
     */
    saveBook() {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const readDate = document.getElementById('book-date').value;
        const notes = this.pellEditor ? this.pellEditor.content.innerHTML : '';

        // 验证表单
        if (!title) {
            utils.showMessage('请输入书名', 'error');
            return;
        }

        if (!author) {
            utils.showMessage('请输入作者', 'error');
            return;
        }

        if (!readDate) {
            utils.showMessage('请选择阅读日期', 'error');
            return;
        }

        if (this.currentEditingBook) {
            // 编辑现有书籍
            const index = this.books.findIndex(b => b.id === this.currentEditingBook.id);
            if (index !== -1) {
                this.books[index] = {
                    ...this.books[index],
                    title,
                    author,
                    readDate,
                    notes
                };
            }
        } else {
            // 添加新书籍
            const newBook = {
                id: utils.generateId(),
                title,
                author,
                readDate,
                notes
            };
            this.books.unshift(newBook); // 添加到数组开头
        }

        // 保存并更新UI
        if (this.saveBooks()) {
            this.renderBooks();
            this.closeModal();
            utils.showMessage(this.currentEditingBook ? '书籍已更新' : '书籍已添加', 'success');
        }
    }

    /**
     * 搜索书籍
     * @param {string} query - 搜索关键词
     */
    searchBooks(query) {
        if (!query.trim()) {
            this.renderBooks();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filteredBooks = this.books.filter(book => {
            return (
                book.title.toLowerCase().includes(lowerQuery) ||
                book.author.toLowerCase().includes(lowerQuery) ||
                this.stripHtml(book.notes).toLowerCase().includes(lowerQuery)
            );
        });

        this.renderBooks(filteredBooks);
    }

    /**
     * 打开模态框
     */
    openModal() {
        const modal = document.getElementById('book-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        const modal = document.getElementById('book-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // 恢复滚动
        }
    }

    /**
     * 重置表单
     */
    resetForm() {
        document.getElementById('book-title').value = '';
        document.getElementById('book-author').value = '';
        document.getElementById('book-date').value = '';
        
        if (this.pellEditor) {
            this.pellEditor.content.innerHTML = '';
        }

        // 更新模态框标题
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = '添加书籍';
        }
    }

    /**
     * 填充表单数据
     * @param {Object} book - 书籍对象
     */
    populateForm(book) {
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-date').value = book.readDate;
        
        if (this.pellEditor) {
            this.pellEditor.content.innerHTML = book.notes;
        }

        // 更新模态框标题
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = '编辑书籍';
        }
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
}

// 页面加载完成后初始化读书模块
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航
    if (typeof Navigation !== 'undefined') {
        const navigation = new Navigation();
        // 设置当前活动导航项为读书模块
        navigation.setActive('books');
    }

    // 初始化读书模块
    window.bookManager = new BookManager();
});