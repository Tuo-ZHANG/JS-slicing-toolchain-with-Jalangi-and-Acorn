const { SourceLocation } = require("acorn");
const { cpuUsage } = require("process");

(function () {
  const { ArgumentParser } = require("argparse");
  const parser = new ArgumentParser({
    description: "Slices the given file using the specified criteria",
  });
  parser.add_argument("--inFile", {
    help: "JavaScript file to be sliced",
    required: true,
  });
  parser.add_argument("--lineNb", {
    help: "Line number to be used as slicing criteria",
    required: true,
  });
  parser.add_argument("--outFile", {
    help: "Sliced and formated output file",
    required: true,
  });

  const args = parser.parse_args();

  function slice(inFile, outFile, lineNb) {
    /*
        TODO: Implement your method that slices the input based on the specified criteria
        */
    "node slice.js --inFile ../testcases/milestone2/milestone2.js --outFile predicted.js --lineNb 8";
    "node slice.js --inFile ../testcases/milestone3/milestone3.js --outFile predicted.js --lineNb 12";
    "node slice.js --inFile ../testcases/progress_meeting_3/e1_in.js --outFile predicted.js --lineNb 11";
    "node ../../../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis ../../../src/js/sample_analyses/ChainedAnalyses.js --analysis ../../../src/js/runtime/SMemory.js --analysis ../../analysis.js ../testcases/milestone2/e2_in.js";
    const fs = require("fs");

    const inputArgs =
      " --inlineIID --inlineSource --analysis ../../../src/js/sample_analyses/ChainedAnalyses.js --analysis ../../../src/js/runtime/SMemory.js --analysis ../../analysis.js " +
      inFile;
    const statement = "node ../../../src/js/commands/jalangi.js" + inputArgs;

    const { execSync } = require("child_process");

    var slicingCriterion = {};
    const fileName = inFile.split("/").slice(-1)[0];
    slicingCriterion[fileName] = parseInt(lineNb);
    const fileNameShorter = fileName.substring(0, fileName.length - 3);
    fs.writeFileSync(
      "./temporary_" + fileNameShorter + ".txt",
      JSON.stringify(slicingCriterion)
    );

    if (!fs.existsSync("./temporary_" + fileNameShorter + ".txt")) {
      console.log("unexpected error! Please consult the author!");
    }
    try {
      var result = execSync(statement).toString();
      // console.log(result);
    } catch (error) {
      console.log(error);
    }

    const acorn = require("acorn");
    const escodegen = require("escodegen");
    const buffer = fs.readFileSync(inFile);
    var root = acorn.parse(buffer, { locations: true });
    var body = root.body;
    const path = "./output_" + inFile.split("/").slice(-1)[0];
    var { output } = require(path);
    var conditionalToDelete = [];
    var variableRead = new Set();
    var hasIfStatement = false;
    output.push(parseInt(lineNb));
    output = [...new Set(output)].sort();
    for (let i = 0; i < output.length; i++) {
      if (typeof output[i] == "string") {
        output[i] = output[i].split(" ");
        output[i] = output[i][output[i].length - 1];
      }
    }
    const linesToKeep = output;
    console.log();
    console.log("current file: " + fileName);
    console.log("slcing critiria: " + lineNb);
    console.log("lines to keep: [" + linesToKeep + "]");

    for (var k = body.length - 1; k >= 0; k--) {
      // console.log(body[k].type);
      if (body[k].type == "FunctionDeclaration") {
        var blockStatement = body[k].body.body;
        var blockLength = blockStatement.length;

        // console.log(length);
        for (var i = blockLength - 1; i >= 0; i--) {
          nodeProcessing(blockStatement[i], blockStatement, i);
        }
        blockLength = blockStatement.length;
        // console.log(length);
        for (var i = blockLength - 1; i >= 0; i--) {
          nodeProcessing(blockStatement[i], blockStatement, i);
        }
        blockLength = blockStatement.length;
        // console.log(length);
      } else if (body[k].type == "ExpressionStatement") {
        const line = body[k].expression.callee.loc.start.line;
        if (!linesToKeep.includes(line)) {
          // root.body.splice(k, 1);
        }
      }
    }

    if (hasIfStatement) {
      // console.log("there is if statement in the source code");
      // providing static analysis at this step
      for (var i = blockLength - 1; i >= 0; i--) {
        variableReadDetection(blockStatement[i]);
      }
      variableRead = [...variableRead];
      // console.log("variable read: [" + variableRead + "]");
      for (var i = blockLength - 1; i >= 0; i--) {
        unusedVariablePruning(blockStatement[i], blockStatement, i);
      }
    }
    fs.writeFileSync(outFile, escodegen.generate(root));
    console.log("generated " + outFile);

    function nodeProcessing(currentNode, parentNode, index) {
      const currentLine = currentNode.loc.start.line;
      if (
        currentNode.type == "ReturnStatement" &&
        !linesToKeep.includes(currentLine)
      ) {
        parentNode.splice(index, 1);
        console.log("delete return statement at line " + currentLine);
      }
      if (
        currentNode.type == "VariableDeclaration" &&
        !linesToKeep.includes(currentNode.declarations[0].id.name)
      ) {
        parentNode.splice(index, 1);
        console.log(
          "delete variable declaration statement at line " + currentLine
        );
      }
      if (
        currentNode.type == "ExpressionStatement" &&
        !linesToKeep.includes(currentLine)
      ) {
        if (index == "consequent") {
          if (parentNode.alternate == null) {
            conditionalToDelete.push(parentNode.loc.start.line);
          }
        } else if (index == "alternate") {
          console.log("caught");
        } else {
          parentNode.splice(index, 1);
          console.log("delete expression statement at line " + currentLine);
        }
      }
      if (currentNode.type == "IfStatement") {
        hasIfStatement = true;
        if (conditionalToDelete.includes(currentLine)) {
          if (index == "alternate") {
            parentNode.alternate = null;
            console.log("delete else if statement in at line " + currentLine);
          } else {
            parentNode.splice(index, 1);
            console.log(
              "delete if statement in a block at line " + currentLine
            );
          }
        } else {
          if (currentNode.consequent != null) {
            nodeProcessing(currentNode.consequent, currentNode, "consequent");
            if (currentNode.alternate != null) {
              nodeProcessing(currentNode.alternate, currentNode, "alternate");
            }
          }
        }
      }
      if (currentNode.type == "BlockStatement") {
        for (var i = currentNode.body.length - 1; i >= 0; i--) {
          nodeProcessing(currentNode.body[i], currentNode.body, i);
        }
        if (parentNode?.type == "IfStatement") {
          if (parentNode.alternate?.body?.length == 0) {
            parentNode.alternate = null;
            console.log("delete else statement at line " + currentLine);
          }
          if (
            parentNode.alternate == null &&
            parentNode.consequent.body.length == 0 &&
            !linesToKeep.includes(currentLine)
          ) {
            conditionalToDelete.push(parentNode.loc.start.line);
          }
        }
      }
      if (currentNode.type == "ForStatement") {
        nodeProcessing(currentNode.body, null, null);
      }
    }

    function variableReadDetection(currentNode) {
      if (currentNode.type == "ExpressionStatement") {
        variableReadDetection(currentNode.expression);
      }
      if (currentNode.type == "AssignmentExpression") {
        if (currentNode.right.type == "Identifier") {
          variableRead.add(currentNode.right.name);
        }
      }
      if (currentNode.type == "BlockStatement") {
        for (var i = currentNode.body.length - 1; i >= 0; i--) {
          variableReadDetection(currentNode.body[i]);
        }
      }
      if (currentNode.type == "IfStatement") {
        if (currentNode.alternate) {
          variableReadDetection(currentNode.alternate);
        }
        variableReadDetection(currentNode.consequent);
        variableReadDetection(currentNode.test);
      }
      if (currentNode.type == "ForStatement") {
        variableReadDetection(currentNode.test);
        variableReadDetection(currentNode.body);
      }
      if (currentNode.type == "BinaryExpression") {
        variableReadDetection(currentNode.left);
        variableReadDetection(currentNode.right);
      }
      if (currentNode.type == "Identifier") {
        variableRead.add(currentNode.name);
      }
      if (currentNode.type == "CallExpression") {
        variableRead.add(currentNode.callee.object.name);
      }
      if (currentNode.type == "MemberExpression") {
        variableReadDetection(currentNode.property);
      }
      if (currentNode.type == "ReturnStatement") {
        variableReadDetection(currentNode.argument);
      }
    }

    function unusedVariablePruning(currentNode, parentNode, index) {
      const currentLine = currentNode.loc.start.line;
      if (currentNode.type == "VariableDeclaration") {
        if (
          !variableRead.includes(currentNode.declarations[0].id.name) &&
          // !linesToKeep.includes(currentLine)
          currentLine != parseInt(lineNb)
        ) {
          parentNode.splice(index, 1);
          console.log(
            "delete unused variable declaration at line " +
              currentNode.loc.start.line
          );
        }
      }
      if (currentNode.type == "ExpressionStatement") {
        unusedVariablePruning(currentNode.expression, parentNode, index);
      }
      if (currentNode.type == "AssignmentExpression") {
        if (
          !variableRead.includes(currentNode.left.name) &&
          currentLine != parseInt(lineNb)
        ) {
          parentNode.splice(index, 1);
          console.log(
            "delete unused variable assignment at line " +
              currentNode.loc.start.line
          );
        }
        if (
          !variableRead.includes(currentNode.left.name) &&
          currentLine == parseInt(lineNb)
        ) {
          variableRead.push(currentNode.left.name);
        }
      }
      if (currentNode.type == "BlockStatement") {
        for (var i = currentNode.body.length - 1; i >= 0; i--) {
          unusedVariablePruning(currentNode.body[i], currentNode.body, i);
        }
      }
      if (currentNode.type == "IfStatement") {
        if (currentNode.alternate) {
          unusedVariablePruning(currentNode.alternate, null, null);
        }
        unusedVariablePruning(currentNode.consequent, null, null);
      }
      if (currentNode.type == "ForStatement") {
        unusedVariablePruning(currentNode.body, null, null);
      }
    }
  }

  slice(args.inFile, args.outFile, args.lineNb);
})();
