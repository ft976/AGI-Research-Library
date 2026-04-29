import { LIBRARY_DATA } from './data';
import { PAPERS_DATA } from './dataPapers';
import { PAPERS2_DATA } from './dataPapers2';
import { PAPERS3_DATA } from './dataPapers3';
import { BOOKS2_DATA } from './dataBooks2';
import { RESOURCES_DATA } from './dataResources';
import { RESOURCES2_DATA } from './dataResources2';

export const FULL_LIBRARY = [
  ...LIBRARY_DATA,
  ...PAPERS_DATA,
  ...PAPERS2_DATA,
  ...PAPERS3_DATA,
  ...BOOKS2_DATA,
  ...RESOURCES_DATA,
  ...RESOURCES2_DATA
];
