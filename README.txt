My Planner 云端同步版

请将本文件夹全部文件上传到 GitHub 仓库根目录并覆盖旧文件。
Supabase Authentication 使用邮箱/密码注册登录；登录后会读取并同步 public.tasks。
Supabase 表需包含 id text primary key, user_id uuid, text text, date date, completed boolean, priority text, created_at timestamptz。
请确保启用 RLS，并建立仅允许 auth.uid() = user_id 的 select/insert/update/delete 策略。
Supabase Authentication -> URL Configuration：
Site URL: https://rigakukin0626-star.github.io
Redirect URL: https://rigakukin0626-star.github.io/MyPlanner/
Publishable key 可用于浏览器；不要把 Secret/service_role key 放进前端。
此版本首次登录会把设备本地任务合并到云端；不同设备登录同一账号后，刷新页面即可重新读取云端数据。
