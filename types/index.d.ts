import type { App, Component, ComponentOptions, DefineComponent, Plugin } from 'vue';

export type WBJSLanguage = string;
export type WBJSWatchSource = string | ((context: JSAccessibility) => unknown);
export type WBJSWatcher = readonly [
  WBJSWatchSource | readonly WBJSWatchSource[],
  (context: JSAccessibility, value: unknown, oldValue: unknown) => void,
  ...options: unknown[]
];

export interface JSAccessibility<State extends Record<string, unknown> = Record<string, unknown>> {
  _store: Record<string, any>;
  _router?: Record<string, any>;
  _routes: Record<string, any>;
  _route: Record<string, any>;
  _routeParams: Record<string, any>;
  _lg: { lang: WBJSLanguage; get(): WBJSLanguage; set(lang: WBJSLanguage): void };
  _user: unknown;
  _loggedIn: boolean;
  _userTier: string;
  _props: Record<string, any>;
  _data: Record<string, any>;
  _state: State;
  readonly _s: State;
  _methods: Record<string, (...args: any[]) => any>;
  _meta: Record<string, any>;
  _proto: object;
  _vm: any;
  readonly _el: Element | null;
  _ref(): unknown;
  _refs: Record<string, any>;
  _cookies: any;
  _moment: any;
  _dayjs: any;
  _queryData(...args: any[]): any;
  _aes: { enc?: (...args: any[]) => any; dec?: (...args: any[]) => any };
  _validators: Record<string, any>;
  _watch(prop: any, callback: (...args: any[]) => any, options?: any): any;
  _update(): void;
  _emit(event: string, value?: unknown): void;
  _alert(...args: any[]): unknown;
  _trigger(name: string, ...args: any[]): unknown;
  _go(path: string): void;
}

export interface WBGCViewData<State extends Record<string, unknown> = Record<string, unknown>> {
  viewComps?: Record<string, any>;
  data?: State | (() => State);
  methods?: Record<string, (...args: any[]) => any>;
  watchers?: readonly WBJSWatcher[];
  init0?: (context: JSAccessibility<State>) => void;
  init?: (context: JSAccessibility<State>) => void;
  tracker?: (context: JSAccessibility<State>) => void;
  finalAction?: (context: JSAccessibility<State>) => void;
  request?: Record<string, any>;
  viewOptions?: Record<string, any>;
  params?: Record<string, any>;
  [key: string]: unknown;
}

export interface WBGCProps {
  viewData?: WBGCViewData | null;
  modules?: Record<string, unknown> | null;
  viewParams?: Record<string, unknown> | null;
  loaderDive?: boolean;
}

export interface AssembleViewDataOptions { skip?: string[] }
export interface CreateViewOptions {
  name?: string;
  modules?: Record<string, unknown> | null;
  viewData?: WBGCViewData | null;
}
export interface WBJSInstallOptions {
  components?: Record<string, Component>;
  computed?: Record<string, (...args: any[]) => any>;
  context?: WBJSContextAdapters;
  /** @deprecated Prefer `context`. */
  adapters?: WBJSContextAdapters;
  [key: string]: unknown;
}

export interface WBJSContextAdapters {
  language?: {
    get?(vm: any): string;
    set?(language: string, vm: any): void;
  };
  auth?: {
    user?(vm: any): unknown;
    loggedIn?(vm: any): boolean;
    userTier?(vm: any): string;
  };
  services?: {
    cookies?: any;
    moment?: any;
    dayjs?: any;
    queryData?: (...args: any[]) => any;
    aes?: { enc?: (...args: any[]) => any; dec?: (...args: any[]) => any };
    validators?: Record<string, any>;
  };
}

export const WBGC: DefineComponent<WBGCProps>;
export const WBC: Component;
export function createWBGCOptions(options?: WBJSInstallOptions): ComponentOptions;
export function assembleViewData(
  modules?: Record<string, unknown> | null,
  options?: AssembleViewDataOptions
): WBGCViewData;
export function createView(options: CreateViewOptions): ComponentOptions;
export function install(app: App, options?: WBJSInstallOptions): void;

declare const WBJS: Plugin & {
  install: typeof install;
  createWBGCOptions: typeof createWBGCOptions;
  WBGC: typeof WBGC;
  WBC: typeof WBC;
  assembleViewData: typeof assembleViewData;
  createView: typeof createView;
};
export default WBJS;
