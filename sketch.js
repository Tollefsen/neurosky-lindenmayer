let axiom = "F";
let sentence = axiom;
let gen = 0;

let rules = [];
let number_of_gens;
let extension, extension_chaos;
let angle, angle_chaos;
let speed;

var email;
var r_input;
var g_slider;
var e_slider, ec_slider;
var a_slider, ac_slider;
var speed_slider;

let currentIndex = 0;

let r1 = "FF[+F][--FF][-F+F]";
let r2 = "F[++F[-F]]F[-FF[F]]";
let r3 = "F[-FF[+F]]F[+F[+F]]";
let r4 = "F[-F[-F++F]][+F[--F]]F";

function set_parametres() {
  rules = [{ in: axiom, out: r_input.value() }];
  number_of_gens = constrain(g_slider.value(), 1, 6);
  extension = constrain(e_slider.value(), 100, 500);
  extension_chaos = constrain(ec_slider.value(), 0, 1);
  angle = PI / constrain(a_slider.value(), 5, 20);
  angle_chaos = constrain(ac_slider.value(), 0, 1);
  speed = speed_slider.value();
}

function reset() {
  set_parametres();
  sentence = axiom;
  gen = 0;
}

function generate() {
  reset();
  while (gen < number_of_gens) {
    let new_sentence = "";
    for (var i = 0; i < sentence.length; i++) {
      let x = sentence.charAt(i);
      let found = false;
      for (var j = 0; j < rules.length; j++) {
        if (x == rules[j].in) {
          new_sentence += rules[j].out;
          found = true;
          break;
        }
      }
      if (!found) {
        new_sentence += x;
      }
    }
    sentence = new_sentence;
    gen++;
  }
}

function resetAll() {
  resetMatrix();
  clear();
  currentIndex = 0;
  for (let p = 0; p < 10; p++) {
    pop();
  }
  loop();
}

function saveDrawing() {
  save(email.value() + ".png");
}

function setup_controllers() {
  var generate_button = createButton("generate").parent("controller");
  var save_button = createButton("save").parent("controller");

  var mail_container = createDiv("email").parent("controller");
  var r_container = createDiv("&rho; ").parent("controller");
  var g_container = createDiv("&gamma; (1-6)").parent("controller");
  var e_container = createDiv("&eta; (100-500)").parent("controller");
  var ec_container = createDiv("&Delta;<sub>&eta;</sub> (0-1)").parent(
    "controller"
  );
  var a_container = createDiv("&phi; (5-20)").parent("controller");
  var ac_container = createDiv("&Delta;<sub>&phi;</sub> (0-1)").parent(
    "controller"
  );
  var speed_container = createDiv("Speed").parent("controller");

  email = createInput("youremail", "text").parent(mail_container);
  r_input = createInput(r1, "text").parent(r_container);
  g_slider = createInput(5, "number").parent(g_container);
  e_slider = createInput(200, "number").parent(e_container);
  ec_slider = createInput(0.4, "number").parent(ec_container);
  a_slider = createInput(10, "number").parent(a_container);
  ac_slider = createInput(0.5, "number").parent(ac_container);
  speed_slider = createInput(10, "number").parent(speed_container);

  generate_button.mousePressed(resetAll);
  save_button.mousePressed(saveDrawing);

  set_parametres();
}

function setup() {
  var canvas = createCanvas(700, 700);
  canvas.parent("sketch");
  frameRate(60);
  setup_controllers();
  generate();
  background(216, 226, 232);
  stroke(0, 40);
  resetMatrix();
}

function updateValues() {
  set_parametres();
}

function draw() {
  updateValues();
  var current_extension = extension * pow(0.5, gen);
  translate(width / 2, height);

  stroke(0, 40);

  for (var i = 0; i < speed; i++) {
    if (currentIndex < sentence.length) {
      pop();

      let x = sentence.charAt(currentIndex);
      let ext =
        current_extension * (1 + random(-extension_chaos, extension_chaos));

      let ang = angle * (1 + random(-angle_chaos, angle_chaos));
      if (x == "F") {
        line(0, 0, 0, -ext);
        translate(0, -ext);
      } else if (x == "+") {
        rotate(-ang);
      } else if (x == "-") {
        rotate(ang);
      } else if (x == "[") {
        push();
      } else if (x == "]") {
        pop();
      }
      push();
    } else {
      noLoop();
    }
    currentIndex++;
  }
}
