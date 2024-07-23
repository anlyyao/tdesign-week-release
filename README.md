# tdesign-week-release

## 命令行执行

```bash
# 更新子模块
git submodule foreach --recursive 'git checkout develop; git pull; git submodule update'

# 生成周报
node tdesign-week-release.js -- --START_DATE 2024-06-01 --END_DATE 2024-06-07
```