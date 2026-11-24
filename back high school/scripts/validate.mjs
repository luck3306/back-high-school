import { validateContent } from "../src/engine.js";

const result = validateContent();
console.log("剧情内容校验");
console.log(`事件：${result.stats.events}，结局：${result.stats.endings}`);
console.log(`分类：${JSON.stringify(result.stats.categories)}`);
console.log(`结局分类：${JSON.stringify(result.stats.endingCategories)}`);
for (const warning of result.warnings) console.warn(`[警告] ${warning}`);
for (const error of result.errors) console.error(`[错误] ${error}`);
if (result.errors.length) process.exitCode = 1;
else console.log("校验通过。");
