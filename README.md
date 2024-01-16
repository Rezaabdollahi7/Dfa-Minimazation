# DFA Optimization with JavaScript 🚀

Optimize your Deterministic Finite Automata (DFA) effortlessly with this JavaScript project designed for the Theory of Languages course. The optimization process involves alphabet identification, removal of unused and redundant states, grouping and sorting states, and ensuring the correct order of transitions.

## Project Overview 📚

### 1. Identifying Useful States 🎯
The `findUsefulStates` function traverses the DFA to identify and mark useful states starting from the initial state.

### 2. Removing Unused States 🧹
The `removeUnusedStates` function eliminates states that are not marked as useful, ensuring a more compact and efficient DFA.

### 3. Grouping States 🤝
The `groupStates` function categorizes states into two groups (`T0` and `T1`) based on their final or non-final status.

### 4. Printing Transitions 🔄
The `printTransitions` function displays transitions between states, providing a clear understanding of the optimized DFA.

### 5. Checking Similar Transitions ✅
The `checkSimilarTransitions` function evaluates if transitions within a group are similar, aiding in further optimization.

### 6. Checking All Groups 🌐
The `checkAllGroups` function assesses the similarity of transitions in all groups and logs the results.

### 7. Finding Problematic Element 🚧
The `findProblematicElement` function identifies the state causing dissimilar transitions in a problematic group.

### 8. Removing Problematic State from Group ❌
The `removeProblematicStateFromGroup` function resolves dissimilarity by removing the problematic state from its group.

### 9. Creating a New Group for Problematic State 🆕
The `createNewGroupForProblematicState` function generates a new group for the problematic state to maintain optimization.

### 10. Editing Groups 🛠️
The `editGroups` function iteratively checks and edits groups until all transitions are similar.

### 11. Creating DFA from Grouping 🔄
The `createDfaFromGrouping` function generates a new DFA by combining states from grouped transitions.


Example Usage 💻
```bash
// Define your DFA
let dfa = {
    // ... DFA transitions ...
};

// Identify and optimize useful states
let usefulStates = findUsefulStates(dfa, initialState);
let dfaWithoutUnusedStates = removeUnusedStates(dfa, usefulStates);
let groupedStates = groupStates(dfaWithoutUnusedStates);

// Print optimized DFA transitions
printTransitions(dfaWithoutUnusedStates, groupedStates);

// Edit groups for further optimization
editGroups();

// Generate the final DFA from grouping
const newDfaFromGrouping = createDfaFromGrouping(groupedStates, dfaWithoutUnusedStates);
console.log("\n" + "Combined DFA:");
console.log(newDfaFromGrouping);
