My Planner 使用说明

1. 解压 MyPlanner.zip。
2. 双击 index.html 可以在电脑浏览器中预览全部基本功能。
3. 要启用 PWA 离线缓存/安装功能，请使用本地服务器打开：
   - 在 VS Code 安装并启动 Live Server 扩展；或
   - 在项目文件夹打开终端，运行：python -m http.server 8000
   - 浏览器访问 http://localhost:8000
4. iPhone 安装：
   - 将整个文件夹部署到 HTTPS 网站（例如 GitHub Pages）。
   - 用 iPhone Safari 打开网站，点分享 -> 添加到主屏幕。
5. 数据兼容：
   - 继续使用 localStorage key: myPlannerTasks
   - 旧任务缺少 priority 时会自动按“中优先级”显示。
   - 当前版本仍为本地数据，不会自动在电脑和 iPhone 之间同步。
6. 备份：
   - 浏览器开发者工具 Console 执行：
     copy(localStorage.getItem("myPlannerTasks"))
   - 粘贴保存到安全位置。恢复时可执行：
     localStorage.setItem("myPlannerTasks", '这里粘贴备份内容')
