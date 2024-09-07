import * as core from '@actions/core';
import * as path from 'path';

export function getArguments(): string {
  let args = '';
  const testFiltercriteria = core.getInput('testFiltercriteria');
  if (testFiltercriteria) {
    args += `/TestCaseFilter:${testFiltercriteria} `;
  }

  const runSettingsFile = core.getInput('runSettingsFile');
  if (runSettingsFile) {
    args += `/Settings:${runSettingsFile} `;
  }

  const pathToCustomTestAdapters = core.getInput('pathToCustomTestAdapters');
  if (pathToCustomTestAdapters) {
    args += `/TestAdapterPath:${pathToCustomTestAdapters} `;
  }

  const runInParallel = core.getInput('runInParallel');
  if (runInParallel && runInParallel.toUpperCase() === 'TRUE') {
    args += `/Parallel `;
  }

  const runTestsInIsolation = core.getInput('runTestsInIsolation');
  if (runTestsInIsolation && runTestsInIsolation.toUpperCase() === 'TRUE') {
    args += `/InIsolation `;
  }

  const codeCoverageEnabled = core.getInput('codeCoverageEnabled');
  if (codeCoverageEnabled && codeCoverageEnabled.toUpperCase() === 'TRUE') {
    args += `/EnableCodeCoverage `;
  }

  const platform = core.getInput('platform');
  if (platform && (platform === 'x86' || platform === 'x64' || platform === 'ARM')) {
    args += `/Platform:${platform} `;
  }

  // make an optional nested sub-path for the root path of artifact saving.
  let resultsDir = 'TestResults';

  const subPath = (core.getInput('resultLogsSubFolderPath') ?? '').trim();

  if ((subPath.length ?? 0) > 0) {
    resultsDir = `${resultsDir}${path.sep}${subPath}`;
  }

  args += `/ResultsDirectory:${resultsDir} `;

  // skip generating the *.trx file, or if not skip also allow passing in a custom filename for the *.trx.
  const skipGeneratingLoggerStr = core.getInput('shouldSkipGeneratingTestLogFile');
  const skipGeneratingLogger = (skipGeneratingLoggerStr ?? '').trim().toUpperCase() === 'TRUE';

  if (!skipGeneratingLogger) {
    let arg = `/Logger:trx`;

    const customTestLogFilename = (core.getInput('customTestLogFilename') ?? '').trim();
    const customTestLogFilenameExists = customTestLogFilename.length > 0;

    if (customTestLogFilenameExists) {
      arg = `${arg};LogFileName=${customTestLogFilename}.trx`;
    }

    args += `${arg} `;
  }

  const otherConsoleOptions = core.getInput('otherConsoleOptions');
  if (otherConsoleOptions) {
    args += `${otherConsoleOptions} `;
  }

  return (args ?? '').trim();
}

