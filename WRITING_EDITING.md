# Writing 页面怎么编辑

## 作品目录

文件：

```text
pages/writing.html
```

每一部作品是一整段：

```html
<a class="work-row" href="works/your-work.html">
  ...
</a>
```

复制这一整段，就能增加一行。

## 作品详情和章节目录

例如：

```text
pages/works/demon-guardian.html
```

章节入口是一整段：

```html
<a class="chapter-row" href="#chapter-1">
  ...
</a>
```

这里的 `href="#chapter-1"` 会跳到同一页面中：

```html
<section id="chapter-1">
```

也可以改成外部发布地址：

```html
<a class="chapter-row"
   href="https://example.com/chapter-1"
   target="_blank"
   rel="noreferrer">
```

## 复制更新文件

将本压缩包解压后，在网站根目录执行：

```bash
cp -r ~/Downloads/E2eryPublic_writing_update/. ~/E2eryPublic/
```

这只会更新：

- `assets/page.css`
- `pages/writing.html`
- `pages/works/`

不会覆盖首页 `index.html`。
