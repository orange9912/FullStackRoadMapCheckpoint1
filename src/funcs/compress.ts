// import * as sharp from "sharp";
import { readDirPath } from "../utils/index.ts";
import * as fs from "fs/promises";
import { logInfo } from "../utils/log.ts";

/**
 * 先实现jpg、png的压缩，简易版实现。
 * 将指定目录内的图片尺寸调整为原先的四分之一：1000*800 => 500 * 400
 */
export const compress = async () => {
  // console.log('compress', sharp);
  const folder = await readDirPath();
  logInfo('Selected Folder: ');
  logInfo(folder);
  const dir = await fs.readdir(folder);
  logInfo('Folder content: ');
  logInfo(dir);
  // 调用sharp压缩图片
  // 针对jpg、png等格式
  // 针对非jpg、png
};