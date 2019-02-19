const assert = require('assert');
const t = require('../index');

describe('GPUUsage', function () {
  let app = new t.GPUUsage();

  it('#getGPUUsage', function () {
    app.getGPUUsage().then(percent => {
      console.log("GPU Usage is: " + percent);
      assert.ok(percent);
    })
  });


  it('#generateColor', function () {
    const testLight = function (percent) {
      const points = app.generateColor(percent);
      return points[0].color;
    }

    const assertLight = function (percent, expected) {
      const actual = testLight(percent);
      const message = `For GPU usage ${percent}, I have a ${actual} light `
        + `(expected ${expected})`;  
      assert(expected === actual, message);
    }

    assertLight(19, '#00FF00');
    assertLight(39, '#33FF00');
    assertLight(59, '#FFFF00');
    assertLight(60, '#FF6600');
    assertLight(79, '#FF6600');
    assertLight(90, '#FF0000');
    assertLight(100, '#FF0000');


  });

  it('#run()', function () {
    app.run().then((signal) => {
      console.log(JSON.stringify(signal));
      assert.ok(signal);
    }).catch(error => {
      assert.fail(error);
    });
  });
})