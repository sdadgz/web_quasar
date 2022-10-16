// 设置时间
export function setTime(time: string, type?: string): string {
  if (type === undefined) {
    type = '011110';
  }
  const times = time.split('T');
  const timeArr = [];
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
