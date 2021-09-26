const readlineSync = require('readline-sync');
const chalk = require('chalk');
var Table = require('cli-table');

//constants 
const ENUMS = {
  WELCOME_TEXT: "Hi, Rahul here. Welcome to the quiz.\nI'm gonna ask you simple questions about me just to check how well you know me\n(I won't judge you SACHHI!).\nBut first I need to know who's playing the quiz.",
  GET_USERNAME: "What is your good name? ",
  GET_USERNAME_IN_CORRECT_FORMAT:"Please enter your name in correct format: ", 
  EMPTY_USERNAME: "Opps empty string not allowed. Please enter anything but empty string.",
  CORRECT_ANSWER: ["Waah! Kya baat hai.","Sahi Jawaab","Bilkul sahi uttar diya hai aapne.","Ye bhi sahi jawaab hea aapka","That's the right answer.","You are on FIREEE","CORRECT-CORRECT-CORRECT"],
  WRONG_ANSWER: ["Galat Jawaab","Opps! that's wrong.","Better luck next time","Ye Galat uttar hea"],
  SCORE: "Your Current Score is ",
  WELCOME: "Welcome",
  PASS_TEXT: "I'm not sure, I'll just SKIP this question.",
  DEVIDER_TEXT: "---------------------------------",
  PASS_TEXT_2: "You skipped this question",
  FINAL_SCORE : "Your final score is : ",
  USER_SELECTION: "You Selected:",
  INFORM_CORRECT_ANSWER: "The Correct answer is: ",
  NEW_HIGH_SCORE: "Congratulations, You have made a new highscore",
  BETTER_LUCK: "Better luck next time",
  LEADERBOARD: "Leaderboard",
  THANKS_USER: "Thanks for playing. Have a good day."
}

const lerderboards = [{
  userName: "Neha",
  score: 5
},
{
  userName: "Jaya",
  score: 4,
},
{
  userName:"Abhi",
  score: 3
}
]
const questionsArray = [
{
  question: "What is my favourite programming language?",
  answer: "JavaScript",
  options: ['JavaScript', 'Java', 'C++', 'Python']
},
{
  question: "Do I love Dogs?",
  answer: "Yes, You love Dogs",
  options: ['Yes, You love Dogs', 'Nope. You don\'t like Dogs ', 'Maybe', 'You only love food.',]
},
{
  question: "What's my hometown",
  answer: "Himachal Pradesh",
  options: ['Himachal Pradesh', 'Rajasthan', 'Gujrat', 'Punjab']
},
{
  question: "What is my favourite physical activity?",
  answer: "You are into Running",
  options: ['You do Cricket', 'Nothing! You just sleep all day.', 'You Walk.', 'You are into Running',]
},
{
  question: "Am I into crypto?",
  answer: "Your are all in.",
  options: ['No you don\'t believe in Crypto', 'Your are all in.', 'Currently you are in Research mode.']
},
{
  question: "What is my favourite TV Show?",
  answer: "Old TMKOC",
  options: ['Old TMKOC',"Stranger Things","Money Heist","Breaking Bad"]
}
]

const CHALK_STYLES = {
  CORRECT_ANSWER : (string) => chalk.whiteBright.bgGreen.bold(string),
  WRONG_ANSWER : (string) => chalk.whiteBright.bgRed.bold(string),
  DEVIDER: (string) => chalk.cyan.bold(string),
  SCORE: (string) => chalk.whiteBright.bold(string),
  PASS: (string) => chalk.whiteBright.bgBlackBright.bold(string),
  FINAL_SCORE: (string) => chalk.whiteBright.bgYellow.bold(string),
  USER_ANSWER: (string) => chalk.whiteBright.bold.underline(string),
  INFORM_CORRECT_ANSWER: (string) => chalk.whiteBright.bgYellow.bold.underline.italic(string),
  UNDERLINE: (string) => chalk.bold.underline(string)
}
let score = 0;

//helper functions
const getHighScore  = () => {
  const highScore = Math.max(...lerderboards.map(user => user.score),0)
  return highScore
}

let highScore = getHighScore()

const log = (string) => console.log(string);

const questionUser = (questionString) => readlineSync.question(questionString)

const checkUserName = (userName) => {
 if (userName) {
   console.log(`\n${ENUMS.WELCOME} ${CHALK_STYLES.UNDERLINE(userName)}.`)
   return userName;
 } else {
   console.log(ENUMS.EMPTY_USERNAME)
   return checkUserName(questionUser(ENUMS.GET_USERNAME_IN_CORRECT_FORMAT))
 }
}

const getUserName = () => {
  const userInput = questionUser(ENUMS.GET_USERNAME);
  const userName = checkUserName(userInput)
  return userName
}

const randomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength)

const updateScore = (result) => {
  result ? score++ : score--;
  log("\n" + CHALK_STYLES.SCORE(`${ENUMS.SCORE} ${CHALK_STYLES.UNDERLINE(score)}`))
}

const checkAnswer = (userInput,answer) => {
  if(userInput.toLowerCase() === answer.toLowerCase()){
    log("\n" + CHALK_STYLES.CORRECT_ANSWER(ENUMS.CORRECT_ANSWER[randomIndex(ENUMS.CORRECT_ANSWER.length)])) 
    updateScore(true)
  }else{
    log("\n" + CHALK_STYLES.WRONG_ANSWER(ENUMS.WRONG_ANSWER[randomIndex(ENUMS.WRONG_ANSWER.length)]))
    log(`\n${ENUMS.INFORM_CORRECT_ANSWER} ${CHALK_STYLES.USER_ANSWER(answer)}`)
    updateScore(false)
  }
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
  return array
}

const askQuestion = ({options,question,answer}) => {
  log(CHALK_STYLES.DEVIDER(ENUMS.DEVIDER_TEXT))
  const answerIndex = readlineSync.keyInSelect(shuffleArray(options),question,{
    cancel: ENUMS.PASS_TEXT
  })
  if(answerIndex !== -1){
    log(`\n${ENUMS.USER_SELECTION} ${CHALK_STYLES.USER_ANSWER(options[answerIndex])}`)
    checkAnswer(options[answerIndex],answer)
  }else{
    log(CHALK_STYLES.PASS(ENUMS.PASS_TEXT_2))
  }
}

const renderLeaderBoard = () => {
  const table = new Table({
    head: ['Rank','UserName','Score'],
  })
  lerderboards.forEach((user,index) => {
    let data = Object.values(user);
    data.unshift(index+1);
    table.push(data)
  });
  return table
}
const updateLeaderboard = (userName,score) => {
  let tempUserObj = {
    userName,score
  }
  lerderboards.push(tempUserObj)
 lerderboards.sort((prev,curr) => curr.score > prev.score ? 1 : curr.score < prev.score ? -1 : 0) 
}
const showLeaderboard = (userName,score) => {
  updateLeaderboard(userName,score);
  score > highScore ? log(`\n${ENUMS.NEW_HIGH_SCORE}`) : log(`\nHighscore is ${highScore}. ${ENUMS.BETTER_LUCK}`)
  log(`\n${ENUMS.LEADERBOARD}`)
  log(renderLeaderBoard().toString())
}

const play = (questionsArray) => {
  log(ENUMS.WELCOME_TEXT);
  const userName = getUserName();
  shuffleArray(questionsArray).forEach((question) => askQuestion(question))
  log(CHALK_STYLES.FINAL_SCORE(`\n${ENUMS.FINAL_SCORE} ${score}`))
  showLeaderboard(userName,score)
  log(ENUMS.THANKS_USER)
}

play(questionsArray)