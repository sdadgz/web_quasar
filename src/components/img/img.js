import {sleep} from "components/Common";

export async function checkPic(url) {
  let height;
  let width;

  const img = await new Image();
  if (!img.complete) {
    img.onload;
  }
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
  return height / width;
}
