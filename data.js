const CHAPTERS_DATA = [
    { title: "Introduction to Computers, Programs, and Java™", pages: 32, problems: 13 },
    { title: "Elementary Programming", pages: 44, problems: 23 },
    { title: "Selections", pages: 44, problems: 34 },
    { title: "Mathematical Functions, Characters, and Strings", pages: 38, problems: 26 },
    { title: "Loops", pages: 46, problems: 51 },
    { title: "Methods", pages: 43, problems: 39 },
    { title: "Single-Dimensional Arrays", pages: 41, problems: 37 },
    { title: "Multidimensional Arrays", pages: 34, problems: 37 },
    { title: "Objects and Classes", pages: 44, problems: 13 },
    { title: "Object-Oriented Thinking", pages: 44, problems: 28 },
    { title: "Inheritance and Polymorphism", pages: 42, problems: 19 },
    { title: "Exception Handling and Text I/O", pages: 46, problems: 22 },
    { title: "Abstract Classes and Interfaces", pages: 42, problems: 21 },
    { title: "JavaFX Basics", pages: 52, problems: 29 },
    { title: "Event-Driven Programming and Animations", pages: 50, problems: 36 },
    { title: "JavaFX UI Controls and Multimedia", pages: 48, problems: 31 },
    { title: "Binary I/O", pages: 28, problems: 21 },
    { title: "Recursion", pages: 32, problems: 38 },
    { title: "Generics", pages: 24, problems: 11 },
    { title: "Lists, Stacks, Queues, and Priority Queues", pages: 40, problems: 23 },
    { title: "Sets and Maps", pages: 24, problems: 15 },
    { title: "Developing Efficient Algorithms", pages: 48, problems: 27 },
    { title: "Sorting", pages: 36, problems: 19 },
    { title: "Implementing Lists, Stacks, Queues, and Priority Queues", pages: 36, problems: 16 },
    { title: "Binary Search Trees", pages: 36, problems: 19 },
    { title: "AVL Trees", pages: 20, problems: 7 },
    { title: "Hashing", pages: 30, problems: 15 },
    { title: "Graphs and Applications", pages: 46, problems: 26 },
    { title: "Weighted Graphs and Applications", pages: 38, problems: 20 },
    { title: "Aggregate Operations for Collection Streams", pages: 31, problems: 19 }
];

const TOTAL_PAGES = CHAPTERS_DATA.reduce((sum, chapter) => sum + chapter.pages, 0);
const TOTAL_PROBLEMS = CHAPTERS_DATA.reduce((sum, chapter) => sum + chapter.problems, 0);
const AVERAGE_READING_SPEED = 7.5; // minutes per page
const AVERAGE_PROBLEM_TIME = 20; // minutes per problem
const MCQ_QUIZ_TIME = 30; // minutes per chapter MCQ quiz