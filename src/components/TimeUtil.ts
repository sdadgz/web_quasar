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
