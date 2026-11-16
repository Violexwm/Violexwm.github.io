class Spark {
  float x, y;
  float xspeed, yspeed;
  float hue;
  float life = 100;

  Spark(float startX, float startY, float baseHue) {
    x = startX;
    y = startY;
    hue = (baseHue + random(-25, 25) + 360) % 360;

    float angle = random(TWO_PI);
    float speed = random(1, 6);
    xspeed = cos(angle) * speed;
    yspeed = sin(angle) * speed;
  }

  void update() {
    x = x + xspeed;
    y = y + yspeed;

    xspeed = xspeed * 0.97;  
    yspeed = yspeed * 0.97;
    yspeed = yspeed + 0.06;  

    life = life - 1.5;       
  }

  boolean dead() {
    return life <= 0;
  }

  void show() {
    stroke(hue, 80, 100, life);
    strokeWeight(3);
    point(x, y);
  }
}
