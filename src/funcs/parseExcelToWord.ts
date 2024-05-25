import Exceljs from "exceljs";
import * as fs from "fs/promises";
import * as path from "path";
import { callInquirer, get__dirname, readDirPath } from "../utils/index.ts";
import AdmZip from "adm-zip";
import dayjs from "dayjs";
import { logError, logInfo } from "../utils/log.ts";
import parseExcel from "../utils/parseExcel.ts";

// 还有一个计算规则
const transformValue = (
  value?: string | Record<string, unknown>,
  ColName?: string
): string => {
  const finalValue = typeof value !== "string" ? value?.result || value : value; // 有公式的地方取result
  if (ColName === "D") {
    // 性别，1=>男, 2 => 女
    return ["", "男", "女"][Number(finalValue)];
  }
  if (ColName === "E") {
    return ["", "初一", "初二", "初三"][Number(finalValue)];
  }
  if (finalValue instanceof Date) {
    return dayjs(finalValue).format("YYYY/MM/DD");
  }
  if (typeof value === "object" && finalValue === undefined) {
    return "0";
  }
  return finalValue;
};



const parseExcelToWord = async () => {
  const { basicSheetContent } = await parseExcel();
  await readTemplateAndOutput(basicSheetContent);
}

/**
 * 功能不复用的部分，丢出去
 * @param basicSheetContent 
 */
const readTemplateAndOutput = async (basicSheetContent: Exceljs.Row[]) => {
  // 这里开始读取模板docx
  // 模版名字
  const templateFileName = (await readDirPath({ hintPrompt: '请输入模版文件位置(需要改成zip扩展名）' }))?.path;
  const templateZip = new AdmZip(
    path.resolve(get__dirname(), templateFileName)
  );
  const templateContentXML: string =
    templateZip.readAsText("word/document.xml");

  // %AA
  const originValueArr = Array.from(templateContentXML.match(/%[A-Z]+%*/g));
  console.log("originValueArr", originValueArr);
  // AA
  const valueArr = originValueArr.map((str) => str.replace(/%/g, ""));
  console.log("filtered: ", valueArr);

  // 读取目标文件的模版名称; 这里$colIndex代表插入第几个格子的
  // const descFileTempName = '';
  const descFileTempName = (await callInquirer([
    {
      type: "input",
      name: "tempName",
      message: "请输入生成的模版名称（例：$1结果报告单，$1表示使用excel第2列填充）",
    },
  ])).tempName as string || '$1';
  
  // 循环，每一行写入
  basicSheetContent.forEach(async (row) => {
    // 复制一份模版文件
    // 解析模版名称
    const insetCols = descFileTempName.match(/\$\d+/g);
    let templateName = descFileTempName;
    insetCols.forEach(col => {
      const colName = col.slice(1);
      if (!colName) {
        return;
      }
      try {
        const value = row.getCell(Number(colName))?.value;
        const valueStr = value?.result || value?.text || value;
        templateName = templateName.replaceAll(col, valueStr);
      } catch (e) {
        logError(`错误：${col}, `);
        logError(e);
      }
    });
    logInfo(`目标文件名称： ${templateName}`);
    if (!templateName) {
      return;
    }
    // 如果没有输出文件夹，
    const outputDir = (await readDirPath({ hintPrompt: '请指定输出文件夹位置' })).path;
    if (!outputDir) {
      logError('输出文件夹指定有问题');
    }
    const destFileName = path.resolve(
      outputDir,
      `./${templateName}.zip`
    );
    const descDocx = path.resolve(
      outputDir,
      `./${templateName}.docx`
    );
    await fs.copyFile(
      path.resolve(get__dirname(), "./inputFiles/template.zip"),
      destFileName
    ); // 先拷贝一份，然后在这一份上作修改
    let zip;
    try {
      zip = new AdmZip(destFileName);
    } catch (e) {
      logError(`解析Zip错误，目标文件名称: ${templateName}, 请检查是否重名`);
      return;
    }
    let contentXML: string = zip.readAsText("word/document.xml");
    for (let j = 0; j < originValueArr.length; j++) {
      const value = transformValue(
        row.getCell(valueArr[j])?.value as string,
        valueArr[j]
      );
      contentXML = contentXML.replace(originValueArr[j], value as string);
    }
    // 没有写入?
    try {
      await zip.addFile("word/document.xml", Buffer.from(contentXML));
      await zip.writeZip(destFileName); // 写入
      await fs.rename(destFileName, descDocx);
    } catch (e) {
      console.log("报错了", e);
    }
    // 循环写
  });
};

export default parseExcelToWord;
