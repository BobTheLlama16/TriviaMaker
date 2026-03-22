// Making our List
    // We made these two lists to represent the questions the user will make
    // Since we do not know what Questions our users will make they are an empty list
    let questions = [];
    let currentQuiz = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = null;

    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
      loadQuestions();
      updateQuestionBank();
      updateTopicFilters();
    });

    // Tab switching
    function showTab(tabName) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
     
      // Remove active class from all buttons
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
     
      // Show selected tab and activate button
      document.getElementById(tabName + '-tab').classList.add('active');
      event.target.classList.add('active');
    }

    // Add question functionality
    function addQuestion() {
      const topic = document.getElementById('topic').value.trim();
      const questionText = document.getElementById('question').value.trim();
      const answers = [
        document.getElementById('answer1').value.trim(),
        document.getElementById('answer2').value.trim(),
        document.getElementById('answer3').value.trim(),
        document.getElementById('answer4').value.trim()
      ];
      const iscorrect = [
        document.getElementById('correct1').checked,
        document.getElementById('correct2').checked,
        document.getElementById('correct3').checked,
        document.getElementById('correct4').checked,
      ];
      // console.log(iscorrect);
      // Parses correct answer
      // const correctAnswer = document.querySelector('input[name="correct"]:checked');
  
      // Validation
      if (!topic || !questionText) {
        alert('Please fill in the topic and question fields.');
        return;
      }

      // answers[0]

      if (answers.some(answer => !answer)) {
        alert('Please fill in all answer options.');
        return;
      }

      if (!(iscorrect[0] || iscorrect[1] || iscorrect[2] || iscorrect[3])) {
        alert('Please select the correct answer.');
        return;
      }

      // if (correctAnswer === answers) {
      //   alert()
      //   return;
      // }

      // Create question object
      const newQuestion = {
        id: Date.now(),
        topic: topic,
        question: questionText,
        answers: answers,
        correct: iscorrect, //parseInt(correctAnswer.value),
        dateCreated: new Date().toLocaleDateString()
      };

      // Add to questions array
      questions.push(newQuestion);
      saveQuestions();
      updateQuestionBank();
      updateTopicFilters();
      clearForm();
     
      alert('Question added successfully!');
    }

    // Clear form
    function clearForm() {
      document.getElementById('topic').value = '';
      document.getElementById('question').value = '';
      document.getElementById('answer1').value = '';
      document.getElementById('answer2').value = '';
      document.getElementById('answer3').value = '';
      document.getElementById('answer4').value = '';
      const checkedRadio = document.querySelector('input[name="correct"]:checked');
      if (checkedRadio) checkedRadio.checked = false;
    }

    // Update question bank display
    function updateQuestionBank() {
      const questionsList = document.getElementById('questions-list');
      const filterTopic = document.getElementById('filter-topic').value;
     
      let filteredQuestions = questions;
      if (filterTopic) {
        filteredQuestions = questions.filter(q => q.topic === filterTopic);
      }

      if (filteredQuestions.length === 0) {
        questionsList.innerHTML = '<div class="empty-state">No questions found. Create your first question!</div>';
        return;
      }

      questionsList.innerHTML = filteredQuestions.map(q => `
        <div class="question-item">
          <div class="question-text">${q.question}</div>
          <div class="question-answers">
            ${q.answers.map((answer, index) => `
              <div class="answer-option ${q.correct[index] ? 'correct' : ''}">${answer}</div>
            `).join('')}
          </div>
          <div class="question-meta">
            <span><strong>Topic:</strong> ${q.topic} | <strong>Created:</strong> ${q.dateCreated}</span>
            <button class="delete-btn" onclick="deleteQuestion(${q.id})">Delete</button>
          </div>
        </div>
      `).join('');
    }

    // Delete question
    function deleteQuestion(id) {
      if (confirm('Are you sure you want to delete this question?')) {
        questions = questions.filter(q => q.id !== id);
        saveQuestions();
        updateQuestionBank();
        updateTopicFilters();
      }
    }

    // Filter questions
    function filterQuestions() {
      updateQuestionBank();
    }

    // Update topic filters
    function updateTopicFilters() {
      const topics = [...new Set(questions.map(q => q.topic))];
      const filterSelect = document.getElementById('filter-topic');
      const quizTopicSelect = document.getElementById('quiz-topic');
     
      // Update filter dropdown
      filterSelect.innerHTML = '<option value="">All Topics</option>' +
        topics.map(topic => `<option value="${topic}">${topic}</option>`).join('');
     
      // Update quiz topic dropdown
      quizTopicSelect.innerHTML = '<option value="">All Topics</option>' +
        topics.map(topic => `<option value="${topic}">${topic}</option>`).join('');
    }

    // Start quiz
    function startQuiz() {
      if (questions.length === 0) {
        alert('Please create some questions first!');
        return;
      }

      const selectedTopic = document.getElementById('quiz-topic').value;
      const questionCount = parseInt(document.getElementById('quiz-count').value);
     
      let availableQuestions = questions;
      if (selectedTopic) {
        availableQuestions = questions.filter(q => q.topic === selectedTopic);
      }

      if (availableQuestions.length === 0) {
        alert('No questions available for the selected topic!');
        return;
      }

      // Shuffle and select questions
      const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
      currentQuiz = shuffled.slice(0, Math.min(questionCount, shuffled.length));
     
      // Reset quiz state
      currentQuestionIndex = 0;
      score = 0;
      selectedAnswer = null;
     
      // Show quiz game
      document.getElementById('quiz-setup').classList.add('hidden');
      document.getElementById('quiz-game').classList.remove('hidden');
      document.getElementById('quiz-results').classList.add('hidden');
     
      displayQuestion();
    }

    // Display current question
    function displayQuestion() {
      const question = currentQuiz[currentQuestionIndex];
      document.getElementById('current-question').textContent = question.question;
      document.getElementById('question-counter').textContent =
        `Question ${currentQuestionIndex + 1} of ${currentQuiz.length}`;
     
      // Update progress bar
      const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
      document.getElementById('progress-fill').style.width = progress + '%';
     
      // Display answers
      const answersContainer = document.getElementById('quiz-answers');
      answersContainer.innerHTML = question.answers.map((answer, index) => `
        <div class="quiz-answer" onclick="selectAnswer(${index})">${answer}</div>
      `).join('');
     
      // Reset buttons
      document.getElementById('next-btn').style.display = 'none';
      document.getElementById('finish-btn').style.display = 'none';
      selectedAnswer = null;
    }

    // Select answer
    function selectAnswer(answerIndex) {
      if (selectedAnswer !== null) return; // Already answered
     
      selectedAnswer = answerIndex;
      const question = currentQuiz[currentQuestionIndex];
      const answers = document.querySelectorAll('.quiz-answer');
     
      answers.forEach((answer, index) => {
        if (question.correct[index]) {
          answer.classList.add('correct');
        } else if (index === selectedAnswer) {
          answer.classList.add('wrong');
        }
      });
     
      if (question.correct[selectedAnswer]) {
        score++;
      }
     
      // Show next/finish button
      if (currentQuestionIndex < currentQuiz.length - 1) {
        document.getElementById('next-btn').style.display = 'inline-block';
      } else {
        document.getElementById('finish-btn').style.display = 'inline-block';
      }
    }

    // Next question
    function nextQuestion() {
      currentQuestionIndex++;
      displayQuestion();
    }

    // Finish quiz
    function finishQuiz() {
      document.getElementById('quiz-game').classList.add('hidden');
      document.getElementById('quiz-results').classList.remove('hidden');
     
      const percentage = Math.round((score / currentQuiz.length) * 100);
      document.getElementById('final-score').textContent = `${score}/${currentQuiz.length} (${percentage}%)`;
     
      let message = '';
      if (percentage >= 90) {
        message = 'Outstanding! You\'re a trivia master!';
      } else if (percentage >= 70) {
        message = 'Great job! You know your stuff!';
      } else if (percentage >= 50) {
        message = 'Not bad! Keep practicing!';
      } else {
        message = 'Keep studying and try again!';
      }
     
      document.getElementById('score-message').textContent = message;
    }

    // Reset quiz
    function resetQuiz() {
      document.getElementById('quiz-setup').classList.remove('hidden');
      document.getElementById('quiz-game').classList.add('hidden');
      document.getElementById('quiz-results').classList.add('hidden');
    }

    // Save questions to memory (since we can't use localStorage)
    function saveQuestions() {
      // In a real implementation, this would save to localStorage
      // For now, questions persist only during the session
    }

    // Load questions from memory
    function loadQuestions() {
      // In a real implementation, this would load from localStorage
      // For now, we start with an empty array
    }