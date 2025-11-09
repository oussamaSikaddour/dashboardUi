const moduleCache = new Map();

// Cache Management
const getCachedModule = (fileName) => {
  return moduleCache.get(fileName);
};

const setCachedModule = (fileName, module) => {
  moduleCache.set(fileName, module);
};

const isModuleCached = (fileName) => {
  return moduleCache.has(fileName);
};

// Module Import
const importModule = async (fileName) => {
  try {
    const module = await import(`../components/${fileName}.js`);
    setCachedModule(fileName, module);
    return module;
  } catch (error) {
    throw new Error(`Failed to import "/components/${fileName}.js": ${error.message}`);
  }
};

 export const loadModuleFromCacheOrImport = async (fileName) => {
  if (isModuleCached(fileName)) {
    return getCachedModule(fileName);
  }
  return await importModule(fileName);
};

// Function Resolution
const resolveFunction = (module, exportType, functionName) => {
  if (exportType === "default") {
    return module.default;
  }
  return module[functionName];
};

const getFunctionLabel = (fileName, exportType, functionName) => {
  if (exportType === "default") {
    return `${fileName}#default`;
  }
  return `${fileName}#${functionName}`;
};

const validateFunction = (fn, label) => {
  if (typeof fn !== "function") {
    throw new Error(`Function not found or not callable: ${label}`);
  }
};

// Function Execution
const executeFunction = (fn, functionArguments, label) => {
  try {
    const result = fn(...functionArguments);
    return { label, result, success: true };
  } catch (error) {
    throw new Error(`Error executing ${label}: ${error.message}`);
  }
};

const processExportEntry = async (module, fileName, entry) => {
  const { exportType = "named", functionName, functionArguments = [] } = entry;
  
  const label = getFunctionLabel(fileName, exportType, functionName);
  const fn = resolveFunction(module, exportType, functionName);
  
  validateFunction(fn, label);
  return executeFunction(fn, functionArguments, label);
};

// Report Management
const createInitialReport = (fileName) => {
  return { 
    fileName, 
    succeeded: false, 
    results: [], 
    errors: [] 
  };
};

const addResultToReport = (report, result) => {
  report.results.push(result);
};

const addErrorToReport = (report, errorMessage) => {
  report.errors.push(errorMessage);
};

const finalizeReport = (report) => {
  report.succeeded = report.errors.length === 0;
  return report;
};

// Main Export Function
export const loadModule = async (fileName, exports = []) => {
  const report = createInitialReport(fileName);

  try {
    const module = await loadModuleFromCacheOrImport(fileName);

    for (const entry of exports) {
      try {
        const result = await processExportEntry(module, fileName, entry);
        addResultToReport(report, result);
      } catch (error) {
        addErrorToReport(report, error.message);
        console.warn(error.message);
      }
    }

    return finalizeReport(report);
  } catch (error) {
    addErrorToReport(report, error.message);
    console.error(error.message);
    return finalizeReport(report);
  }
};