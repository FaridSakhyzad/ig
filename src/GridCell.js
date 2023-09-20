export class GridCell {
  id = Math.random().toString(16).substring(2);

  left = null;

  top = null;

  type = 'turf';

  constructor(params = {}) {
    const {
      id,
      left,
      top,
      type,
    } = params;

    this.id = id || Math.random().toString(16).substring(2);
    this.left = left;
    this.top = top;
    this.type = type || 'turf';
  }
}
