# CLAUDE.md - Polis 小小城邦

## 项目概述

Q 版儿童六角格建造棋盘游戏，React + TypeScript + Vite + Zustand

## 关键文件

- `src/game/hexMap.ts` - Hex 地图坐标系统
- `src/game/buildings.ts` - 建筑定义
- `src/store/gameStore.ts` - Zustand 游戏状态
- `src/components/HexMap/HexMap.tsx` - 地图渲染
- `src/components/BuildPanel.tsx` - 建造面板

## 开发命令

```bash
npm install    # 安装依赖
npm run dev    # 开发模式
npm run build  # 生产构建
```

## 游戏规则

- 目标：收集 10 ⭐ 胜利
- 每回合 2 个动作
- 探索云朵 → 扩展地图
- 建造建筑 → 增加星星
- 收集资源 → 购买建筑

## 技术栈

- React 18 + TypeScript
- Vite
- Zustand (persist)
- Tailwind CSS
- Framer Motion
- Web Audio API (背景音乐 + 音效)