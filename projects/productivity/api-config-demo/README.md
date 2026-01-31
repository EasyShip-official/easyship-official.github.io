# API 配置组件演示

展示通用 API 配置组件的使用方法和功能特性。

## 功能

- 🔧 **双模式输入**：表单模式和 JSON 模式
- 💾 **自动持久化**：配置保存到 localStorage
- ✅ **配置验证**：自动验证 JSON 格式和必需字段
- 🧪 **API 测试**：一键测试 API 连接
- 📋 **配置展示**：实时显示当前配置（隐藏敏感信息）

## 使用说明

1. 点击"打开配置"按钮打开配置框
2. 选择"表单"或"JSON"模式输入配置
3. 保存后配置会自动保存到浏览器
4. 使用"显示当前配置"查看已保存的配置
5. 点击"测试 API 连接"验证配置是否正确

## JSON 配置示例

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-xxxxxxxxxxxxxxxxxxxx",
  "model": "gpt-3.5-turbo"
}
```

## 扩展字段

在 JSON 模式下可以添加自定义字段，例如：

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-xxxxxxxxxxxxxxxxxxxx",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "maxTokens": 2000,
  "customHeaders": {
    "X-Custom-Header": "value"
  }
}
```

## 技术栈

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- localStorage API
