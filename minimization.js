function findUsefulStates(dfa, initialState) {
    let usefulStates = { [initialState]: true };
    let queue = [initialState];
    while (queue.length > 0) {
        let currentState = queue.shift();
        for (let letter in dfa[currentState]) {
            let nextState = dfa[currentState][letter];
            if (!usefulStates[nextState]) {
                usefulStates[nextState] = true;
                queue.push(nextState);
            }
        }
    }
    return usefulStates;
}

function removeUnusedStates(dfa, usefulStates) {
    for (let state in dfa) {
        if (!usefulStates[state]) {
            delete dfa[state];
            for (let otherState in dfa) {
                for (let letter in dfa[otherState]) {
                    if (dfa[otherState][letter] === state) {
                        delete dfa[otherState][letter];
                    }
                }
            }
        }
    }
    return dfa;
}

function groupStates(dfa) {
    let T0 = [];
    let T1 = [];

    for (let state in dfaWithoutUnusedStates) {
        if (finalStates.includes(state)) {
            T1.push(state);
        } else if (notFinalStates.includes(state)) {
            T0.push(state);
        }
    }
    return { T0, T1 };
}

function printTransitions(dfa, groupedStates) {
    const alphabet = new Set();

    for (let state in dfa) {
        for (let letter in dfa[state]) {
            alphabet.add(letter);
        }
    }

    for (let group in groupedStates) {
        console.log(` Group ${group}:`);
        console.log("");

        for (let state of groupedStates[group]) {
            console.log(`Transitions from State ${state}:`);

            for (let letter of alphabet) {
                let nextState = dfa[state][letter];
                let destinationGroup = findDestinationGroup(nextState, groupedStates);
                console.log(`  ${state} -- ${letter} --> ${nextState} (${destinationGroup})`);
            }
            console.log("");
        }
        console.log("-------------------------------------");
    }
}

function findDestinationGroup(state, groupedStates) {
    for (let group in groupedStates) {
        if (groupedStates[group].includes(state)) {
            return group;
        }
    }
}

function checkSimilarTransitions(group, dfa, groupedStates) {

    const alphabet = new Set();

    // find alphabets
    for (let state of groupedStates[group]) {
        for (let letter in dfa[state]) {
            alphabet.add(letter);
        }
    }

    let first_State_Of_Group_transitions = [];
    let isFirstState = true;
    let isSimilar = true;


    for (let state of groupedStates[group]) {
        let other_State_Of_Group_transitions = [];
        // console.log(state);

        for (let letter of alphabet) {
            // console.log(letter);
            let nextState = dfa[state][letter];
            // console.log(nextState);
            let destinationGroup = findDestinationGroup(nextState, groupedStates);
            // console.log(destinationGroup);
            // console.log(`  ${state} -- ${letter} --> ${nextState} (${destinationGroup})`);
            if (isFirstState) {
                first_State_Of_Group_transitions.push(destinationGroup);
            } else {
                other_State_Of_Group_transitions.push(destinationGroup);
            }
            // console.log("");
        }
        if (!isFirstState) {
            console.log(` state ${state} Gropus : ${other_State_Of_Group_transitions}  `);
        } else {
            console.log(` state ${state} Gropus : ${first_State_Of_Group_transitions}  `);
        }


        if (!isFirstState) {

            if (first_State_Of_Group_transitions.length !== other_State_Of_Group_transitions.length) {
                isSimilar = false;
            }

            for (let i = 0; i < first_State_Of_Group_transitions.length; i++) {
                if (first_State_Of_Group_transitions[i] !== other_State_Of_Group_transitions[i]) {
                    isSimilar = false;
                }
            }
        }

        isFirstState = false;

    }

    if (isSimilar) {
        return true;
    } else {
        return false;
    }

}

function checkAllGroups(dfa, groupedStates) {
    let groupsPov = []

    for (let group in groupedStates) {
        let thisGroupPov = checkSimilarTransitions(group, dfa, groupedStates);
        groupsPov.push(thisGroupPov)
        if (thisGroupPov) {
            console.log(` states of group ${group} are similar :))` + " \n");
        } else {
            console.log(` states of group ${group} are not similar !! ` + " \n");
        }
    }

    console.log(`The correct order of transition in groups :   ${groupsPov} ` + "\n");

    return groupsPov;
}

function findProblematicElement(group, dfa) {
    const alphabet = new Set();

    for (let state of groupedStates[group]) {
        for (let letter in dfa[state]) {
            alphabet.add(letter);
        }
    }

    const transitions = {};
    for (let state of groupedStates[group]) {
        let stateGroups = []
        for (let letter of alphabet) {
            let nextState = dfa[state][letter];
            let destinationGroup = findDestinationGroup(nextState, groupedStates);
            stateGroups.push(destinationGroup)
        }
        transitions[state] = stateGroups;
    }
    console.log(`all groups  `);
    console.log(transitions);


    for (const key in transitions) {
        if (transitions.hasOwnProperty(key)) {
            const values = transitions[key];
            let isDifferent = false;
            for (const innerKey in transitions) {
                if (transitions.hasOwnProperty(innerKey) && innerKey !== key) {
                    const innerValues = transitions[innerKey];
                    if (JSON.stringify(values) === JSON.stringify(innerValues)) {
                        isDifferent = false;
                        break;
                    } else {
                        isDifferent = true;
                    }
                }
            }
            if (isDifferent) {
                console.log(key);
                return key;
            }
        }
    }


}

