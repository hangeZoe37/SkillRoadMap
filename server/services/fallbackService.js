// Fallback service for when AI services are unavailable
export function getFallbackQuestions(topic) {
  const fallbackQuestions = {
    "javascript": [
      {
        id: 1,
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        correct: 0,
        difficulty: "Easy",
        explanation: "The 'var' keyword is used to declare variables in JavaScript."
      },
      {
        id: 2,
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correct: 0,
        difficulty: "Easy",
        explanation: "The push() method adds one or more elements to the end of an array."
      },
      {
        id: 3,
        question: "What does the 'this' keyword refer to in JavaScript?",
        options: ["The current function", "The current object", "The global object", "The parent object"],
        correct: 1,
        difficulty: "Medium",
        explanation: "The 'this' keyword refers to the object that is currently executing the function."
      },
      {
        id: 4,
        question: "Which operator is used for strict equality comparison?",
        options: ["==", "===", "!=", "!=="],
        correct: 1,
        difficulty: "Medium",
        explanation: "The === operator performs strict equality comparison without type coercion."
      },
      {
        id: 5,
        question: "What is a closure in JavaScript?",
        options: ["A function that returns another function", "A function that has access to variables in its outer scope", "A function that takes no parameters", "A function that always returns the same value"],
        correct: 1,
        difficulty: "Hard",
        explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns."
      },
      {
        id: 6,
        question: "Which method is used to create a new array from an existing array?",
        options: ["slice()", "splice()", "split()", "join()"],
        correct: 0,
        difficulty: "Easy",
        explanation: "The slice() method returns a shallow copy of a portion of an array into a new array."
      },
      {
        id: 7,
        question: "What is the purpose of the 'use strict' directive?",
        options: ["To enable strict mode", "To disable strict mode", "To import strict functions", "To export strict variables"],
        correct: 0,
        difficulty: "Medium",
        explanation: "The 'use strict' directive enables strict mode, which helps catch common coding mistakes."
      },
      {
        id: 8,
        question: "Which method is used to handle asynchronous operations in modern JavaScript?",
        options: ["callback", "promise", "async/await", "All of the above"],
        correct: 3,
        difficulty: "Hard",
        explanation: "All three methods (callbacks, promises, and async/await) are used to handle asynchronous operations."
      },
      {
        id: 9,
        question: "What is the difference between 'let' and 'var'?",
        options: ["No difference", "let has block scope, var has function scope", "var has block scope, let has function scope", "let is faster than var"],
        correct: 1,
        difficulty: "Medium",
        explanation: "let has block scope while var has function scope, and let is not hoisted."
      },
      {
        id: 10,
        question: "Which method is used to iterate over array elements?",
        options: ["for loop", "forEach()", "map()", "All of the above"],
        correct: 3,
        difficulty: "Easy",
        explanation: "All three methods can be used to iterate over array elements, each with different use cases."
      }
    ],
    "react": [
      {
        id: 1,
        question: "What is React?",
        options: ["A database", "A JavaScript library for building user interfaces", "A server-side framework", "A programming language"],
        correct: 1,
        difficulty: "Easy",
        explanation: "React is a JavaScript library for building user interfaces, particularly web applications."
      },
      {
        id: 2,
        question: "What is JSX?",
        options: ["A JavaScript extension", "A syntax extension for JavaScript", "A new programming language", "A CSS framework"],
        correct: 1,
        difficulty: "Easy",
        explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript."
      },
      {
        id: 3,
        question: "What is a component in React?",
        options: ["A function or class that returns JSX", "A database table", "A CSS file", "A JavaScript variable"],
        correct: 0,
        difficulty: "Medium",
        explanation: "A React component is a function or class that returns JSX and can be reused throughout the application."
      },
      {
        id: 4,
        question: "What is the purpose of useState hook?",
        options: ["To manage state in functional components", "To create new components", "To handle events", "To fetch data"],
        correct: 0,
        difficulty: "Medium",
        explanation: "useState is a React hook that allows you to add state to functional components."
      },
      {
        id: 5,
        question: "What is the virtual DOM?",
        options: ["A real DOM element", "A JavaScript representation of the DOM", "A CSS framework", "A database"],
        correct: 1,
        difficulty: "Hard",
        explanation: "The virtual DOM is a JavaScript representation of the real DOM that React uses for efficient updates."
      },
      {
        id: 6,
        question: "Which method is called when a component is first rendered?",
        options: ["componentDidMount", "componentWillMount", "useEffect", "All of the above"],
        correct: 3,
        difficulty: "Medium",
        explanation: "All three methods can be used to handle component mounting, depending on the component type."
      },
      {
        id: 7,
        question: "What is props in React?",
        options: ["A CSS property", "Data passed from parent to child components", "A JavaScript function", "A database query"],
        correct: 1,
        difficulty: "Easy",
        explanation: "Props are data passed from parent components to child components in React."
      },
      {
        id: 8,
        question: "What is the purpose of useEffect hook?",
        options: ["To manage state", "To handle side effects", "To create components", "To handle events"],
        correct: 1,
        difficulty: "Hard",
        explanation: "useEffect is used to handle side effects in functional components, such as data fetching or subscriptions."
      },
      {
        id: 9,
        question: "What is the difference between controlled and uncontrolled components?",
        options: ["No difference", "Controlled components have their state managed by React", "Uncontrolled components are faster", "Controlled components are always better"],
        correct: 1,
        difficulty: "Hard",
        explanation: "Controlled components have their state managed by React, while uncontrolled components manage their own state."
      },
      {
        id: 10,
        question: "What is the purpose of keys in React lists?",
        options: ["To style elements", "To help React identify which items have changed", "To add event handlers", "To create animations"],
        correct: 1,
        difficulty: "Medium",
        explanation: "Keys help React identify which items have changed, been added, or removed in lists."
      }
    ]
  };

  // Return questions for the topic, or default to JavaScript if topic not found
  return fallbackQuestions[topic.toLowerCase()] || fallbackQuestions["javascript"];
}
