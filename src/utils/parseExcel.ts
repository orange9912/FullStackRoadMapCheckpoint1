import { logError, logSuccessInfo } from "./log.ts";
import Exceljs from "exceljs";
import { callInquirer, readDirPath } from "./index.ts";
import * as path from "path";
const parseExcel = async () => {
  const workbook = new Exceljs.Workbook();
  // 增加交互读取指定excel
  const excelPath = (
    await readDirPath({ hintPrompt: "请输入excel文件的相对路径" })
  ).path;
  logSuccessInfo(`读取成功，excel最终路径: ${excelPath}`);

  // 先简单做，跑通了再考虑交互配置
  const inputFile = await workbook.xlsx.readFile(path.resolve(excelPath));
  const allSheet = inputFile.worksheets.map((sheet) => sheet.name);

  if (allSheet.length < 1) {
    logError("excel文件无可选择的工作表");
    return;
  }
  const selectedSheet = (
    await callInquirer<{ sheetName: string }>([
      {
        type: "list",
        name: "sheetName",
        message: "请选择sheet",
        choices: allSheet,
      },
      // { sheetName: allSheet[0] },
    ])
  )?.sheetName;
  if (!selectedSheet) {
    logError("没有选择sheet");
  }
  const basicSheet = inputFile.getWorksheet(selectedSheet);
  // return;
  const basicSheetContent = basicSheet.getRows(2, basicSheet.rowCount);
  // 后续增加解析列的范围
  // const basicSheetContent = basicSheet.getRow(2);
  // basicSheetContent.eachCell((cell, colNum) => {
  //   console.log(`Cell: ${colNum} = ${cell.value} ${cell.name}`);
  // })
  // basicSheetContent.map(row => {
  //   console.table(row.getCell('C'));
  // })
  return {
    workbook,
    basicSheetContent,
    selectedSheet
  };
};

export default parseExcel;