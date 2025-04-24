document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const progressBar = document.getElementById('progress-bar');
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const timeLeftEl = document.getElementById('time-left');
  const quizCard = document.getElementById('quiz-card');
  const resultsCard = document.getElementById('results-card');
  const scorePercentage = document.getElementById('score-percentage');
  const correctAnswers = document.getElementById('correct-answers');
  const totalAnswers = document.getElementById('total-answers');
  const resultsMessage = document.getElementById('results-message');
  const retryQuiz = document.getElementById('retry-quiz');
  const backToHome = document.getElementById('back-to-home');
  
  // Quiz state
  let currentQuestionIndex = 0;
  let userAnswers = new Array(quizQuestions.length).fill(null);
  let timer;
  let secondsLeft = 60;
  
  // Initialize quiz
  function initQuiz() {
    // Set total questions
    totalQuestionsEl.textContent = quizQuestions.length;
    
    // Load first question
    loadQuestion(0);
    
    // Update progress bar
    updateProgress();
    
    // Start timer
    startTimer();
    
    // Load answers from local storage if they exist
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      const state = JSON.parse(savedState);
      userAnswers = state.userAnswers;
      currentQuestionIndex = state.currentQuestionIndex;
      loadQuestion(currentQuestionIndex);
      updateProgress();
    }
  }
  
  // Load question
  function loadQuestion(index) {
    // Set question text
    questionText.textContent = quizQuestions[index].question;
    
    // Clear options container
    optionsContainer.innerHTML = '';
    
    // Add options
    quizQuestions[index].options.forEach((option, i) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      
      // Check if this option is the user's saved answer
      if (userAnswers[index] === option) {
        optionElement.classList.add('selected');
      }
      
      optionElement.innerHTML = `
        <div class="option-marker"></div>
        <div class="option-text">${option}</div>
      `;
      
      optionElement.addEventListener('click', () => selectOption(option, index));
      
      optionsContainer.appendChild(optionElement);
    });
    
    // Update current question
    currentQuestionEl.textContent = index + 1;
    
    // Update buttons state
    prevButton.disabled = index === 0;
    
    if (index === quizQuestions.length - 1) {
      nextButton.innerHTML = `
        <span>Finish</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      nextButton.innerHTML = `
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
    }
    
    // Add animation
    questionText.style.animation = 'none';
    setTimeout(() => {
      questionText.style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
    
    optionsContainer.style.animation = 'none';
    setTimeout(() => {
      optionsContainer.style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
    
    // Save state to local storage
    saveState();
  }
  
  // Select option
  function selectOption(option, index) {
    // Save the answer
    userAnswers[index] = option;
    
    // Update UI
    const optionElements = optionsContainer.querySelectorAll('.option');
    optionElements.forEach((elem) => {
      elem.classList.remove('selected');
      if (elem.querySelector('.option-text').textContent === option) {
        elem.classList.add('selected');
      }
    });
    
    // Enable next button
    nextButton.disabled = false;
    
    // Save state
    saveState();
  }
  
  // Update progress bar
  function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  // Start timer
  function startTimer() {
    clearInterval(timer);
    secondsLeft = 60;
    updateTimerDisplay();
    
    timer = setInterval(() => {
      secondsLeft--;
      updateTimerDisplay();
      
      if (secondsLeft <= 0) {
        clearInterval(timer);
        moveToNextQuestion();
      }
    }, 1000);
  }
  
  // Update timer display
  function updateTimerDisplay() {
    timeLeftEl.textContent = `${secondsLeft}s`;
    
    // Add warning class when time is running low
    if (secondsLeft <= 10) {
      timeLeftEl.style.color = 'var(--error)';
    } else {
      timeLeftEl.style.color = '';
    }
  }
  
  // Move to next question
  function moveToNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
      updateProgress();
      startTimer();
    } else {
      // End of quiz
      showResults();
    }
  }
  
  // Move to previous question
  function moveToPrevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion(currentQuestionIndex);
      updateProgress();
      startTimer();
    }
  }
  
  // Show results
  function showResults() {
    // Stop timer
    clearInterval(timer);
    
    // Calculate score
    const correctCount = calculateScore();
    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    
    // Update UI
    scorePercentage.textContent = `${percentage}%`;
    correctAnswers.textContent = correctCount;
    totalAnswers.textContent = quizQuestions.length;
    
    // Set custom CSS property for the score circle animation
    document.documentElement.style.setProperty('--score-percentage', percentage);
    
    // Set message based on score
    if (percentage >= 80) {
      resultsMessage.textContent = 'Excellent! You have a great understanding of the subject!';
    } else if (percentage >= 60) {
      resultsMessage.textContent = 'Good job! You have a solid understanding of the subject.';
    } else if (percentage >= 40) {
      resultsMessage.textContent = 'Not bad! You have a basic understanding of the subject.';
    } else {
      resultsMessage.textContent = 'Keep practicing! There\'s room for improvement.';
    }
    
    // Show results card and hide quiz card
    quizCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    
    // Clear local storage
    localStorage.removeItem('quizState');
  }
  
  // Calculate score
  function calculateScore() {
    let score = 0;
    
    userAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        score++;
      }
    });
    
    return score;
  }
  
  // Save state
  function saveState() {
    const state = {
      userAnswers,
      currentQuestionIndex
    };
    
    localStorage.setItem('quizState', JSON.stringify(state));
  }
  
  // Event listeners
  prevButton.addEventListener('click', moveToPrevQuestion);
  nextButton.addEventListener('click', () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      showResults();
    } else {
      moveToNextQuestion();
    }
  });
  
  retryQuiz.addEventListener('click', () => {
    // Reset quiz
    currentQuestionIndex = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    
    // Show quiz card and hide results card
    resultsCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    
    // Initialize quiz
    initQuiz();
  });
  
  backToHome.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  // Initialize quiz
  initQuiz();
});