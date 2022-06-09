var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active)
        return this.fn();
      try {
        this.parent = activeEffect;
        activeEffect = this;
        return this.fn();
      } catch (error) {
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, type, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      const _key = target;
      const _value = /* @__PURE__ */ new Map();
      depsMap = _value;
      targetMap.set(_key, _value);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      const _key = key;
      const _value = /* @__PURE__ */ new Set();
      dep = _value;
      depsMap.set(_key, _value);
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
    console.log(target, type, key);
  }
  function trigger(target, type, key, value, oldValue) {
    console.log(target, type, key, value, oldValue);
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    const effects = depsMap.get(key);
    effects && effects.forEach((effect2) => {
      if (effect2 !== activeEffect) {
        effect2.run();
      }
    });
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value != null;
  };

  // packages/reactivity/src/baseHandle.ts
  var mutableHandlers = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */)
        return true;
      track(target, "get", key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue != value) {
        trigger(target, "set", key, value, oldValue);
      }
      return result;
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target))
      return;
    if (target["__v_isReactive" /* IS_REACTIVE */])
      return target;
    let existingProxy = reactiveMap.get(target);
    if (existingProxy)
      return existingProxy;
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, mutableHandlers);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
