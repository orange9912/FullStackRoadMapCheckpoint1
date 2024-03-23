import * as sharp from "sharp";
import { readDirPath } from "../utils/index";

export const compress = async () => {
  console.log('compress', sharp);
  const folder = await readDirPath();
  console.log('folder', folder);
  // 调用sharp
};