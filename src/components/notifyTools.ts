import {Notify} from 'quasar'

export function LoadingNotify() {
  return Notify.create({
    type: 'ongoing',
    message: "正在加载",
    position: 'top',
  });
}

export function LoadingSucceed(not: any) {
  not({
    icon: 'done',
    color: 'positive',
    type: 'positive',
    message: "加载成功"
  })
}

export function LoadingFail(not: any) {
  not({
    icon: 'error',
    color: 'negative',
    type: 'positive',
    message: "加载失败"
  })
}

//一般类型操作成功
export function CommSuccess(message?: any) {
  Notify.create({
    icon: 'done',
    color: 'positive',
    message: message || '操作成功',
    position: 'top',
    group: message,
  })
}

export function CommFail(message?: any) {
  Notify.create({
    icon: 'error',
    color: 'negative',
    message: message || '操作失败',
    position: 'top',
    group: message,
  })
}

export function CommWarn(message: any) {
  Notify.create({
    icon: 'error',
    type: 'warning',
    message: message || '出现问题了',
    position: 'top',
    group: message,
  })
}
