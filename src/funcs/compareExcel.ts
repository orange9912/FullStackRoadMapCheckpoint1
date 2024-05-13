import path from "path";
import parseExcel from "../utils/parseExcel.ts";
import { get__dirname } from "../utils/index.ts";
const compareExcel = async () => {
  const excel = await parseExcel();
  const { basicSheetContent, workbook } = excel;
  for (let i = 0; i < basicSheetContent?.length; i++) {
    const row = basicSheetContent[i];
    
    const cellE = row.getCell('E');
    const cellF = row.getCell('F');
    const valueE = cellE.result || cellE.value;
    const valueF = cellF.result || cellF.value;
    if (valueE || valueF) {
      if (String(valueE).toLocaleLowerCase() === String(valueF).toLocaleLowerCase()) {
        console.log('equal, index', i);
        continue;
      } else {
        cellE.style.fill = {
          type: 'pattern',
          pattern: 'lightGray',
          bgColor: {
            argb: 'FFFEFC12'
          },
          fgColor: {
            argb: 'FFFEFC12'
          }
        };
        cellF.style.fill = {
          type: 'pattern',
          pattern: 'mediumGray',
          bgColor: {
            argb: 'FFFEFC12'
          },
          fgColor: {
            argb: 'FFFEFC12'
          }
        };
        console.log('lightUp!');
      }
    }
    // if (value1 || value2)
  }
  await workbook.xlsx.writeFile(path.join(get__dirname(), 'test.xlsx'));
};

export default compareExcel;
