import { LIBRARY_DATA } from './data';
import { PAPERS_DATA } from './dataPapers';
import { PAPERS2_DATA } from './dataPapers2';
import { PAPERS3_DATA } from './dataPapers3';
import { PAPERS4_DATA } from './dataPapers4';
import { BOOKS2_DATA } from './dataBooks2';
import { BOOKS3_DATA } from './dataBooks3';
import { RESOURCES_DATA } from './dataResources';
import { RESOURCES2_DATA } from './dataResources2';

export const FULL_LIBRARY = [
  ...LIBRARY_DATA,
  ...PAPERS_DATA,
  ...PAPERS2_DATA,
  ...PAPERS3_DATA,
  ...PAPERS4_DATA,
  ...BOOKS2_DATA,
  ...BOOKS3_DATA,
  ...RESOURCES_DATA,
  ...RESOURCES2_DATA
];
