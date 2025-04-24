document.addEventListener('DOMContentLoaded', () => {
  const startQuizButton = document.getElementById('start-quiz');
  
  // Add animation for button
  startQuizButton.addEventListener('mouseenter', () => {
    startQuizButton.style.transform = 'translateY(-5px)';
  });
  
  startQuizButton.addEventListener('mouseleave', () => {
    startQuizButton.style.transform = 'translateY(0)';
  });
  
  // Navigate to quiz page
  startQuizButton.addEventListener('click', () => {
    // Add a nice transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      window.location.href = 'quiz.html';
    }, 500);
  });
});