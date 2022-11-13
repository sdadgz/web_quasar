import {CommWarn} from "components/notifyTools";
import {sleep} from "components/Common";

export async function checkPicurl(url) {
  let height;
  let width;

  const img = await new Image();
  img.onload = function () {
  };
  img.src = url;
  img.onerror = function () {
    // CommWarn("警告：错误的图片地址");
    console.warn('图片url错误：' + url);
  }

  while (!img.complete) {
    await sleep(1);
  }
  height = img.height;
  width = img.width;
  console.log(height);
  return height / width;
}
