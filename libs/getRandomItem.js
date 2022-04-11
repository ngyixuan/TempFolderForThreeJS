import getRandomInt from '../libs/getRandomInt.js';

export default arr => arr[getRandomInt(0, arr.length - 1)];