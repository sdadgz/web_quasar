// 遇到问题睡大觉
import {CommFail, CommSeccess} from "components/notifyTools";

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
