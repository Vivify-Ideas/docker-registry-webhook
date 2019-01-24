import { ParsedProject } from './parsed-project';

export interface HookParser {
  parse(paylod: string): ParsedProject
}
