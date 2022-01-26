(function () {
  var info = [];
  J$.analysis = {
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
      info.push(location);
      console.log(val);
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
      for (var location of info) {
        console.log(
          "At location " + location + " a variable is being written to"
        );
      }
    },
  };
})();
