/**
 * 兼容异步函数的返回值
 * @param res 返回值
 * @param callback 同步/异步结果的回调函数
 * @typeparam T 处理参数的类型，如果是 Promise 类型，则取出其泛型类型
 * @typeparam Param 处理参数具体的类型，如果是 Promise 类型，则指定为原类型
 * @typeparam R 返回值具体的类型，如果是 Promise 类型，则指定为 Promise 类型，否则为原类型
 * @returns 处理后的结果，如果是同步的，则返回结果是同步的，否则为异步的
 */
export function compatibleAsync<
  T,
  R extends T extends Promise<any> ? Awaited<T> : T,
>(res: T, callback: (r: R) => R): R {
  return res instanceof Promise
    ? res.then(callback)
    : (callback(res as any) as any)
}
