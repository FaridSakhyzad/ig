export const calculateNewCoords = (coordinateX, coordinateY, angle, moveStep) => { // eslint-disable-line
  const theAngle = 90 - angle;
  const newCoordinateX = moveStep * Math.cos(theAngle * Math.PI / 180);
  const newCoordinateY = moveStep * Math.sin(theAngle * Math.PI / 180);

  return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
}

export const findRectangleCircleIntersection = (rectangle, circle) => {
  const { rectangleX, rectangleY, rectangleWidth, rectangleHeight, angle } = rectangle;
  const { circleX, circleY, radius } = circle;

  const { nx: newCircleX, ny: newCircleY } = rotate(rectangleX, rectangleY, circleX, circleY, angle);

  const centersDistanceX = rectangleX > newCircleX ? rectangleX - newCircleX : newCircleX - rectangleX;
  const centersDistanceY = rectangleY > newCircleY ? rectangleY - newCircleY : newCircleY - rectangleY;

  if (centersDistanceX >= ((rectangleWidth / 2) + radius)) {
    return false;
  }

  if (centersDistanceY >= ((rectangleHeight / 2) + radius)) {
    return false;
  }

  const closestCornerX = newCircleX < rectangleX ? rectangleX - (rectangleWidth / 2) : rectangleX + (rectangleWidth / 2);
  const closestCornerY = newCircleY < rectangleY ? rectangleY - (rectangleHeight / 2) : rectangleX + (rectangleHeight / 2);

  const deltaX = newCircleX < closestCornerX ? newCircleX - closestCornerX : closestCornerX - newCircleX;
  const deltaY = newCircleY < closestCornerY ? newCircleY - closestCornerY : closestCornerY - newCircleY;

  const cornerDistancePow = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);

  return cornerDistancePow < Math.pow(radius, 2);
}

export const rotate = (cx, cy, x, y, angle) => {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

  return { nx, ny };
}

export const findCircleLineIntersections = (circleRadius, circleX, circleY, m, n) => {
  // circle: (x - h)^2 + (y - k)^2 = r^2
  // line: y = m * x + n
  // r: circle radius
  // h: x value of circle centre
  // k: y value of circle centre
  // m: slope
  // n: y-intercept

  // get a, b, c values
  const a = 1 + Math.pow(m, 2);
  const b = -circleX * 2 + (m * (n - circleY)) * 2;
  const c = Math.pow(circleX, 2) + Math.pow(n - circleY, 2) - Math.pow(circleRadius, 2);

  // get discriminant
  const D = Math.pow(b, 2) - 4 * a * c;

  if (D >= 0) {
    // insert into quadratic formula
    var intersections = [
      (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    ];
    if (D === 0) {
      // only 1 intersection
      return [intersections[0]];
    }
    return intersections;
  }
  // no intersection
  return [];
}

export const doesLineInterceptCircle = (A, B, C, radius) => { // eslint-disable-line
  var dist;
  const v1x = B.x - A.x;
  const v1y = B.y - A.y;
  const v2x = C.x - A.x;
  const v2y = C.y - A.y;
  // get the unit distance along the line of the closest point to
  // circle center
  const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);


  // if the point is on the line segment get the distance squared
  // from that point to the circle center
  if(u >= 0 && u <= 1){
    dist  = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
  } else {
    // if closest point not on the line segment
    // use the unit distance to determine which end is closest
    // and get dist square to circle
    dist = u < 0 ?
      (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
      (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
  }
  return dist < radius * radius;
}
