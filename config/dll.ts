/**
 * Dll's
 *
 * These are the libraries that should be resolved for the different environments
 *
 * - Polyfills
 * - Vendor
 *
 */

// polyfills
export const Pollyfills = ["babel-pollyfill"];

// vendor
export const Vendor = [
  "react",
  "redux",
  "react-dom",
  "react-router-redux",
  "moment",
  "lodash",
  "history",
  "rxjs"
];

// externals
export const Externals = {
  electron: "require('electron')",
  child_process: "require('child_process')",
  crypto: "require('crypto')",
  events: "require('events')",
  fs: "require('fs')",
  http: "require('http')",
  https: "require('https')",
  assert: "require('assert')",
  dns: "require('dns')",
  net: "require('net')",
  os: "require('os')",
  path: "require('path')",
  querystring: "require('querystring')",
  readline: "require('readline')",
  repl: "require('repl')",
  stream: "require('stream')",
  string_decoder: "require('string_decoder')",
  url: "require('url')",
  util: "require('util')",
  zlib: "require('zlib')"
};
