// import "./style/common.css"
// import React from 'react';
// import ReactDOM from 'react-dom';
import "./style/index.css"
import scope from "./style/index.module.css"
import a from "./index.html";
import a1 from "./index.ext";
import j from "./index.json"
// var sum = require('./lib/sum')
// var max = require('./lib/max')
// // var min = require('lodash')
// var min = require('./lib/min')

console.log(scope)

const React = () => { }

// var react = require('./vendor/react-dom')
// require('jquery')

//var sx = 11;
//eslint-disable-next-line
//console.log(jQuery)

class AsyncLoadSetting extends React.Component {

    state = { Ctrl: () => '加载中...' }

    componentDidMount() {
        import('./lib/sum').then(Ctrl => this.setState({ Ctrl: Ctrl.default }));
    }

    render() {
        const { Ctrl } = this.state;
        return <Ctrl {...this.props} />
    }
}

const set = new Set();
const map = new Map();

const c = <div>111</div>;

Promise.resolve();

var z = 111;

Object.assign({})

function avc() {
    import("react").then();
}
// const s = [];

// s.from([]);

// Object.assign({}, {})
// sum();
// max();
// min();

console.log(z)
