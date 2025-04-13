
// import { Home } from './modules/home/index.tsx';
// console.log('hello world');
// Home();

import('./modules/home/index').then(res => {
    console.log(res);
    res.Home();
}).catch(err => {
    console.log(err);
})

import(/* webpackChunkName: 'testIndex' */  './modules/test/index').then(res => {
    console.log(res);
    res.Test();
}).catch(err => {
    console.log(err);
})


// const path = './modules/test/index.js';
// const mod = await new Function('return import("' + path + '")')();

// export default mod