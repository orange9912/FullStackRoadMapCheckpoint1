import * as sharp from "sharp";
import { readDirPath } from "../utils/index.ts";
import * as fs from "fs/promises";
import { logInfo, logSuccessInfo } from "../utils/log.ts";
import ora from 'ora';

/**
 * 支持的扩展名
 */
const ExpectExtendName = ['png', 'jpg', 'jpeg'];

/**
 * 先实现jpg、png的压缩，简易版实现。
 * 将指定目录内的图片尺寸调整为原先的四分之一：1000*800 => 500 * 400
 */
export const compress = async () => {
  // console.log('compress', sharp);
  const folder = await readDirPath();
  const spinner = ora('读取文件夹...').start();
  logInfo('Selected Folder: ');
  logInfo(folder);
  spinner.text = '读取文件。。';
  const dir = await fs.readdir(folder);
  logInfo('Folder content: ');
  logInfo(dir);
  setTimeout(() => {
    spinner.succeed('完成');
  }, 1000);
  // 调用sharp压缩图片
  // 1. 针对非jpg、png过滤
  const filteredDir = dir.filter(fileName => {
    const splitFileName = fileName.split('.');
    const extName = splitFileName[splitFileName.length - 1];
    if (ExpectExtendName.includes(extName)) {
      return true;
    }
    return false;
  })
  logSuccessInfo('filered Dir: ');
  logInfo(filteredDir)

  // 2. 循环将文件读取成<Buffer>，传递给sharp并输出。
  // 这里可以封装一个函数，将单个文件给sharp处理

  // handleImg([], {  })
  // 3. 完成。
};

/**
 * 处理单个图片内容
 * @param img 
 * @param options 
 */
function handleImg(img: Buffer, options: sharp.SharpOptions) {

}