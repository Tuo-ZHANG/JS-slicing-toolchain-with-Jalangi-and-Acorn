# How to run

I follow the official documentation from Jalangi and have created a directory called experiments, which should be under the jalangi2-master directory. All the files we need for the slicing demo is inside the experiments directory.\
Suppose now you are in the experiments directory, use the command below to enter the scripts directory(we suppose you are always in the scripts directory when running the commands provided in this report) and then see how our demo performs for different testcases:

```
cd project_v3/scripts
node testRunner.js --source milestone2_testCases.json
node testRunner.js --source milestone3_testCases.json
node testRunner.js --source pm_3_testcases.json
```

# Approach

## Milestone 1

### 1.1

To perform a dynamic analysis when a variable is written, we need to provide the write callback to the J$.analysis variable in the analysis.js file.\
run the command line below to see the result:

```
// the current directory is the scripts directory
node ../../../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis ../../1.1/analysis.js ../../1.1/1.1.js
```

### 1.2

To manipulate the AST, we need the acorn library. Through the whole project, I use the splice() method for array to prune the undesired node in the AST. Note that we should loop over the array of nodes in reverse order for the splice method to work./
run the command line below to see the result:

```
// the current directory is the scripts directory
node ../../1.2/slice.js ../../1.1/1.1.js ../../1.1/1.1.js
```

## Milestone 2

We implemente the slicing functionality in the slice.js. In this file, I use child_process to call Jalangi to generate an output file which tracks the lines we need to keep, then the slice.js read the output file and do the actual slicing.\
The exact steps are the following:

1. we need to implement various callbacks in the analysis.js file so every instruction in the codes that is of interest to us could be detected. When an instruction is detected, we should record the line number, the variable of the instruction, and the corresponding write or read. For each instruction, we create an array of length 3. The output of this step should be a parent array with each of its child array corresponds to an instruction.
1. find the lastest write of a variable that is read, this read instruction should depend on the lastest write of this variable. This is doable because in the parent array obtained in step 1, an instruction that is executed later is also added later. In contrast, for a write operation, we could simply assume that every variable that is written depends on the declaration of it. The output for this step should be dependency map, with the key being the line number and the value being the dependency of this line.
1. with the dependency map and the slicing criteria, we could obtain the lines we need to keep.
1. get the lines we need to keep from the previous step and do the slicing.

If we print out the result we get from the child_process which calls Jalangi, we could get something like below:

```
[
  [ 10, 'sliceMe', 'read' ],
  [ 4, 'x', 'written' ],
  [ 5, 'y', 'written' ],
  [ 6, 'x', 'read' ],
  [ 6, 'y', 'read' ],
  [ 6, 'x', 'written' ],
  [ 7, 'y', 'read' ],
  [ 7, 'y', 'written' ],
  [ 8, 'y', 'read' ]
]
{
  '4': 'declaration of x',
  '5': 'declaration of y',
  '6': [ 'declaration of x', 4, 'declaration of y', 5 ],
  '7': [ 'declaration of y', 5 ],
  '8': [ 'declaration of y', 7 ]
}
[ '"declaration of y"', 5, 7 ]
```

The code below would run the slice.js on the testcase from milestone2, for debugging purpose, my implementation of the slice.js would also print out the exact actions that program takes. As is hinted by the content printed on the terminal, the pruned code is stored in the predicted.js file.
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

```
// the current directory is the scripts directory
node slice.js --inFile ../testcases/milestone2/milestone2.js --outFile predicted.js --lineNb 8

current file: milestone2.js
slcing critiria: 8
lines to keep: [5,7,8,y]
delete expression statement at line 6
delete expression statement at line 4
delete variable declaration statement at line 2
generated predicted.js
```

## Milestone 3

With Milestone 3, there is an extra layer of complexity as we need to make sure that our analysis algorithm would track every statement which involves conditional that is executed, these statements will include if statement, while statement and for statement. Our anlysis.js program would record all these instructions and would add them to the linesToKeep array. Notice that the slice.js file will then decide if such conditional statement should be kept.\
Thus, our slicing algorithm should traverse the whole AST tree and make prunings by considering both what the current node is and what we have in the linesToKeep.
This is the most the difficult part of the project as we need to write a function which can traverse the AST tree and deal with every type of node.
Below is a snippet of what I have written for this purpose:

```
// see slice.js file for the whole function
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
```

Our algorithm needs to make sure that all the non-conditional statements that are not in our linesToKeep should be deleted. And if a conditional statement has empty block after the previous step of pruning, such conditional statement should be deleted too. We also need to delete the unused variable declaration after the previous two steps.
The code below would run the slice.js on the testcase from milestone3:

```
// the current directory is the scripts directory
node slice.js --inFile ../testcases/milestone3/milestone3.js --outFile predicted.js --lineNb 12

```

# Results

Our implementation could achieve exact match for all the testcases, this include both the testcases from the original project and the testcases added in the progress meeting.

# Possible improvements

Though I believe my implementation would cover most variations from the testcases we already have, We may have not considered all the edge cases.\
For example, the case e2 from milestone2(this one is added in the progress meeting) is a very tricky one, and to deal with this case, we need to use shadow memory library provided by Jalangi. \
To add support for this case, I also record all the shadow objects that are read and written, and if the slicing criteria is a shadow object, then the linesToKeep would be the dependency of this shadow object.\
My implementation would deal with e2, but I also tend to think that if there is other complications like this, we need to further modify the program.

# Conclusion

Overall, we have taken an incremental approach for this project and I believed we have achieved solid performance with painstaking debugging and considerable efforts.
