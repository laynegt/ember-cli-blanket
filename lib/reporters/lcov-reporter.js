var Reporter = require('../reporter');
var optionUtils = require('../blanket-options');

var lcovRecord = function(data) {
  var str = '',
      lineHandled = 0,
      lineFound = 0,
      fileName = data.fileName;

  if (this.options.cliOptions && this.options.cliOptions.lcovOptions && this.options.cliOptions.lcovOptions.renamer){
    fileName = this.options.cliOptions.lcovOptions.renamer(fileName);
  }

  // exclude add-on files by checking for their existence in the file system
  if (!optionUtils.exists(fileName)){
    return null;
  }

  str += 'SF:' + fileName + '\n';
  data.lines.forEach(function(value, num) {
    if (value !== null) {
      str += 'DA:' + num + ',' + value + '\n';
      lineFound += 1;
      if (value > 0) {
        lineHandled += 1;
      }
    }
  });

  str += 'LF:' + lineFound + '\n';
  str += 'LH:' + lineHandled + '\n';
  str += 'end_of_record';
  return str;
};
/**
 * LCOVReporter outputs lcov formatted coverage data
 * from the test run
 *
 * @class  LCOVReporter
 * @param {Object} options hash of options interpreted by reporter
 */
module.exports = Reporter.extend({
  name: 'lcov',
  defaultOutput: 'lcov.dat',
  transform: function(coverageData) {
    // filter out empty results (see comment above re:add-on files)
    var data = coverageData.fileData.map(lcovRecord, this).filter(function(item){ return !!item; });
    return data.join('\n');
  }
});
