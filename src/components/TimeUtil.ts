// 一天有多少秒
export const SECOND_PER_DAY = 24 * 60 * 60;

// 设置时间
export function setTime(time: string, type?: string): string {
  if (type === undefined) {
    type = '011110';
  }
  const times = time.split('T');
  const timeArr: string[] = [];
  timeArr.push(...times[0].split('-'));
  timeArr.push(...times[1].split(':'));
  let resArr = '';
  for (let i = 0; i < timeArr.length; i++) {
    if (type.charAt(i) === '1') {
      resArr += timeArr[i] + dataStr[i];
    }
  }
  return resArr;
}

const dataStr: string[] = ['年', '月', '日 ', '点', '分', '秒'];

// 时间戳转日期
export function toLocalDatetime(timestamp) {
  const date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + 'T';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

// 获取时间戳，单位s
export function getTimeNow(offset?: number): number {
  return Date.now() / 1000 - (offset || 0);
}

// 时间是否过期，默认3天
export function isTimeout(createTime: number, expireSecond?: number): boolean {
  // 默认过期时间
  if (!expireSecond) {
    expireSecond = SECOND_PER_DAY * 3;
  }

  // 向左偏移了n秒的时间，大于原时间过期
  const timeOffset: number = getTimeNow(expireSecond);

  return timeOffset > createTime;
}
