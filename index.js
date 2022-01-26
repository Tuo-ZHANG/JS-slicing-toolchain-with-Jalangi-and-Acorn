const acorn = require("acorn");
const fs = require("fs");
const escodegen = require("escodegen");
const Immutable = require("immutable");
const { List } = require("immutable");
const { SourceLocation } = require("acorn");

// pull in the cmd line args
const args = process.argv[2];
const buffer = fs.readFileSync(args).toString();
var root = acorn.parse(buffer, { locations: true });
var body = root.body;
console.log(body);
var killSet = [];

var entry = [];
var exit = [];
const slicingCriterion = 8;
var expressionName;
var functionName;
for (var k = body.length - 1; k >= 0; k--) {
  //   console.log(body[k]);
  if (body[k].type == "FunctionDeclaration") {
    if (
      slicingCriterion > body[k].loc.start.line &&
      slicingCriterion <= body[k].loc.end.line
    ) {
      for (var i = 0; i < body[k].body.body.length; i++) {
        if (body[k].body.body[i].expression?.type == "AssignmentExpression") {
          // console.log(body[k].body.body[i]);
          killSet.push([
            body[k].body.body[i].expression.left.name,
            body[k].body.body[i].loc.start.line,
          ]);
        }
      }

      for (var i = 0; i < body[k].body.body.length; i++) {
        if (body[k].body.body[i].expression?.type == "AssignmentExpression") {
          entry = exit;
          var genSet = [];
          genSet.push([
            body[k].body.body[i].expression.left.name,
            body[k].body.body[i].loc.start.line,
          ]);
          if (entry.length != 0) {
            for (var j = entry.length - 1; j >= 0; j--) {
              if (Immutable.fromJS(killSet).includes(List(entry[j]))) {
                if (body[k].body.body[i].expression.left.name == entry[j][0])
                  entry.splice(k, 1);
              }
            }
          }
          for (var j = 0; j < genSet.length; j++) {
            if (!Immutable.fromJS(entry).includes(List(genSet[j]))) {
              entry.push(genSet[j]);
            }
          }
          exit = entry;
        }
      }
      const variable =
        body[k].body.body[body[k].body.body.length - 1].argument.name;
      for (var j = exit.length - 1; j >= 0; j--) {
        if (exit[j][0] != variable) {
          exit.splice(j, 1);
        }
      }

      for (var i = body[k].body.body.length - 1; i >= 0; i--) {
        if (body[k].body.body[i].loc.start.line != exit[0][1]) {
          root.body[k].body.body.splice(i, 1);
        }
      }
    } else if (slicingCriterion == body[k].loc.start.line) {
      functionName = body[k].id.name;
    }
  } else if (body[k].type == "ExpressionStatement") {
    if (body[k].expression.type == "CallExpression") {
      //   console.log(body[k].expression.loc.start.line);
      //   console.log(body[k].expression.callee.name);
      if (body[k].expression.loc.start.line == slicingCriterion) {
        expressionName = body[k].expression.callee.name;
      }
    }
  }
}

if (expressionName) {
  for (var k = body.length - 1; k >= 0; k--) {
    if (body[k].expression?.callee?.name == expressionName) {
    } else if (body[k].id?.name == expressionName) {
    } else {
      root.body.splice(k, 1);
    }
  }
}

if (functionName) {
  for (var k = body.length - 1; k >= 0; k--) {
    if (body[k].id?.name == functionName) {
    } else {
      root.body.splice(k, 1);
    }
  }
}

console.log(escodegen.generate(root));
