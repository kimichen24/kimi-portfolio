#!/usr/bin/env bash
# 一键部署到 GitHub Pages（gh-pages 分支）
# 在项目根目录执行：bash scripts/deploy-ghpages.sh
#   --no-build  跳过重新构建，直接推送当前 dist/（最快、最稳，适合 dist 已是最新时）
# 需要：已安装 node/npm、git 凭据已配置（git push origin main 能成功即可）
set -e
cd "$(git rev-parse --show-toplevel)"

NO_BUILD=0
[ "$1" = "--no-build" ] && NO_BUILD=1

if [ "$NO_BUILD" = "1" ]; then
  echo "== 1) 跳过构建，使用现有 dist/ =="
  if [ ! -f dist/index.html ]; then
    echo "✗ dist/index.html 不存在，无法 --no-build，请先正常构建"
    exit 1
  fi
else
  echo "== 1) 构建 =="
  mv dist "dist-prebuild-$(date +%s)" 2>/dev/null || true
  npm run build
fi

echo "== 2) 打包 gh-pages 提交（含 .nojekyll，跳过 Jekyll）=="
EPOCH=$(date +%s)
DEPLOY=".deploy-manual-$EPOCH"
rm -rf "$DEPLOY"
mkdir -p "$DEPLOY"
cp -r dist/. "$DEPLOY/"
cd "$DEPLOY"
git init -q
git config user.email "deploy@local"
git config user.name "deploy"
git add -A
git commit -qm "deploy $EPOCH (.nojekyll)"

echo "== 3) force-push 到 gh-pages =="
git push --force "https://github.com/kimichen24/kimi-portfolio.git" HEAD:gh-pages

echo ""
echo "✅ 推送完成。约 1-2 分钟后 https://kimichen24.github.io/kimi-portfolio/ 生效。"
echo "（若仍未更新，到仓库 Settings → Pages 看构建状态）"
