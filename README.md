# Zedd.dev 博客

这是一个基于 [Hexo](https://hexo.io/) 和 [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 的静态博客。站点配置位于 `_config.yml`，Fluid 主题配置位于 `_config.fluid.yml`，依赖版本由 `package.json` 和 `pnpm-lock.yaml` 管理。

## 目录结构

```text
.
├── _config.yml             # Hexo 站点、目录和 URL 配置
├── _config.fluid.yml       # Fluid 主题配置
├── package.json            # 脚本和依赖
├── pnpm-lock.yaml          # 依赖锁文件
├── pnpm-workspace.yaml     # pnpm 工作区和安装策略
├── scaffolds/              # 新建文章、页面和草稿的模板
├── source/
│   ├── _posts/             # Markdown 文章及文章专属资源
│   ├── img/                # 站点图标等公共图片
│   └── CNAME               # GitHub Pages 自定义域名
└── .github/workflows/      # GitHub Actions 构建和 Pages 发布流程
```

## 主题维护

保留 Fluid 作为主题基础，本站的排版覆盖放在 `source/css/journal.css`，由 `_config.fluid.yml` 的 `custom_css` 加载。不要直接编辑 `node_modules/hexo-theme-fluid`，安装依赖会覆盖该目录。

样式采用单栏文章列表、无背景图的页头与连续阅读区域，保留深浅色切换、文章目录及代码复制。调整样式后检查首页、归档和包含长标题、代码、图片的文章页，并分别检查手机宽度和深浅两种配色。

`public/` 和 `db.json` 是 Hexo 生成的本地文件，`node_modules/` 是依赖安装目录，均不属于源内容。当前站点 URL 为 `https://zedd.dev`，根路径为 `/`，主题为 `fluid`。

## 内容维护约束

维护改动只调整工具链、脚本和自动化流程，不改变已有内容。以下内容必须保持原样并保持可访问：

- `source/_posts/` 下文章的文件名、正文、front matter 字段和值；
- 文章使用的分类、标签、日期、标题和文章顺序语义；
- 文章目录中的图片及其相对位置、文件名和引用关系；
- `source/img/` 中的站点图片和 `source/CNAME`。

新增文章沿用现有 front matter 习惯，例如 `title`、`date`、`tags` 和 `categories`。修改文章内容、重命名文章或移动图片时，需要单独评估生成 URL 和历史链接的影响，不与工具链维护一起处理。

## 链接和资源规则

文章永久链接由 `_config.yml` 的规则生成：

```text
/:year/:month/:day/:hash/
```

站点根路径保持 `/`。归档、分类和标签目录分别使用 `archives/`、`categories/` 和 `tags/`。文章正文中的站外链接继续使用 Markdown 绝对 URL；文章内跳转使用现有锚点写法。文章专属图片放在对应文章目录下，并使用相对引用，例如：

```text
source/_posts/分析和解决Origin下载提示错误-4-302.md
source/_posts/分析和解决Origin下载提示错误-4-302/ea-302.png
```

```markdown
![EA CDN 302](./ea-302.png)
```

公共站点资源使用 `/img/...` 路径。保持这些规则可以避免生成后的页面出现断链或图片路径变化。

## 本地开发

当前统一使用 Node.js `24.18.0` 和 pnpm `12.3.4`：

- Node 版本写入 `.node-version`，内容为 `24.18.0`；
- `package.json` 的 `packageManager` 固定为 `pnpm@12.3.4`。

在对应 Node 和 pnpm 版本下执行：

```bash
pnpm install --frozen-lockfile
pnpm server
```

`pnpm server` 启动本地 Hexo 服务，默认监听 `http://localhost:4000/`。依赖安装必须使用锁文件；依赖发生变化时，应通过受控的依赖更新流程同步 `package.json` 和 `pnpm-lock.yaml`。

## 构建和检查

```bash
pnpm build
pnpm check
```

`pnpm build` 生成静态站点，`pnpm check` 执行一次干净构建，即依次完成 `clean` 和 `build`。提交前至少运行 `pnpm install --frozen-lockfile` 与 `pnpm check`，并检查生成结果中文章 URL、内部锚点和文章图片是否正常。

## CI 和发布

GitHub Actions 是唯一的发布入口：

- Pull Request 只执行依赖安装和构建检查，不发布 GitHub Pages；
- `main` 分支 push 触发构建，生成并上传 Pages artifact，再由 GitHub Pages workflow 部署；
- 不通过本地 `hexo deploy`、手工上传 `public/` 或其他方式绕过该流程发布。

构建通过、artifact 上传成功和 Pages 部署完成是三个不同的状态，维护记录应分别说明；部署状态以 GitHub Actions 和 GitHub Pages 的实际 readback 为准。

现有标签同时包含大小写不同的 `Java` 和 `java`。macOS 默认大小写不敏感的文件系统可能在本地生成标签页时让这两个目录相互覆盖，因此本地 `public/tags/` 产物不能证明两个标签页都能同时保留。Linux CI 使用区分大小写的文件系统，可以分别生成这两个路径；不要为规避本地产物限制而修改已有标签内容。

## 变更前检查

涉及工程配置的改动应确认没有误改文章或资源：

```bash
git diff --check
git status --short
git diff -- source/_posts source/img source/CNAME
```

若 diff 出现文章正文、front matter、图片或其路径变化，应先暂停该配置改动，单独处理内容变更。
