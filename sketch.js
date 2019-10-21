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

const NEUROSKY_ON = false;

function set_parametres() {
  rules = [{ in: axiom, out: r_input.value() }];
  number_of_gens = constrain(g_slider.value(), 1, 8);
  if (NEUROSKY_ON) e_slider.value(100 + neurosky.attention * 2);
  extension = constrain(e_slider.value(), 100, 500);
  extension_chaos = constrain(ec_slider.value(), 0, 1);
  if (NEUROSKY_ON) a_slider.value(Math.round(5 + neurosky.meditation / 6.7));
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
  resetCustom();
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
  generate();

  resetMatrix();
  clear();
  currentIndex = 0;
  for (let p = 0; p < 10; p++) {
    pop();
  }
  loop();
}

function saveDrawing() {
  let data = canvas
    .toDataURL("image/png")
    .replace(/^data:image\/png;base64,/, "");
  let http = new XMLHttpRequest();
  let url = "/save/" + email.value();
  http.open("POST", url, true);
  http.send(data);
  //save(email.value() + ".png");
}

function setup_controllers() {
  var generate_button = createButton("Start").parent("controller");

  var r_container = createDiv("&rho; ").parent("settings");
  var g_container = createDiv("&gamma; (1-8)").parent("settings");
  var e_container = createDiv("&eta; (100-500)").parent("settings");
  var ec_container = createDiv("&Delta;<sub>&eta;</sub> (0-1)").parent(
    "settings"
  );
  var a_container = createDiv("&phi; (5-20)").parent("settings");
  var ac_container = createDiv("&Delta;<sub>&phi;</sub> (0-1)").parent(
    "settings"
  );
  var speed_container = createDiv("Speed").parent("settings");

  r_input = createInput(r1, "text").parent(r_container);
  g_slider = createInput(5, "number").parent(g_container);
  e_slider = createInput(250, "number").parent(e_container);
  ec_slider = createInput(0.4, "number").parent(ec_container);
  a_slider = createInput(10, "number").parent(a_container);
  ac_slider = createInput(0.5, "number").parent(ac_container);
  speed_slider = createInput(10, "number").parent(speed_container);

  generate_button.mousePressed(resetAll);

  set_parametres();
}

function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight - 100);
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

function randint(start, end) {
  return start + Math.floor(Math.random() * (end - start + 1));
}

function clip(x, lower, upper) {
  return Math.min(upper, Math.max(lower, x));
}

function popAll() {
  stroke_color = color_stack.pop();
  recursion_depth -= 1;
  pop();
  strokeWeight(draw_width / pow(recursion_depth, 1.5));
  stroke(...stroke_color);
}

function pushAll() {
  push();
  color_stack.push(stroke_color);
  recursion_depth += 1;
}

function mutateColor() {
  let c_i = randint(0, 2);
  stroke_color[c_i] += randint(0, 1) ? c_step : -c_step;
  stroke_color = stroke_color.map((c, i) =>
    clip(c, ...[red_range, green_range, blue_range][i])
  );
  stroke(...stroke_color);
}

let recursion_depth;
let draw_width;
let stroke_color;
let red_range, green_range, blue_range;
let color_stack;
let c_step;
function resetCustom() {
  recursion_depth = 2;
  draw_width = 10;
  stroke_color = [139, 69, 19];
  red_range = [15, 170];
  green_range = [100, 220];
  blue_range = [15, 130];
  color_stack = [stroke_color];
  c_step = 3;
}

function draw() {
  updateValues();
  var current_extension = extension * pow(0.5, gen);
  translate(width / 2, height);

  for (var i = 0; i < speed; i++) {
    if (currentIndex < sentence.length) {
      popAll();

      let x = sentence.charAt(currentIndex);
      let ext =
        current_extension * (1 + random(-extension_chaos, extension_chaos));
      let ang = angle * (1 + random(-angle_chaos, angle_chaos));

      if (x == "F") {
        mutateColor();
        line(0, 0, 0, -ext);
        translate(0, -ext);
      } else if (x == "+") {
        rotate(-ang);
      } else if (x == "-") {
        rotate(ang);
      } else if (x == "[") {
        pushAll();
      } else if (x == "]") {
        popAll();
      }
      pushAll();
    } else {
      noLoop();
    }

    currentIndex++;
  }
}
