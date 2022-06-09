import { triggerRef } from "vue";
import { activeEffect, track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, receiver) {
    // target[ReactiveFlags.IS_REACTIVE] 访问时，会触发此属性
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    // 收集
    track(target, "get", key);

    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);
    // 值变化了
    if (oldValue != value) {
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  },
};
