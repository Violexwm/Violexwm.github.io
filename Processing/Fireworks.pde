ArrayList<Rocket> rockets = new ArrayList<Rocket>();
ArrayList<Spark> sparks = new ArrayList<Spark>();

void setup() {
  size(640, 360);
  pixelDensity(2);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

void mousePressed() {
  rockets.add(new Rocket(mouseX, mouseY));
}

void draw() {
  noStroke();
  fill(0, 0, 0, 25);
  rectMode(CORNER);
  rect(0, 0, width, height);

  if (random(1) < 0.015) {
    rockets.add(new Rocket(random(50, width - 50), random(40, height * 0.5)));
  }

  // Rockets
  for (int i = rockets.size() - 1; i >= 0; i--) {
    Rocket r = rockets.get(i);
    r.update();
    r.show();
    if (r.exploded()) {
      r.explode(sparks);
      rockets.remove(i);
    }
  }

  // Sparks
  for (int i = sparks.size() - 1; i >= 0; i--) {
    Spark s = sparks.get(i);
    s.update();
    s.show();
    if (s.dead()) {
      sparks.remove(i);
    }
  }
}
