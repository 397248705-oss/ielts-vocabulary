# 雅思单词本

一款为手机浏览器设计的个人雅思背单词 PWA，支持闪卡、选择题和拼写题综合学习。

## 在线使用

正式地址：[https://397248705-oss.github.io/ielts-vocabulary/](https://397248705-oss.github.io/ielts-vocabulary/)

`master` 分支更新后，GitHub Actions 会在测试和构建通过后自动发布到同一地址。

## 功能

- 内置雅思词库，中英文搜索与分类筛选
- 每日新词和到期复习，默认每日 20 个新词
- 闪卡、选择释义、英文拼写综合练习
- 收藏、错题本、连续学习和七日统计
- 添加自定义单词，并自动加入每日新词候选
- 本地备份、恢复和清空数据

## 本地运行

```powershell
npm install
npm run dev
```

## 验证

```powershell
npm test
npm run build
npm run e2e
```

## 数据说明

所有学习记录、自定义单词和设置只保存在当前浏览器的 IndexedDB 中，不会上传到 GitHub 或其他服务器。更换手机、清理浏览器数据或无痕模式都可能使记录丢失，建议定期在设置页导出 JSON 备份。
