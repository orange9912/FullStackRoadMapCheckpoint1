import Exceljs from 'exceljs';
import * as fs from "fs/promises";
import * as path from "path";
import { get__dirname } from '../utils/index.ts';

const parseExcel = async () => {
  console.log('dir', get__dirname());
  const workbook = new Exceljs.Workbook();
  // 先简单做，跑通了再考虑交互配置
  const inputFile = await workbook.xlsx.readFile(path.resolve(get__dirname(), './inputFiles/副本孩子信息.xlsx'));
  
  const basicSheet = inputFile.getWorksheet('Sheet1');

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
};

export default parseExcel;