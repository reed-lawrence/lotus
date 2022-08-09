function initDataCellType(init: string): DataCellType {
  const val = String(init) as DataCellType;

  if (VALID_CELL_TYPES.indexOf(val) === -1)
    throw new Error(`Invalid cell type: ${val}`);

  return val;
}

const VALID_CELL_TYPES = ['general', 'number', 'date', 'percent'] as const;

export type DataCellType = typeof VALID_CELL_TYPES[number];

export interface IDataCell {
  display: string;
  value: string;
  type: DataCellType;
  ref: string;
}

export class DataCell implements IDataCell {

  _value: any;

  display = '';

  get value() {
    return this._value ? String(this._value) : '';
  }

  set value(value: string) {
    this._value = value;
  }

  type: DataCellType = 'general';
  ref = '';

  constructor(init?: Partial<IDataCell>) {
    if (init) {
      if (init.display) this.display = String(init.display);
      if (init.value) this.value = String(init.value);
      if (init.type) this.type = initDataCellType(init.type);
      if (init.ref) this.ref = init.ref;
    }
  }
}