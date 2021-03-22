/* eslint-disable prefer-const, import/no-mutable-exports */

const { createFactory } = require('react');

let createClass;
let renderToString;
let createPortal;
let createContext;
let createRef;
let forwardRef;
let Fragment;
let StrictMode;
let AsyncMode;
let ConcurrentMode;
let createRoot;
let Profiler;
let PureComponent;
let Suspense;
let lazy;
let memo;
let useCallback;
let useContext;
let useDebugValue;
let useEffect;
let useImperativeHandle;
let useLayoutEffect;
let useMemo;
let useReducer;
let useRef;
let useState;
let act;

createClass = require('create-react-class');

({ renderToString } = require('react-dom/server'));

({ createPortal } = require('react-dom'));

({ PureComponent } = require('react'));

({ Fragment } = require('react'));

({
  createContext,
  createRef,
  forwardRef,
  StrictMode,
  unstable_AsyncMode: AsyncMode,
} = require('react'));

({ Profiler } = require('react'));

({
  Suspense,
  lazy,
  memo,
} = require('react'));

({
  unstable_ConcurrentMode: ConcurrentMode,
} = require('react'));

({
  unstable_createRoot: createRoot,
} = require('react'));

({
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} = require('react'));

({
  act,
} = require('react-dom/test-utils'));

export {
  createClass,
  createFactory,
  renderToString,
  createPortal,
  createContext,
  createRef,
  createRoot,
  forwardRef,
  Fragment,
  StrictMode,
  AsyncMode,
  ConcurrentMode,
  Profiler,
  PureComponent,
  Suspense,
  lazy,
  memo,
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  act,
};
