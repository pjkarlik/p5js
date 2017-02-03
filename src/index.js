import Render from './components/Render';
import { description, version } from '../version.json';
require('../resources/styles/styles.css');

// requestAnimationFrame polyfill
const vendors = ['ms', 'moz', 'webkit', 'o'];
const af = 'AnimationFrame';
let lastTime = 0;

if ('performance' in window === false) {
  window.performance = {};
}
if (!Date.now) {
  Date.now = () => new Date().getTime();
}
if ('now' in window.performance === false) {
  let nowOffset = new Date();

  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  window.performance.now = () => Date.now() - nowOffset;
}
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  const vendor = vendors[x];
  window.requestAnimationFrame = window[`${vendor}Request${af}`];
  window.cancelAnimationFrame = window[`${vendor}Cancel${af}`] || window[`${vendor}CancelRequest${af}`];
}
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = callback => {
    const currTime = Date.now;
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);

    lastTime = currTime + timeToCall;
    return id;
  };
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = id => clearTimeout(id);
}
// requestAnimationFrame polyfill

const args = [
  `\n %c %c %c ${description} %c ver ${version} %c \n\n`,
  'background: #000; padding:5px 0;border-top-left-radius:10px;border-bottom-left-radius:10px;',
  'background: #CCC; padding:5px 0;',
  'color: white; background: #000; padding:5px 0;',
  'color: black; background: #CCC; padding:5px 0;',
  'background: #000; padding:5px 0;border-top-right-radius:10px;border-bottom-right-radius:10px;',
];

window.console.log.apply(console, args);
const target = document.createElement('div');
target.className = 'wrapper';

window.onload = () => {
  document.body.appendChild(target);
  const demo = new Render(target, 800, 400);
  return demo;
};
