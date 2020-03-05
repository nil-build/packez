"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveTypeReferenceDirective = exports.resolveModuleName = void 0;

var _tsPnp = require("ts-pnp");

const resolveModuleName = (typescript, moduleName, containingFile, compilerOptions, resolutionHost) => {
  return (0, _tsPnp.resolveModuleName)(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveModuleName);
};

exports.resolveModuleName = resolveModuleName;

const resolveTypeReferenceDirective = (typescript, moduleName, containingFile, compilerOptions, resolutionHost) => {
  return (0, _tsPnp.resolveModuleName)(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveTypeReferenceDirective);
};

exports.resolveTypeReferenceDirective = resolveTypeReferenceDirective;