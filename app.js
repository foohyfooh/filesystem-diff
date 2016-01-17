var walk = require('walk'),
	fs = require('fs'),
	_ = require('underscore'),
	options1,
	options2,
	walker1,
	walker2,
	args = process.argv.splice(2),//args[0] = dir1, args[1] = dir2
	structure1 = [],
	structure2 = [];


function clearFile(name){
	if(fs.existsSync(name)){
		fs.unlinkSync(name);
	}
}

function writeToFile(name, data){
	fs.appendFileSync(name, data+"\n");
}

function difference(a, b){
	return _.difference(_.union(a, b), _.intersection(a, b));
}

options1 = {
    // directories with these keys will be skipped
	filters: ["Temp", "_Temp", "node_modules"],
	listeners: {
      names: function (root, nodeNamesArray) {
        nodeNamesArray.sort(function (a, b) {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        });
      },
	  directories: function (root, dirStatsArray, next) {
        next();
      },
	  file: function (root, fileStats, next) {
		var key = root.slice(root.indexOf(args[0]) + args[0].length);
		if(key === ""){
			key = 'ROOT'
		}
		if(structure1[key]){
			structure1[key].push(fileStats.name);
		}else{
			structure1[key] = [fileStats.name];
		}
        next();
      },
	  errors: function (root, nodeStatsArray, next) {
        next();
      }
    } 
};
  
 options2 = {
    // directories with these keys will be skipped
	filters: ["Temp", "_Temp", "node_modules"],
	listeners: {
      names: function (root, nodeNamesArray) {
        nodeNamesArray.sort(function (a, b) {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        });
      },
	  directories: function (root, dirStatsArray, next) {
        next();
      },
	  file: function (root, fileStats, next) {
		var key = root.slice(root.indexOf(args[1]) + args[1].length);
		if(key === ""){
			key = 'ROOT'
		}
		if(structure2[key]){
			structure2[key].push(fileStats.name);
		}else{
			structure2[key] = [fileStats.name];
		}
        next();
      },
	  errors: function (root, nodeStatsArray, next) {
        next();
      }
    } 
};

walker1 = walk.walkSync(args[0], options1);
walker2 = walk.walkSync(args[1], options2);
  
clearFile('temp.txt');
for(var key in structure1){
	if(structure2[key]){
		var diff = difference(structure1[key], structure2[key]);
		if(diff.length > 0){
			writeToFile('temp.txt', key + " : " + diff.toString());
		}
	}
}
console.log("Done");