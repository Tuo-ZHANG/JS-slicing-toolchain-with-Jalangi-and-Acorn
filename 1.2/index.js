const acorn = require("acorn");
const fs = require("fs");
const escodegen = require("escodegen");

// pull in the cmd line args
const args = process.argv[2];
console.log(args);
const buffer = fs.readFileSync(args).toString();
var root = acorn.parse(buffer, { locations: true });
var body = root.body;
// console.log(body);

const linesToKeep = [1, 2, 5, 6, 9, 10];
for (var k = body.length - 1; k >= 0; k--) {
  // console.log(body[k].type);
  if (body[k].type == "FunctionDeclaration") {
    var blockStatement = body[k].body.body;
    var length = blockStatement.length;
    for (var i = length - 1; i >= 0; i--) {
      const line = blockStatement[i].loc.start.line;
      if (!linesToKeep.includes(line)) {
        root.body[k].body.body.splice(i, 1);
      }
    }
  } else if (body[k].type == "ExpressionStatement") {
    const line = body[k].expression.callee.loc.start.line;
    if (!linesToKeep.includes(line)) {
      root.body.splice(k, 1);
    }
  }
}

// console.log(escodegen.generate(root));
