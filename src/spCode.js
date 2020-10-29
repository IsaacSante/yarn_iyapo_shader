export function spCode() {
    let green = input(.5);
    let red = input(.2);
    color(red, 1, green);
    displace(mouse.x, mouse.y, 0)
    sphere(.4);
  }