# 共享组件

本目录包含可在多个项目中复用的通用组件。

## API 配置组件

通用的 API 配置模态框组件，支持 OpenAI 兼容的 API 配置。

### 文件说明

- **api-config.html** - 模态框 HTML 结构
- **api-config.js** - JavaScript 逻辑

### 功能特性

- ✅ **双模式输入**
  - 表单模式：传统的输入框界面
  - JSON 模式：直接编辑 JSON 配置
- ✅ **自动持久化**：配置自动保存到 localStorage
- ✅ **配置验证**：自动验证 JSON 格式和必需字段
- ✅ **扩展支持**：JSON 模式支持添加自定义字段
- ✅ **响应式设计**：适配移动端和桌面端

### 使用方法

#### 1. 在项目中引入

```html
<!-- 1. 引入 JavaScript -->
<script src="../../../shared/api-config.js"></script>

<!-- 2. 复制 api-config.html 中的模态框 HTML 到 body 中 -->
```

#### 2. 初始化配置

```javascript
// 初始化 API 配置
initApiConfig('my_app_config', {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-3.5-turbo'
}, (newConfig) => {
    console.log('配置已更新:', newConfig);
    // 可以在这里重新初始化 API 客户端
});
```

#### 3. 获取配置

```javascript
// 获取当前配置
const config = getConfig();

// 使用配置
fetch(`${config.baseUrl}/chat/completions`, {
    headers: {
        'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
        model: config.model,
        messages: [...]
    })
});
```

#### 4. 打开配置框

```javascript
// 手动打开配置模态框
openConfigModal();
```

### API 参考

#### `initApiConfig(storageKey, defaultConfig, onConfigChange)`

初始化 API 配置管理器。

- **storageKey** (`string`): localStorage 键名，用于区分不同应用的配置
- **defaultConfig** (`object`): 默认配置对象
  - `baseUrl` (`string`): API 基础 URL
  - `apiKey` (`string`): API 密钥
  - `model` (`string`): 模型名称
- **onConfigChange** (`function`, 可选): 配置变更时的回调函数

#### `getConfig()`

获取当前配置的副本。

**返回**: `object` - 配置对象

#### `updateConfig(newConfig)`

更新配置。

- **newConfig** (`object`): 要更新的配置对象

#### `openConfigModal()`

打开配置模态框。

#### `closeConfigModal()`

关闭配置模态框。

### JSON 配置示例

在 JSON 模式下，可以使用以下格式：

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-xxxxxxxxxxxxxxxxxxxx",
  "model": "gpt-3.5-turbo",
  "customField": "自定义字段"
}
```

### 配置存储位置

配置保存在浏览器的 localStorage 中，键名为 `storageKey` 参数指定的值。

### 主题定制

组件使用 Tailwind CSS 的 slate 色系，与项目整体风格保持一致。如需定制样式，可修改组件中的 CSS 类名。

### 使用示例

查看 [API Config Demo](../projects/productivity/api-config-demo/) 了解完整的使用示例。

### 可集成项目

- [AI Chat Assistant](../projects/ai-tools/ai-chat/) - 可集成
- [Debate Orchestra](../projects/ai-tools/debate-agent/) - 可集成
