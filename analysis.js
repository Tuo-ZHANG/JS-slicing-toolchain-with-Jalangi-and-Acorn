(function () {
  var info = [];
  var fileName;
  var variableToObjectMap = [];
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
      }
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);

      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      // console.log(name);

      info.push([parseInt(line), name, "read"]);
      // var shadowObj = J$.smemory.getShadowFrame(name);
      // console.log(
      //   "READ " +
      //     J$.smemory.getIDFromShadowObjectOrFrame(shadowObj) +
      //     "." +
      //     name +
      //     " at " +
      //     J$.iidToLocation(J$.sid, iid)
      // );

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

      if (info.slice(-2)[0][1].substring(0, 6) == "Object") {
        if (variableToObjectMap[info.slice(-2)[1][1]] === undefined) {
          variableToObjectMap[info.slice(-2)[1][1]] = info.slice(-2)[0][1];
        }
      }

      // console.log(name);
      // var shadowObj = J$.smemory.getShadowFrame(name);
      // console.log(
      //   "WRITE " +
      //     J$.smemory.getIDFromShadowObjectOrFrame(shadowObj) +
      //     "." +
      //     name +
      //     " at " +
      //     J$.iidToLocation(J$.sid, iid)
      // );
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
      // console.log("a field is raed at " + location);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      // console.log(line);
      const fieldName =
        offset.toString().charAt(0).toUpperCase() +
        offset.toString().substring(1);
      info.push([parseInt(line), "field" + fieldName, "read"]);
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
      // console.log("a field is written at " + location);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      // console.log(line);
      // console.log(offset);
      const fieldName =
        offset.toString().charAt(0).toUpperCase() +
        offset.toString().substring(1);
      info.push([parseInt(line), "field" + fieldName, "written"]);
      return { result: val };
    },
    /**
     * This callback is called after a condition check before branching. Branching can happen in various statements
     * including if-then-else, switch-case, while, for, ||, &&, ?:.
     *
     * @param {number} iid - Static unique instruction identifier of this callback
     * @param {*} result - The value of the conditional expression
     * @returns {{result: *}|undefined} - If an object is returned, the result of the conditional expression is
     * replaced with the value stored in the <tt>result</tt> property of the object.
     */
    conditional: function (iid, result) {
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      // console.log("a conditional at " + location);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);
      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      // console.log(line);
      info.push([parseInt(line), "boolean", "conditional"]);
      // if (counter == 0) {
      //   result = !result;
      // }
      return { result: result };
    },

    endExecution: function () {
      const fileNameShorter = fileName.substring(0, fileName.length - 3);
      if (fs.existsSync("./temporary_" + fileNameShorter + ".txt")) {
        const dict = JSON.parse(
          fs.readFileSync("./temporary_" + fileNameShorter + ".txt").toString()
        );
        var lineNb = dict[fileName];
      } else {
        console.log("unexpected error! Please consult the author!");
      }

      var replacement = false;
      // console.log(variableToObjectMap);
      for (var i = 0; i < info.length; i++) {
        if (info[i][0] === lineNb) {
          var variableToReplace = info[i][1];
          if (variableToObjectMap[info[i][1]]) {
            replacement = true;
          }
        }
      }
      if (replacement) {
        for (var i = 0; i < info.length; i++) {
          if (info[i][1] === variableToReplace) {
            info[i][1] = variableToObjectMap[variableToReplace];
          }
        }
      } else {
        for (var i = info.length - 1; i >= 0; i--) {
          if (
            info[i][1].substring(0, 6) &&
            info[i][1].substring(0, 6) === "Object"
          ) {
            info.splice(i, 1);
          }
        }
      }
      var dependency = {};
      console.log(info);
      for (var i = 0; i < info.length; i++) {
        if (info[i][1] != "sliceMe") {
          if (info[i][2] == "written" || info[i][2] == "read") {
            let key = parseInt(info[i][0]);
            if (dependency[key] == undefined) {
              dependency[key] = "declaration of " + info[i][1];
            } else {
              if (typeof dependency[key] != "object") {
                if (dependency[key] != "declaration of " + info[i][1]) {
                  dependency[key] = [
                    dependency[key],
                    "declaration of " + info[i][1],
                  ];
                }
              } else {
                if (!dependency[key].includes("declaration of " + info[i][1])) {
                  dependency[key] = [
                    ...dependency[key],
                    "declaration of " + info[i][1],
                  ];
                }
              }
            }
          }
          if (info[i][2] == "read") {
            for (var j = i - 1; j >= 0; j--) {
              if (info[j][2] == "written" && info[j][1] == info[i][1]) {
                let key = parseInt(info[i][0]);
                if (dependency[key] == undefined) {
                  dependency[key] = info[j][0];
                } else {
                  if (typeof dependency[key] != "object") {
                    if (dependency[key] != info[j][0]) {
                      dependency[key] = [dependency[key], info[j][0]];
                    }
                  } else {
                    if (!dependency[key].includes(info[j][0])) {
                      dependency[key] = [...dependency[key], info[j][0]];
                    }
                  }
                }
                break;
              }
            }
          }
        }
      }
      // deal with the case in which the dependency of a line includes the line itself
      for (var index in dependency) {
        if (
          typeof dependency[index] == "object" &&
          dependency[index].includes(parseInt(index))
        ) {
          for (var i = dependency[index].length - 1; i >= 0; i--) {
            if (dependency[index][i] == index) {
              dependency[index].splice(i, 1);
              if (dependency[index].length == 1) {
                dependency[index] = dependency[index][0];
              }
            }
          }
        }
        if (
          typeof dependency[index] != "object" &&
          dependency[index] == parseInt(index)
        ) {
          dependency[index] = null;
        }
      }

      console.log(dependency);

      var dependencyNew = [];
      agenda = new Set();
      agenda.add(lineNb);
      for (i = 0; i < info.length; i++) {
        if (info[i][2] == "conditional") {
          agenda.add(info[i][0]);
        }
      }
      agenda = [...agenda];
      // removing dependencies after slicing critiria line
      for (var i = agenda.length - 1; i >= 0; i--) {
        if (agenda[i] > lineNb) {
          agenda.pop();
        } else {
          break;
        }
      }
      // console.log(agenda);
      while (agenda.length != 0) {
        var node = agenda.pop();
        if (dependency[node] != undefined) {
          if (typeof dependency[node] != "object") {
            agenda.push(dependency[node]);
            agenda = [...new Set(agenda)];
            dependencyNew.push(dependency[node]);
            dependencyNew = [...new Set(dependencyNew)];
          } else {
            agenda.push(...dependency[node]);
            agenda = [...new Set(agenda)];
            dependencyNew.push(...dependency[node]);
            dependencyNew = [...new Set(dependencyNew)];
          }
        }
      }

      for (var i = dependency.length - 1; i >= 0; i--) {
        if (dependency[i] == null) {
          dependency.splice(i, 1);
        }
      }

      for (var index in dependencyNew) {
        if (typeof dependencyNew[index] == "string") {
          dependencyNew[index] = '"' + dependencyNew[index] + '"';
        }
      }
      dependencyNew = [...new Set(dependencyNew)];
      for (var i = 0; i < dependencyNew.length; i++) {
        if (
          typeof dependencyNew[i] == "string" &&
          variableToObjectMap[variableToReplace] + '"' ===
            dependencyNew[i].split(" ").slice(-1)[0]
        ) {
          dependencyNew[i] = '"declaration of ' + variableToReplace + '"';
        }
      }

      var linesToAdd = [];
      for (var i = 0; i < info.length; i++) {
        if (
          variableToObjectMap[variableToReplace] === info[i][1] &&
          info[i][2] === "written" &&
          !dependencyNew.includes(info[i][0])
        ) {
          console.log(info[i][1]);
          linesToAdd.push(info[i][0]);
        }
      }
      // console.log(linesToAdd);
      dependencyNew = dependencyNew.concat(linesToAdd);
      dependencyNew.sort();

      // console.log("var output = [");
      console.log(dependencyNew);
      // console.log("module.exports = {output};");
      var outFile = "output_" + fileName;
      fs.writeFileSync(outFile, "var output = [");
      fs.appendFileSync(outFile, dependencyNew.toString() + "]");
      fs.appendFileSync(outFile, "\nmodule.exports = {output};");
    },

    literal: function (iid, val, hasGetterSetter) {
      if (typeof val === "object") {
        var id = J$.getGlobalIID(iid);
        var location = J$.iidToLocation(id);
        let index1 = getPosition(location, ":", 2);
        let index2 = getPosition(location, ":", 3);
        var line = location.charAt(index1 + 1);

        while (index1 + 2 < index2) {
          line = line + location.charAt(index1 + 2);
          index1++;
        }
        info.push([parseInt(line), "Object" + getValue(val), "written"]);
      }
    },

    getFieldPre: function (
      iid,
      base,
      offset,
      isComputed,
      isOpAssign,
      isMethodCall
    ) {
      //access shadow memory
      var shadowObj = J$.smemory.getShadowObject(base, offset, true);
      // console.log(
      //   "GET_FIELD " +
      //     J$.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner) +
      //     "." +
      //     offset +
      //     " at " +
      //     J$.iidToLocation(J$.sid, iid)
      // );
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);

      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      info.push([
        parseInt(line),
        "Object" + J$.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner),
        "read",
      ]);
    },

    putFieldPre: function (iid, base, offset, val, isComputed, isOpAssign) {
      //access shadow memory
      var shadowObj = J$.smemory.getShadowObject(base, offset, false);
      // console.log(
      //   "PUT_FIELD " +
      //     J$.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner) +
      //     "." +
      //     offset +
      //     " at " +
      //     J$.iidToLocation(J$.sid, iid)
      // );
      var id = J$.getGlobalIID(iid);
      var location = J$.iidToLocation(id);
      let index1 = getPosition(location, ":", 2);
      let index2 = getPosition(location, ":", 3);
      var line = location.charAt(index1 + 1);

      while (index1 + 2 < index2) {
        line = line + location.charAt(index1 + 2);
        index1++;
      }
      info.push([
        parseInt(line),
        "Object" + J$.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner),
        "written",
      ]);
    },
  };
})();

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function getValue(v) {
  var type = typeof v;
  if ((type === "object" || type === "function") && v !== null) {
    var shadowObj = J$.smemory.getShadowObjectOfObject(v);
    return J$.smemory.getIDFromShadowObjectOrFrame(shadowObj);
  } else {
    return v;
  }
}

const fs = require("fs");
