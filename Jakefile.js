desc('setup a client server for harp');
task('default', [], function (params) {
  console.log('setup a client server for harp');
  var cmd = 'harp server ./client --port 8888'
  jake.exec(cmd, {printStdout: true}, function () {
    complete();
  });
});
