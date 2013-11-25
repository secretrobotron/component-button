// could do regular JS tests:

// suite('button', function() {
//   setup(function() {
//     work = document.createElement('div');
//     document.body.appendChild(work);
//     // store results
//     work.innerHTML = window.__html__['component-button/test/fixtures/hello-app.html'];
//   });

//   teardown(function() {
//     wrap(document.body).removeChild(work);
//   });

//   var assert = chai.assert;
//   test('button test', function() {
//     assert.equal(1, 1);
//   });
// });

// or load an HTML test case:

htmlSuite('element registration', function() {
  htmlTest('test/html/buttonSpec.html');
});
