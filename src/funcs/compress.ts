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
  logInfo('Selected Folder: ');
  logInfo(folder);
  const spinner = ora().start();
  const dir = await fs.readdir(folder);
  spinner.text = '过滤非图片文件...';
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
  logSuccessInfo('过滤后文件夹: ');
  logInfo(filteredDir)
  // 这里设置进度，读取文件内容
  // let finishCount = 0;
  const readContentTask = filteredDir.map(fileName => {
    const filePath = `${folder}/${fileName}`;
    return fs.readFile(filePath);
  });
  const readContentTaskResult = await Promise.allSettled(readContentTask);
  const fileContent = readContentTaskResult.filter(result => result.status === 'fulfilled' && result.value).map((result: PromiseFulfilledResult<Buffer>) => result.value)
  logInfo([`读取完成，任务总数${readContentTaskResult.length}个，读取成功${fileContent.length}个，`]);
  spinner.text = '读取文件完成';


  // 2. 循环将文件读取成<Buffer>，传递给sharp并输出。
  // 这里可以封装一个函数，将单个文件给sharp处理

  // handleImg([], {  })
  // 3. 完成。
  spinner.succeed('完成');
};

/**
 * 处理单个图片内容
 * @param img 
 * @param options 
 */
function handleImg(img: Buffer, options: sharp.SharpOptions) {

}