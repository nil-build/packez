import Map from '@babel/runtime-corejs2/core-js/map';
import Set from '@babel/runtime-corejs2/core-js/set';
import Promise from '@babel/runtime-corejs2/core-js/promise';
import "whatwg-fetch";

if (typeof window.Set === 'undefined') {
    window.Set = Set;
}

if (typeof window.Map === 'undefined') {
    window.Map = Map;
}

if (typeof window.Promise === 'undefined') {
    window.Promise = Promise;
}