function removeProblematicStateFromGroup(problemedGroup, problematicState, groupedStates, dfa) {
    if (groupedStates.hasOwnProperty(problemedGroup)) {
        console.log(`${problematicState} is deleted from ${problemedGroup} group` + "\n");
        groupedStates[problemedGroup] = groupedStates[problemedGroup].filter(state => state !== problematicState);
    }
}

function createNewGroupForProblematicState(problemedGroup, problematicState, dfa, groupedStates) {
    const newGroup = `T${Object.keys(groupedStates).length}`;

    groupedStates[newGroup] = [problematicState];

    const transitions = {};
    for (let letter in dfa[problematicState]) {
        const nextState = dfa[problematicState][letter];
        const destinationGroup = findDestinationGroup(nextState, groupedStates);
        transitions[letter] = destinationGroup;
    }

    console.log(` ${newGroup} is created  (for State ${problematicState}):`);

    return newGroup;
}

function editGroups() {
    let res = checkAllGroups(dfaWithoutUnusedStates, groupedStates);

    const firstFalseIndex1 = res.indexOf(false);

    if (firstFalseIndex1 != -1) {
        console.log(" first wrong group  :", firstFalseIndex1, "=>>", "T" + firstFalseIndex1 + " , Have Problem" + "\n");
    }

    let problemedGroup = "T" + firstFalseIndex1;

    if (res.every(value => value === true)) {
        console.log(`every transitions  are in all groups are similar Final groups :`);
        console.log(groupedStates);
    }
    else {
        let problematicElement = findProblematicElement(problemedGroup, dfaWithoutUnusedStates);
        console.log(`diffrent state in  ${problemedGroup} : ${problematicElement}`);
        let newGroup = createNewGroupForProblematicState(problemedGroup, problematicElement, dfaWithoutUnusedStates, groupedStates);
        removeProblematicStateFromGroup(problemedGroup, problematicElement, groupedStates, dfaWithoutUnusedStates);

        console.log(` new Groups : `);
        console.log(groupedStates);
        console.log("------------------------------------------------------------");
        printTransitions(dfaWithoutUnusedStates, groupedStates)
        editGroups()
    }
}

function createDfaFromGrouping(groupedStates, dfaWithoutUnusedStates) {
    const newDfa = {};

    for (let group in groupedStates) {
        const combinedState = groupedStates[group].join(',');
        newDfa[combinedState] = {};

        for (let state of groupedStates[group]) {
            for (let letter in dfaWithoutUnusedStates[state]) {
                const nextState = dfaWithoutUnusedStates[state][letter];
                const destinationGroup = findDestinationGroup(nextState, groupedStates);
                const combinedNextState = groupedStates[destinationGroup].join(',');
                newDfa[combinedState][letter] = combinedNextState;
            }
        }
    }

    return newDfa;
}
// dfa in pae 152
// let dfa = {
//     "A": { 0: 'B', 1: 'D' },
//     "B": { 0: 'B', 1: 'C' },
//     "*C": { 0: 'D', 1: 'E' },
//     "D": { 0: 'D', 1: 'E' },
//     "*E": { 0: 'B', 1: 'C' },
//     //unuse state
//     "F": { 0: 'B', 1: 'C' },
// };

// dfa in page 158
let dfa = {
    "1": { a: '2', b: '1' },
    "*2": { a: '3', b: '4' },
    "*3": { a: '3', b: '4' },
    "*4": { a: '3', b: '4' },
}

// dfa in page 163
// let dfa = {
//     "*0": { a: '1', b: '5' },
//     "1": { a: '6', b: '4' },
//     "2": { a: '1', b: '3' },
//     "*3": { a: '7', b: '6' },
//     "*4": { a: '0', b: '5' },
//     "5": { a: '6', b: '4' },
//     "6": { a: '5', b: '5' },
//     "*7": { a: '6', b: '3' },
// }


let finalStates = [];
let notFinalStates = [];

// find final and not final states
for (let state in dfa) {
    const newState = state.startsWith('*') ? state.substring(1) : state;

    if (state.startsWith('*')) {
        finalStates.push(newState);
    } else {
        notFinalStates.push(newState);
    }
}

console.log("finalStates =", finalStates);
console.log("notFinalStates =", notFinalStates);

// delete * from states
for (let state in dfa) {
    if (state.startsWith('*')) {
        const newState = state.substring(1);
        dfa[newState] = dfa[state];
        delete dfa[state];
    }
}
let initialState = Object.keys(dfa)[0].toString();
console.log("first State : " + initialState);
console.log("Original Dfa: ", dfa);


let usefulStates = findUsefulStates(dfa, initialState);
let dfaWithoutUnusedStates = removeUnusedStates(dfa, usefulStates);
let groupedStates = groupStates(dfaWithoutUnusedStates);
console.log("Useful States: ", usefulStates);
console.log("------------------------------------------------------------");
console.log("DFA without Unused States: ", dfaWithoutUnusedStates);
console.log("------------------------------------------------------------");
console.log("Early grouping : ", groupedStates);
console.log("------------------------------------------------------------");
printTransitions(dfaWithoutUnusedStates, groupedStates);
editGroups();

const newDfaFromGrouping = createDfaFromGrouping(groupedStates, dfaWithoutUnusedStates);
console.log("\n" + "combining DFA :");
console.log(newDfaFromGrouping);
