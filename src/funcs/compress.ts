import * as sharp from "sharp";
import { readDir } from "../utils/index";

export const compress = async () => {
  console.log('compress', sharp);
  const folder = await readDir();
  console.log('folder', folder);
};