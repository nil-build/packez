"use strict";

import { resolveModuleName as _resolveModuleName } from "ts-pnp";

export const resolveModuleName = (
	typescript,
	moduleName,
	containingFile,
	compilerOptions,
	resolutionHost
) => {
	return _resolveModuleName(
		moduleName,
		containingFile,
		compilerOptions,
		resolutionHost,
		typescript.resolveModuleName
	);
};

export const resolveTypeReferenceDirective = (
	typescript,
	moduleName,
	containingFile,
	compilerOptions,
	resolutionHost
) => {
	return _resolveModuleName(
		moduleName,
		containingFile,
		compilerOptions,
		resolutionHost,
		typescript.resolveTypeReferenceDirective
	);
};
