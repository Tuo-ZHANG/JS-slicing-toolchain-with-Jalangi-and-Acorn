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
    "node project_v2/scripts/slice.js --inFile ./milestone2.js --outFile predicated.js --lineNb 8";
    "node slice.js --inFile ../../milestone2.js --outFile predicated.js --lineNb 8";

    "node ../../../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis ../../analysis.js ../../milestone2.js";
    // console.log("entering slicing.js");
    // inputArgs =
    //   " --inlineIID --inlineSource --analysis ../../analysis.js " + inFile;
    // stmt = "node ../../../src/js/commands/jalangi.js" + inputArgs;

    // var exec = require("child_process").exec,
    //   child;

    // child = exec(stmt, function (error, stdout, stderr) {
    //   console.log("stdout: " + stdout);
    //   if (error !== null) {
    //     console.log("exec error: " + error);
    //     console.log("stderr: " + stderr);
    //   }
    // });

    // console.log("entering acorn");
    const acorn = require("acorn");
    const fs = require("fs");
    const escodegen = require("escodegen");
    const buffer = fs.readFileSync(inFile);
    var root = acorn.parse(buffer, { locations: true });
    var body = root.body;
    const path = "./output_" + inFile.split("/").slice(-1)[0];
    // console.log(path);
    const { output } = require(path);
    // console.log(output);
    output.push(parseInt(lineNb));
    for (let i = 0; i < output.length; i++) {
      if (typeof output[i] == "string") {
        output[i].split(" ");
        output[i] = output[i][output[i].length - 1];
      }
    }
    const linesToKeep = output;
    for (var k = body.length - 1; k >= 0; k--) {
      // console.log(body[k].type);
      if (body[k].type == "FunctionDeclaration") {
        var blockStatement = body[k].body.body;
        var length = blockStatement.length;
        for (var i = length - 1; i >= 0; i--) {
          const line = blockStatement[i].loc.start.line;
          if (!linesToKeep.includes(line)) {
            if (
              root.body[k].body.body[i].type == "VariableDeclaration" &&
              linesToKeep.includes(
                root.body[k].body.body[i].declarations[0].id.name
              )
            ) {
            } else {
              root.body[k].body.body.splice(i, 1);
            }
          }
        }
      } else if (body[k].type == "ExpressionStatement") {
        const line = body[k].expression.callee.loc.start.line;
        if (!linesToKeep.includes(line)) {
          // root.body.splice(k, 1);
        }
      }
    }
    // console.log(escodegen.generate(root));

    // fs.writeFile(outFile, escodegen.generate(root), (err) => {
    //   if (err) console.log(err);
    //   else {
    //     // console.log(process.cwd());
    //     console.log("File written successfully");
    //   }
    // });
    console.log(outFile);
    fs.writeFileSync(outFile, escodegen.generate(root));
  }

  slice(args.inFile, args.outFile, args.lineNb);
})();
