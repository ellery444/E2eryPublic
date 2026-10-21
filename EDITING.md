# E2eryPublic 编辑说明

## 最常改的地方

- 首页：`index.html`
- Arch：`pages/arch.html`
- Docker：`pages/docker.html`
- Security：`pages/security.html`
- Physics：`pages/physics.html`
- Writing：`pages/writing.html`
- Experiments：`pages/experiments.html`

## 样式和主题

网站继续使用原生 HTML / CSS / JavaScript，无需安装依赖或构建。

- `assets/fonts/`：随站点提供 Hack Regular / Bold 和许可文件，英文、数字与时钟统一使用终端等宽字体，中文回退到系统字体。
- `assets/home.css`：首页原有布局。
- `assets/page.css`：分类、作品、章节页的基础布局与阅读样式。
- `assets/desktop.css`：全站共享的硬边桌面视觉、响应式规则、NORMAL / OVERDRIVE CSS 变量及短促动画。
- `assets/theme-init.js`：首屏绘制前读取模式，避免刷新闪烁。
- `assets/page.js`：模式切换、窗口标题栏、状态栏、鼠标手势、时钟及随机问候。

默认 NORMAL。点击按钮，或在非链接、非按钮区域按住鼠标左键向下拖动 90px 进入 OVERDRIVE，向上进入 NORMAL。横向拖动可选择正文；触屏滑动保持正常滚动。模式使用 `e2eryPublicMode` 存储，旧 DAY / NIGHT 设置不再使用。浏览器禁用存储时仍可切换，但无法记忆。系统启用减少动态效果时关闭故障动画。

2026-10-21 改版前快照：`/tmp/e2ery-before-cyberpunk-20261021.tar.gz`，包含改版前未提交的首页简介修改。当前环境不允许写 `.git`，因此使用快照回退；需要长期保留时请将快照另存至持久目录。恢复前先另存当前修改，然后在项目根目录解压该快照即可恢复原页面；新增但不再被引用的资源文件可按需删除。

验证：12 个页面在 320、390、768、1440px 下无横向溢出；NORMAL / OVERDRIVE 按钮、纵向拖动、刷新记忆、跨页状态、减少动画、实时时钟通过 Chromium 检查。原始正文及链接逐页比对一致。

原有待补全链接：`pages/works/demon/chapter-01.html` 指向尚不存在的 `chapter-02.html`；`pages/works/burrito/chapter-02.html` 指向尚不存在的 `chapter-03.html`。

## 在 VS Code 中打开整个网站

```bash
cd ~/E2eryPublic
code .
```

左侧文件树就能直接切换所有页面。

## 本地预览

```bash
cd ~/E2eryPublic
python -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
```

不要直接双击分类页预览；使用本地服务器时，相对链接和资源路径更接近 GitHub Pages 的实际情况。

## 添加一条内容

找到页面里的：

```html
<ul class="list">
```

在里面复制一个：

```html
<li>
  <h3>标题</h3>
  <div class="muted">说明文字</div>
</li>
```

## 发布

```bash
git add .
git commit -m "Update public pages"
git push
```
