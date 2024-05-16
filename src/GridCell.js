export class GridCell {
  id = Math.random().toString(16).substring(2);

  left = null;

  top = null;

  type = 'turf';

  selected = false;

  constructor(params = {}) {
    const {
      id,
      left,
      top,
      type,
      offsetLeft,
      offsetTop,
    } = params;

    this.id = id || Math.random().toString(16).substring(2);
    this.left = left;
    this.top = top;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.type = type || 'turf';
  }
}
