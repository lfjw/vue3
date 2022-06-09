/**
 * 实现功能
 *
 * 1 同一个对象，代理多次，返回同一个代理
 *     let obj = {name:1}
 *     let data1 = reactive(obj)
 *     let data2 = reactive(obj)
 *     data1 === data2  ->  true
 *
 * 2 代理对象再次代理，直接返回
 *    let data = reactive({name})
 *    let data1 = reactive(data)
 */

import { isObject } from "@vue3/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandle";
//  WeakMap key 只能是对象
const reactiveMap = new WeakMap();

export function reactive(target) {
  // 是否是对象
  if (!isObject(target)) return;

  // 如果传递的对象，
  // 1 普通对象，直接运行
  // 2 proxy，会走get属性
  // 不需要单独设置
  if (target[ReactiveFlags.IS_REACTIVE]) return target;

  // 缓存 data === data
  let existingProxy = reactiveMap.get(target);
  if (existingProxy) return existingProxy;

  // 第一次普通对象代理 会使用 new Proxy 代理一次

  // 第二次传递proxy，查询有没有代理过，访问第二次传递的对象，如果有get方法，则代理过
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, mutableHandlers);
  return proxy;
}

// TODO: 认识Reflect
/**
 * let target = {
 *  name:"jw",
 *  get alias() {
 *    return this.name
 *  }
 * }
 * 不使用 Reflect 会导致 name 属性改变了，alias不改变
 */
