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

六个分类页共用：

- `assets/page.css`
- `assets/page.js`

因此修改 `page.css` 会同时改变六个分类页的外观；修改 `page.js` 会同时改变它们的昼夜切换手势。

首页暂时仍然是单文件结构，样式和脚本都写在 `index.html` 里面，避免破坏你已经修改好的页面。

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
