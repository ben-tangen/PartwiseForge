# PC Tutor Design Doc

**Author: Ben Tangen**

## Product Direction
- Partwise Forge started as a PC parts and listings application, but this new side of the project focuses on teaching users how to build PCs.
- The tutor is meant to complement the existing inventory and compatibility tools by turning that knowledge into guided instruction.

## What is the problem you are solving?
- Many people would like to build their own personal computer but have no idea where to start. There are many intricacies to building computers and understanding different parts that take years to learn in the wild. Simple things such as how and where to screw in a motherboard or difficult things such as which GPUs pair well with CPUs create a complex system that can be taught. Creating a tutor for computer building will help solve this problem and make PC building more accessible to everyone.

## What will your prototype seek to teach?
- My prototype will seek to teach two main pieces of knowledge.

- First, I want my prototype to teach about picking out different PC parts. This will strictly be conceptual as the physical building of the PC will not be taught during this stage. Many knowledge components will be taught during this stage such as CPU sockets, RAM compatibility and speed, storage types, power supply requirements, case size, and types of coolers.

- Second, the tutor will teach how to put the actual parts together. While the tutor may not be able to help completely while the user is actually building their computer, it can still help them procedurally.

## How will your prototype support the learner?
- To support the learner, there will first be a learning portion about computer parts and compatibility. Each knowledge component will have a visual reference and material to read in a digestible way. Then it will immediately ask a question about those things. If the learner gets it right, they will move on, but if they do not, a hint and some additional reading may be given.

- During the build stage of learning, hints will be given if the learner does something wrong or in the wrong order. There will also be a hint button in case the learner needs help remembering where a part needs to go.

## What AI techniques will your system leverage?
- I plan on incorporating either a graph algorithm to keep track of correct or wrong answers or, if that proves unnecessary, simplifying it by using if statements.
- I will also use an LLM model to help the autograder determine whether an answer is correct. It will have strict guidance and prompts so that the correct answers are supplied by me, the creator of the tutor. I am aiming for accuracy and reduced hallucinations.

## How this fits the application
- The original side of the website focuses on PC parts, listings, and inventory management.
- The tutor side turns that same domain knowledge into a learning experience for users who want to understand how to build PCs from the ground up.
