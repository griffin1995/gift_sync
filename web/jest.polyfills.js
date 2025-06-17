// Polyfills for Node.js environment

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for ReadableStream
global.ReadableStream = require('stream/web').ReadableStream;
global.WritableStream = require('stream/web').WritableStream;
global.TransformStream = require('stream/web').TransformStream;

// Polyfill for fetch (will be overridden by jest.fn() in setup)
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

// Polyfill for URL
if (!global.URL) {
  global.URL = require('url').URL;
}

// Polyfill for URLSearchParams
if (!global.URLSearchParams) {
  global.URLSearchParams = require('url').URLSearchParams;
}

// Polyfill for AbortController
if (!global.AbortController) {
  global.AbortController = require('abort-controller').AbortController;
  global.AbortSignal = require('abort-controller').AbortSignal;
}

// Polyfill for structuredClone
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}