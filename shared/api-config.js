/**
 * 通用 API 配置组件
 * 支持：
 * 1. 表单模式：传统的输入框
 * 2. JSON 模式：直接编辑 JSON 配置
 * 3. 自动保存到 localStorage
 * 4. 配置验证和错误提示
 *
 * 使用方法：
 * 1. 在 HTML 中引入此脚本：<script src="../../../shared/api-config.js"></script>
 * 2. 在 HTML body 中添加 api-config.html 中的模态框 HTML
 * 3. 初始化：initApiConfig(storageKey, defaultConfig, onConfigChange)
 * 4. 获取配置：getConfig()
 * 5. 打开配置框：openConfigModal()
 */

let _apiConfigState = {
    storageKey: null,
    config: {},
    defaultConfig: {},
    onConfigChange: null,
    currentMode: 'form' // 'form' 或 'json'
};

/**
 * 初始化 API 配置
 * @param {string} storageKey - localStorage 键名
 * @param {object} defaultConfig - 默认配置
 * @param {function} onConfigChange - 配置变更回调函数
 */
function initApiConfig(storageKey, defaultConfig, onConfigChange = null) {
    _apiConfigState.storageKey = storageKey;
    _apiConfigState.defaultConfig = { ...defaultConfig };
    _apiConfigState.onConfigChange = onConfigChange;

    // 加载已保存的配置
    loadConfigFromStorage();

    // 绑定事件
    bindEvents();

    // 如果没有配置，自动打开配置框
    if (!_apiConfigState.config.apiKey) {
        openConfigModal();
    }
}

/**
 * 从 localStorage 加载配置
 */
function loadConfigFromStorage() {
    const saved = localStorage.getItem(_apiConfigState.storageKey);
    if (saved) {
        try {
            _apiConfigState.config = { ..._apiConfigState.defaultConfig, ...JSON.parse(saved) };
        } catch (e) {
            console.error('配置解析失败，使用默认配置:', e);
            _apiConfigState.config = { ..._apiConfigState.defaultConfig };
        }
    } else {
        _apiConfigState.config = { ..._apiConfigState.defaultConfig };
    }
    syncConfigToUI();
}

/**
 * 保存配置到 localStorage
 */
function saveConfigToStorage() {
    localStorage.setItem(_apiConfigState.storageKey, JSON.stringify(_apiConfigState.config));
    if (_apiConfigState.onConfigChange) {
        _apiConfigState.onConfigChange(_apiConfigState.config);
    }
}

/**
 * 获取当前配置
 * @returns {object} 配置对象
 */
function getConfig() {
    return { ..._apiConfigState.config };
}

/**
 * 更新配置
 * @param {object} newConfig - 新配置
 */
function updateConfig(newConfig) {
    _apiConfigState.config = { ..._apiConfigState.config, ...newConfig };
    saveConfigToStorage();
    syncConfigToUI();
}

/**
 * 打开配置模态框
 */
function openConfigModal() {
    const modal = document.getElementById('api-config-modal');
    const content = document.getElementById('api-modal-content');
    syncConfigToUI();
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

/**
 * 关闭配置模态框
 */
function closeConfigModal() {
    const modal = document.getElementById('api-config-modal');
    const content = document.getElementById('api-modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

/**
 * 同步配置到 UI
 */
function syncConfigToUI() {
    // 表单模式
    const urlInput = document.getElementById('api-url');
    const keyInput = document.getElementById('api-key');
    const modelInput = document.getElementById('api-model');
    const jsonTextarea = document.getElementById('api-json-textarea');

    if (urlInput) urlInput.value = _apiConfigState.config.baseUrl || '';
    if (keyInput) keyInput.value = _apiConfigState.config.apiKey || '';
    if (modelInput) modelInput.value = _apiConfigState.config.model || '';

    // JSON 模式
    if (jsonTextarea) {
        const jsonConfig = { ..._apiConfigState.config };
        jsonTextarea.value = JSON.stringify(jsonConfig, null, 2);
    }
}

/**
 * 从表单读取配置
 */
function readConfigFromForm() {
    return {
        baseUrl: document.getElementById('api-url').value.replace(/\/$/, ''),
        apiKey: document.getElementById('api-key').value.trim(),
        model: document.getElementById('api-model').value.trim()
    };
}

/**
 * 从 JSON 读取配置
 */
function readConfigFromJSON() {
    const textarea = document.getElementById('api-json-textarea');
    const errorDiv = document.getElementById('api-json-error');

    try {
        const config = JSON.parse(textarea.value);

        // 验证必需字段
        if (!config.baseUrl || !config.apiKey || !config.model) {
            throw new Error('缺少必需字段: baseUrl, apiKey, model');
        }

        errorDiv.classList.add('hidden');
        return config;
    } catch (e) {
        errorDiv.textContent = 'JSON 格式错误: ' + e.message;
        errorDiv.classList.remove('hidden');
        return null;
    }
}

/**
 * 切换模式
 */
function switchMode(mode) {
    _apiConfigState.currentMode = mode;
    const formBtn = document.getElementById('mode-form-btn');
    const jsonBtn = document.getElementById('mode-json-btn');
    const formDiv = document.getElementById('api-config-form');
    const jsonDiv = document.getElementById('api-config-json');

    if (mode === 'form') {
        formBtn.classList.replace('bg-slate-700', 'bg-indigo-600');
        formBtn.classList.replace('text-slate-300', 'text-white');
        jsonBtn.classList.replace('bg-indigo-600', 'bg-slate-700');
        jsonBtn.classList.replace('text-white', 'text-slate-300');
        formDiv.classList.remove('hidden');
        jsonDiv.classList.add('hidden');
    } else {
        jsonBtn.classList.replace('bg-slate-700', 'bg-indigo-600');
        jsonBtn.classList.replace('text-slate-300', 'text-white');
        formBtn.classList.replace('bg-indigo-600', 'bg-slate-700');
        formBtn.classList.replace('text-white', 'text-slate-300');
        jsonDiv.classList.remove('hidden');
        formDiv.classList.add('hidden');
    }
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 模式切换
    document.getElementById('mode-form-btn').addEventListener('click', () => switchMode('form'));
    document.getElementById('mode-json-btn').addEventListener('click', () => switchMode('json'));

    // 关闭按钮
    document.getElementById('close-api-config').addEventListener('click', closeConfigModal);
    document.getElementById('close-api-config-json').addEventListener('click', closeConfigModal);

    // 点击模态框外部关闭
    document.getElementById('api-config-modal').addEventListener('click', (e) => {
        if (e.target.id === 'api-config-modal') closeConfigModal();
    });

    // 表单提交
    document.getElementById('api-config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newConfig = readConfigFromForm();

        if (!newConfig.apiKey) {
            const errorDiv = document.getElementById('api-error');
            errorDiv.textContent = 'API Key 不能为空';
            errorDiv.classList.remove('hidden');
            return;
        }

        updateConfig(newConfig);
        closeConfigModal();
    });

    // JSON 保存
    document.getElementById('save-json-btn').addEventListener('click', () => {
        const newConfig = readConfigFromJSON();
        if (newConfig) {
            updateConfig(newConfig);
            closeConfigModal();
        }
    });

    // JSON 格式化
    document.getElementById('format-json-btn').addEventListener('click', () => {
        const textarea = document.getElementById('api-json-textarea');
        try {
            const config = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(config, null, 2);
        } catch (e) {
            alert('JSON 格式错误，无法格式化');
        }
    });
}
