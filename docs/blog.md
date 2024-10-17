# BLOG

## Tauri

data-tauri-drag-region 代表在应用中，该位置可拖动

以下方法可以给panelmenu的任意一个层级添加active类，实现点击菜单项高亮显示（node目前指向a标签），层级关系是这样的：".panelmenu"-".panelmenu-panel"-".panelmenul-header"-".panelmenul-header-content"-"a标签"

```ts
// 处理点击菜单项
const activeMenu = (event: any) => {
  let node;
  if (event.target.tagName === "A") {
    node = event.target;
  } else {
    node = event.target.parentNode;
  }

  // 获取所有菜单项的元素
  const menuItems = document.querySelectorAll(".p-panelmenu-panel");
  menuItems.forEach((item) => item.classList.remove("active"));

  // 为点击的菜单项添加 active 类
  node.parentElement?.parentElement?.parentElement?.classList.add("active");
};
```

TODO:

- [x] Header添加邮件按钮、提醒按钮、设置按钮
- [x] Sidebar样式修改，增加下滑动画
- [x] 人员信息界面样式基本完成，还差部分功能的实现和bug修复
- [x] 添加页面跳转时的动画效果，人员信息的搜索功能
- [x] 人员信息界面bug修复，样式修改
- [x] 修复选中后无法删除的问题
- [x] 修复勾选框无法选中的问题
- [x] 单个删除对话框未完善
- [x] 解决无法添加新的人员信息的问题,居然是新添加的被底部遮住了。。。
- [x] 前端正则表达式验证完善
- [x] headerButton样式完善
- [x] 联合查询
- [x] 网页端移动端适配, 好像不用适配网页端了
- [ ] 修改添加人员信息中电话和邮箱的正则表达式
- [ ] 后端别忘了防注入
- [ ] Header各个功能实现
- [ ] 登录逻辑
- [ ] 背景牛逼化
- [x] 添加人员：头像上传
