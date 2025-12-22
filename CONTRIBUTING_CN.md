# 如何提交新应用

想在这个源里添加一个新应用吗？有两种方法。

### 方法一：简单模式 (推荐)

你不需要编辑任何代码文件，只需要填写一个表格！

1.  进入 **[Issues](../../issues/new/choose)** 页面。
2.  点击 **Add App Issue** 旁边的 **"Get started"** 按钮。
3.  填写 **应用名称 (App Name)**、**GitHub 仓库 (GitHub Repository)** (格式如 `Owner/Repo`)，并选择 **分类 (Category)**。
4.  点击 **Submit new issue** 提交。

一旦管理员批准你的请求，系统会自动帮你添加应用！🎉

---

### 方法二：高级模式 (Pull Request)

如果你更喜欢直接编辑文件，或者想一次性添加多个应用：

### 第一步：选择分类

首先，确定您的应用属于哪一类。**请勿混淆分类。**

- **Standard Apps** (普通应用): 点击进入 [`sources/standard/apps.json`](sources/standard/apps.json)
- **NSFW Apps** (成人内容): 点击进入 [`sources/nsfw/apps.json`](sources/nsfw/apps.json)

点击上面的链接打开对应的文件。

---

### 第二步：编辑文件

1.  在文件页面的右上角找到 **铅笔图标** (✏️) 并点击它。
2.  滚动到文件最底部。
3.  复制下面的代码块，并粘贴到**最后一个方括号 `]` 之前**。
4.  **重要**：务必检查上一项的结束花括号 `}` 后面是否有逗号 `,`。如果缺少逗号，JSON 将无效。

**复制此模板：**

```json
    ,
    {
        "name": "这里写应用名称",
        "github_repo": "开发者/仓库名",
        "icon_url": "https://example.com/icon.png"
    }
```

#### 字段说明 (严格遵守)

*   **`name`** (必填): 应用在源列表中显示的名称。请使用**英文**或**简洁的中文**。
*   **`github_repo`** (必填): 应用的 GitHub 仓库地址 (例如 `Aiko3993/MyCoolApp`)。
    *   ✅ **推荐**: `Aiko3993/MyCoolApp`
    *   ✅ **支持**: `https://github.com/Aiko3993/MyCoolApp` (系统会自动识别)
*   **`icon_url`** (选填): 应用图标的**直链**。
    *   **自动抓取**: 如果不填，系统会自动扫描仓库寻找最佳图标 (优先查找 `AppIcon.appiconset`)。
    *   如果手动提供，必须以 `http://` 或 `https://` 开头。

> ⚠️ **警告**：不要添加 `description`、`version` 或其他未列出的字段。系统会自动处理这些信息，手动添加会被直接丢弃。

---

### 第三步：提交审核

1.  滚动到页面右上角，点击绿色的 **"Commit changes..."** 按钮。
2.  在弹出的窗口中，选择 **"Propose changes"**。
3.  在下一个页面，点击 **"Create pull request"**。

🎉 **提交完成！**
GitHub Actions 会自动检查您的 JSON 格式。如果检查通过，管理员会尽快合并您的提交。
如果检查失败 (显示红色 ❌)，请检查您是否遗漏了逗号或弄错了引号。

---

## 维护者指南

如果您是项目维护者或 AI 助手，请参阅 [维护手册 (MAINTENANCE.md)](MAINTENANCE.md) 以了解架构详情和操作指南。
