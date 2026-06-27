# 雅思单词本

手机浏览器里的个人雅思背单词 PWA。

## 在线使用

正式地址：<https://397248705-oss.github.io/ielts-vocabulary/>

`master` 分支更新后，GitHub Actions 会在测试和构建通过后自动发布到同一个地址。

## 本地运行

```powershell
npm install
npm run dev
```

打开本地地址后，可以在同一局域网的手机浏览器中访问。

## 验证

```powershell
npm test
npm run build
npm run e2e
```

## 数据

学习记录只保存在浏览器本地，不会上传到 GitHub。设置页支持导出和导入 JSON 备份。
