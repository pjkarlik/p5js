import Render from './components/Render';
import { description, version } from '../version.json';

require('../resources/styles/styles.css');

const args = [
  `\n${description} %c ver ${version} \n\n`,
  'background: #000; padding:5px 0;border-top-left-radius:10px;border-bottom-left-radius:10px;'
];

try {
  window.console.log.apply(console, args);
} catch (e) {
  window.console.log(description + ' : ' + version);
}

window.onload = () => {
  const demo = new Render();
  return demo;
};
