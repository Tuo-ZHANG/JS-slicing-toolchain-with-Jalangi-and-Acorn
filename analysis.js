(function () {
  var info = [];
  var fileName;
  J$.analysis = {
    /**
     * This callback is triggered at the beginning of a scope for every local variable declared in the scope, for
     * every formal parameter, for every function defined using a function statement, for <tt>arguments</tt>
     * variable, and for the formal parameter passed in a catch statement.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {string} name - Name of the variable that is declared
     * @param {*} val - Initial value of the variable that is declared.  Variables can be local variables, function
     * parameters, catch parameters, <tt>arguments</tt>, or functions defined using function statements.  Variables
     * declared with <tt>var</tt> have <tt>undefined</tt> as initial values and cannot be changed by returning a
     * different value from this callback.  On the beginning of an execution of a function, a <tt>declare</tt>
     * callback is called on the <tt>arguments</tt> variable.
     * @param {boolean} isArgument - True if the variable is <tt>arguments</tt> or a formal parameter.
     * @param {number} argumentIndex - Index of the argument in the function call.  Indices start from 0.  If the
     * variable is not a formal parameter, then <tt>argumentIndex</tt> is -1.
     * @param {boolean} isCatchParam - True if the variable is a parameter of a catch statement.
     * @returns {{result: *} | undefined} - If the function returns an object, then the original initial value is
     * replaced with the value stored in the <tt>result</tt> property of the object.  This does not apply to local
     * variables declared with <tt>var</tt>.
     *
     */
    declare: function (
      iid,
      name,
      val,
      isArgument,
      argumentIndex,
      isCatchParam
    ) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      return { result: val };
    },

    /**
     * This callback is called after a variable is read.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {string} name - Name of the variable being read
     * @param {*} val - Value read from the variable
     * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
     * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
     * @returns {{result: *} | undefined} - If an object is returned, the result of the read operation is
     * replaced with the value stored in the <tt>result</tt> property of the object.
     */
    read: function (iid, name, val, isGlobal, isScriptLocal) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      if (fileName == undefined) {
        fileName = location.split("\\").slice(-1)[0].split(":")[0];
        // fileName = "../../" + fileName;
        fileName = "../testcases/milestone2/" + fileName;
        console.log(fileName);
      }
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);

      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      info.push([parseInt(line), name, "read"]);
      return { result: val };
    },

    /**
     * This callback is called before a variable is written.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {string} name - Name of the variable being read
     * @param {*} val - Value to be written to the variable
     * @param {*} lhs - Value stored in the variable before the write operation
     * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
     * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
     * @returns {{result: *} | undefined} - If an object is returned, the result of the write operation is
     * replaced with the value stored in the <tt>result</tt> property of the object.
     */
    write: function (iid, name, val, lhs, isGlobal, isScriptLocal) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      info.push([parseInt(line), name, "written"]);
      return { result: val };
    },

    /**
     * This callback is called after a property of an object is accessed.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {*} base - Base object
     * @param {string|*} offset - Property
     * @param {*} val - Value of <code>base[offset]</code>
     * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
     * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
     * if the get field operation is <tt>o.p</tt>
     * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
     * @param {boolean} isMethodCall - True if the get field operation is part of a method call (e.g. <tt>o.p()</tt>)
     * @returns {{result: *} | undefined} - If an object is returned, the value of the get field operation  is
     * replaced with the value stored in the <tt>result</tt> property of the object.
     */
    getField: function (
      iid,
      base,
      offset,
      val,
      isComputed,
      isOpAssign,
      isMethodCall
    ) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      console.log("a field is raed at " + location);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      console.log(line);
      console.log(offset);
      info.push([parseInt(line), offset, "read"]);
      return { result: val };
    },

    /**
     * This callback is called after a property of an object is written.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {*} base - Base object
     * @param {*} offset - Property
     * @param {*} val - Value to be stored in <code>base[offset]</code>
     * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
     * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
     * if the get field operation is <tt>o.p</tt>
     * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
     * @returns {{result: *} | undefined} -   If an object is returned, the result of the put field operation is
     * replaced with the value stored in the <tt>result</tt> property of the object.
     */
    putField: function (iid, base, offset, val, isComputed, isOpAssign) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      console.log("a field is written at " + location);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      console.log(line);
      console.log(offset);
      info.push([parseInt(line), offset, "written"]);
      return { result: val };
    },

    /**
     * This callback is called when an execution terminates in node.js.  In a browser
     * environment, the callback is called if ChainedAnalyses.js or ChainedAnalysesNoCheck.js
     * is used and Alt-Shift-T is pressed.
     *
     * @returns {undefined} - Any return value is ignored
     */
    endExecution: function () {
      var dependency = {};
      console.log(info);
      for (var i = 0; i < info.length; i++) {
        if (info[i][1] != "sliceMe") {
          // console.log(
          //   "At location " + info[i][0] + " " + info[i][1] + " is " + info[i][2]
          // );
          if (info[i][2] == "written" && dependency[info[i][0]] == undefined) {
            let key = parseInt(info[i][0]);
            dependency[key] = "declaration of " + info[i][1];
          }
          if (info[i][2] == "read") {
            for (var j = i - 1; j >= 0; j--) {
              if (info[j][2] == "written" && info[j][1] == info[i][1]) {
                let key = parseInt(info[i][0]);
                if (dependency[key] == undefined) {
                  dependency[key] = info[j][0];
                } else {
                  if (typeof dependency[key] != "object") {
                    dependency[key] = [dependency[key], info[j][0]];
                  } else {
                    dependency[key] = [...dependency[key], info[j][0]];
                  }
                }
                break;
              }
            }
          }
        }
      }
      // console.log(dependency);
      var lineNb;
      // const inputs = read_criteria_file("../../testcase.json");
      const inputs = read_criteria_file("./milestone2_testCases.json");
      // console.log(inputs);
      // console.log(fileName);

      for (const object of inputs) {
        if (object.inFile == fileName) {
          lineNb = object.lineNb;
        }
      }
      // console.log(lineNb);
      // var lineNb = 8;
      var dependencyNew = [];
      // console.log(dependency);
      agenda = [lineNb];
      while (agenda.length != 0) {
        var node = agenda.pop();
        if (dependency[node] != undefined) {
          if (typeof dependency[node] != "object") {
            agenda.push(dependency[node]);
            dependencyNew.push(dependency[node]);
          } else {
            agenda.push(...dependency[node]);
            dependencyNew.push(...dependency[node]);
          }
        }
      }
      for (var index in dependencyNew) {
        if (typeof dependencyNew[index] == "string") {
          dependencyNew[index] = '"' + dependencyNew[index] + '"';
        }
      }
      dependencyNew = [...new Set(dependencyNew)];
      console.log("var output = [");
      console.log(dependencyNew);
      console.log("module.exports = {output};");
      fileName = fileName.split("/").slice(-1)[0];
      // console.log(fileName);
      var outFile = "output_" + fileName;
      fs.writeFileSync(outFile, "var output = [");
      fs.appendFileSync(outFile, dependencyNew.toString() + "]");
      fs.appendFileSync(outFile, "\nmodule.exports = {output};");
    },
  };
})();

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function read_criteria_file(sourceFile) {
  var data = JSON.parse(readFile(sourceFile));
  return data;
}

const fs = require("fs");
function readFile(fileName) {
  return fs.readFileSync(fileName, "utf8");
}
