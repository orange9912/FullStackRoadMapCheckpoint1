import Exceljs from "exceljs";
import * as fs from "fs/promises";
import * as path from "path";
import { callInquirer, get__dirname, readDirPath } from "../utils/index.ts";
import AdmZip from "adm-zip";
import dayjs from "dayjs";
import { logError, logSuccessInfo } from "../utils/log.ts";

// 还有一个计算规则
const transformValue = (
  value?: string | Record<string, unknown>,
  ColName?: string
): string => {
  const finalValue = typeof value !== 'string' ? (value?.result || value) : value; // 有公式的地方取result
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
  if (typeof value === "object" && value.result === undefined) {
    return "0";
  }
  return finalValue;
};

const parseExcel = async () => {
  const workbook = new Exceljs.Workbook();
  // 增加交互读取指定excel
  const excelPath = (await readDirPath({ hintPrompt: '请输入excel文件的相对路径' })).path;
  logSuccessInfo(`读取成功，excel最终路径: ${excelPath}`);
  

  // 先简单做，跑通了再考虑交互配置
  const inputFile = await workbook.xlsx.readFile(
    path.resolve(excelPath)
  );
  const allSheet = inputFile.worksheets.map(sheet => sheet.name);
  callInquirer([{ type: 'list', name: 'sheetName', message: '请选择sheet', choices: allSheet }])
  return;
  const basicSheet = inputFile.getWorksheet("Sheet1");

  const basicSheetContent = basicSheet.getRows(2, basicSheet.rowCount);
  // 后续增加解析列的范围
  // const basicSheetContent = basicSheet.getRow(2);
  // basicSheetContent.eachCell((cell, colNum) => {
  //   console.log(`Cell: ${colNum} = ${cell.value} ${cell.name}`);
  // })
  // basicSheetContent.map(row => {
  //   console.table(row.getCell('C'));
  // })

  // 这里开始读取模板docx
  const templateZip = new AdmZip(
    path.resolve(get__dirname(), "./inputFiles/副本评分报告.zip")
  );
  const templateContentXML: string =
    templateZip.readAsText("word/document.xml");

  // %AA
  const originValueArr = Array.from(templateContentXML.match(/%[A-Z]+%*/g));
  console.log("originValueArr", originValueArr);
  // AA
  const valueArr = originValueArr.map((str) => str.replace(/%/g, ""));
  console.log("filtered: ", valueArr);

  // 循环，每一行写入
  basicSheetContent.forEach(async (row) => {
    // 复制一份模版文件
    const userName = row.getCell(1);
    if (!userName.value) {
      return;
    }
    const destFileName = path.resolve(
      get__dirname(),
      `./outputFiles/${userName.value || "undefined"}心理健康结果报告单.zip`
    );
    const descDocx = path.resolve(
      get__dirname(),
      `./outputFiles/${userName.value || "undefined"}心理健康结果报告单.docx`
    );
    await fs.copyFile(
      path.resolve(get__dirname(), "./inputFiles/副本评分报告.zip"),
      destFileName
    ); // 先拷贝一份，然后在这一份上作修改
    let zip;
    try {
      zip = new AdmZip(destFileName); 
    } catch(e) {
      logError(`解析Zip错误，userName: ${userName.value}, 请检查是否重名`);
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

export default parseExcel;
