export interface NoitaMaterial {
  id: string;
  name: string;
  tags: string[];
  burnable: boolean;
  density: number | undefined;
  cellType: string | undefined;
}
