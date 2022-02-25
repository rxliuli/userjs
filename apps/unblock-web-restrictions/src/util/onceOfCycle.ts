import { safeExec } from './safeExec'
import { compatibleAsync } from './compatibleAsync'

export const LastUpdateKey = 'LastUpdate'
export const LastValueKey = 'LastValue'

/**
 * 在固定时间周期内只执行函数一次
 * @param {Function} fn 执行的函数
 * @param {Number} time 时间周期
 * @returns {Function} 包装后的函数
 */
export function onceOfCycle(fn: (...args: any[]) => any, time: number) {
  const get = window.GM_getValue.bind(window)
  const set = window.GM_setValue.bind(window)
  return new Proxy(fn, {
    apply(_, _this, args) {
      const now = Date.now()
      const last: number | string = get(LastUpdateKey)
      if (
        ![null, undefined, 'null', 'undefined'].includes(last as string) &&
        now - (last as number) < time
      ) {
        return safeExec(() => JSON.parse(get(LastValueKey)), 1)
      }
      return compatibleAsync(Reflect.apply(_, _this, args), (res) => {
        set(LastUpdateKey, now)
        set(LastValueKey, JSON.stringify(res))
        return res
      })
    },
  })
}
