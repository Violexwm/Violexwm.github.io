class Rocket {
  float x, y;
  float xspeed, yspeed;
  float gravity = 0.1;
  float hue;

  Rocket(float targetX, float targetY) {
    x = targetX;
    y = height;
    xspeed = 0;

    yspeed = -sqrt(2 * gravity * max(height - targetY, 20));
    hue = random(360);
  }

  void update() {
    x = x + xspeed;
    y = y + yspeed;
    yspeed = yspeed + gravity;
  }

  boolean exploded() {
    return yspeed >= 0;
  }

  void explode(ArrayList<Spark> list) {
    for (int i = 0; i < 150; i++) {
      list.add(new Spark(x, y, hue));
    }
  }

  void show() {
    stroke(0, 0, 100);
    strokeWeight(3);
    point(x, y);
  }
}
