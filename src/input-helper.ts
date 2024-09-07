import * as core from '@actions/core'
import {Inputs, NoFileOptions} from './constants'
import {UploadInputs} from './upload-inputs'
import * as path from 'path';

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
  const name = core.getInput(Inputs.Name);

  // make an optional nested sub-path for the root path of artifact saving.
  let theSearchPath = 'TestResults';

  const subPath = (core.getInput('resultLogsSubFolderPath') ?? '').trim();

  if ((subPath.length ?? 0) > 0) {
    theSearchPath = `${theSearchPath}${path.sep}${subPath}`;
  }

  const ifNoFilesFound: string = core.getInput(Inputs.IfNoFilesFound);
  const noFileBehavior: NoFileOptions = NoFileOptions[ifNoFilesFound as keyof typeof NoFileOptions];

  if (!noFileBehavior) {
    core.error(
      `Unrecognized ${Inputs.IfNoFilesFound} input. Provided: ${ifNoFilesFound}. Available options: ${Object.keys(NoFileOptions)}`
    );
  }

  const inputs = {
    artifactName: name,
    searchPath: theSearchPath,
    ifNoFilesFound: noFileBehavior,
  } as UploadInputs;

  const retentionDaysStr = core.getInput(Inputs.RetentionDays);
  if (retentionDaysStr) {
    inputs.retentionDays = parseInt(retentionDaysStr);
    if (isNaN(inputs.retentionDays)) {
      core.error('Invalid retention-days');
    }
  }

  return inputs;
}