import {CommWarn} from "components/notifyTools";

export async function checkPicurl(url) {
  let height;
  let width;

  const img = await new Image();
  img.src = await url;
  img.onerror = await function () {
    CommWarn("警告：错误的图片地址");
    return 1.002;
  }

  if (img.complete) {
    height = img.height;
    width = img.width;
    return height / width;
  } else {
    img.onload = function () {
      height = img.height;
      width = img.width;
      return height / width;
    }
  }

}
