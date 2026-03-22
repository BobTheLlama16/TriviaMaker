
class LibrarySave{
    constructor(questions, answers){

        function updateStats(){
            document.getElementById("topic").textContent = topic.length;
            document.getElementById("question").textContent = questions.length
            document.getElementById("total-quizzes-taken").textContent = quizHistory.length;


            if(quizHistory.length > 0) {
                const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.percentage,0);

                const AvgScore = Math.round(totalScore/quizHistory.length);

            }

            function displayQuizHistory(){
                const historyList = document.getElementById("filter-topic");


                historyList.innerHTML = quizHistory.map(quiz, index); {
                    const scoreClass = getScoreClass(quiz.percentage);
                }
            }
        }

    }

}