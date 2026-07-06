document.addEventListener('DOMContentLoaded', () => {
  // Initialize gamification system
  const gamification = new GamificationSystem();

  // ===== BUTTON HOVER EFFECTS =====
  const buttons = document.querySelectorAll('.pill-button, .nav-links a');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });

  // ===== DOM ELEMENTS =====
  // Goal elements
  const goalInput = document.getElementById('goal-input');
  const addGoalBtn = document.getElementById('add-goal-btn');
  const goalsList = document.getElementById('goals-list');
  const goalsStatus = document.getElementById('goals-status');
  const goalCompletionCount = document.getElementById('goal-completion-count');

  // Quiz elements
  const quizTopic = document.getElementById('quiz-topic');
  const quizDifficulty = document.getElementById('quiz-difficulty');
  const quizGenerateBtn = document.getElementById('quiz-generate-btn');
  const quizModal = document.getElementById('quiz-modal');
  const quizBackdrop = document.getElementById('quiz-modal-backdrop');
  const quizClose = document.getElementById('quiz-modal-close');
  const quizTitle = document.getElementById('quiz-modal-title');
  const quizDescription = document.getElementById('quiz-modal-description');
  const quizQuestionList = document.getElementById('quiz-question-list');
  const resultPanel = document.getElementById('quiz-result-panel');
  const quizScoreText = document.getElementById('quiz-score-text');
  const quizXPEarned = document.getElementById('quiz-xp-earned');
  const quizBadgeMessage = document.getElementById('quiz-badge-message');
  const finishQuizBtn = document.getElementById('finish-quiz-btn');
  const closeResultBtn = document.getElementById('close-result-btn');

  // Progress elements
  const progressRing = document.getElementById('progress-ring');
  const progressValue = document.getElementById('progress-value');
  const currentLevel = document.getElementById('current-level');
  const xpPoints = document.getElementById('xp-points');
  const xpNeeded = document.getElementById('xp-needed');
  const badgeCount = document.getElementById('badge-count');
  const activityCount = document.getElementById('activity-count');
  const completedGoalsCount = document.getElementById('completed-goals');
  const quizzesTakenCount = document.getElementById('quizzes-taken');
  const nextBadgeChip = document.getElementById('next-badge-chip');
  const milestoneMessage = document.getElementById('milestone-message');

  // Badge milestone elements
  const badge100 = document.getElementById('badge-100');
  const badge250 = document.getElementById('badge-250');
  const badge500 = document.getElementById('badge-500');

  // ===== QUIZ TEMPLATES =====
  const quizTemplates = {
    easy: (topic) => [
      {
        prompt: `Which statement best describes ${topic}?`,
        choices: [`A simple definition`, `A random fact`, `A secret code`],
        correct: 0
      },
      {
        prompt: `What is a good first step when revising ${topic}?`,
        choices: [`Review your notes`, `Skip it`, `Ask a friend to explain nothing`],
        correct: 0
      },
      {
        prompt: `How does ${topic} help your studies?`,
        choices: [`It builds understanding`, `It makes food`, `It changes the weather`],
        correct: 0
      }
    ],
    medium: (topic) => [
      {
        prompt: `Why is understanding ${topic} important for your exam?`,
        choices: [`It helps solve problems`, `It looks nice`, `It makes your phone run faster`],
        correct: 0
      },
      {
        prompt: `Which tool is most useful for ${topic}?`,
        choices: [`Notes and examples`, `A magic wand`, `A random video`],
        correct: 0
      },
      {
        prompt: `What is one idea you should practise for ${topic}?`,
        choices: [`Core concepts`, `Fancy colors`, `The answer to everything`],
        correct: 0
      }
    ],
    hard: (topic) => [
      {
        prompt: `Describe a real application of ${topic}.`,
        choices: [`A clear practical example`, `A made-up story`, `A math trick`],
        correct: 0
      },
      {
        prompt: `What should you do after a ${topic} practice attempt?`,
        choices: [`Check what you missed`, `Forget it`, `Repeat without pause`],
        correct: 0
      },
      {
        prompt: `How can ${topic} become easier over time?`,
        choices: [`With steady review`, `By guessing`, `By ignoring it`],
        correct: 0
      }
    ]
  };

  // ===== PROGRESS RING ANIMATION =====
  function setRingValue(value) {
    const progress = Math.min(Math.max(value, 0), 100);
    progressValue.textContent = `${progress}%`;
    progressRing.style.background = `conic-gradient(var(--primary) ${progress}%, #e7edff ${progress}% 100%)`;
  }

  function animateProgress(target = 0) {
    let start = null;
    const duration = 1000;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setRingValue(Math.round(progress * target));
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ===== UPDATE DISPLAY =====
  function updateProgressDisplay() {
    const level = gamification.getLevel();
    const totalXP = gamification.getTotalXP();
    const xpProgress = gamification.getXPProgress();
    const badgeInfo = gamification.getBadgeInfo();
    const completedGoals = gamification.getCompletedGoals();
    const actCount = gamification.getActivityCount();

    currentLevel.textContent = `Level ${level}`;
    xpPoints.textContent = totalXP;
    xpNeeded.textContent = xpProgress.needed;
    badgeCount.textContent = badgeInfo.unlocked.length;
    activityCount.textContent = actCount;
    completedGoalsCount.textContent = completedGoals.length;
    quizzesTakenCount.textContent = gamification.data.quizzesTaken;

    // Update progress ring
    animateProgress(xpProgress.percentage);

    // Update next badge
    const nextBadge = badgeInfo.nextBadge;
    if (nextBadge) {
      nextBadgeChip.innerHTML = `<strong>${nextBadge}</strong> XP to unlock badge`;
    } else {
      nextBadgeChip.innerHTML = `<strong>Max</strong> badges unlocked!`;
    }

    // Update badge milestone badges
    updateBadgeMilestones(badgeInfo);

    // Update milestone message
    if (totalXP === 0) {
      milestoneMessage.textContent = 'Complete study goals and quizzes to earn XP and unlock badges!';
    } else if (nextBadge === 100) {
      milestoneMessage.textContent = `Keep going! ${100 - totalXP} XP to first badge.`;
    } else if (nextBadge === 250) {
      milestoneMessage.textContent = `Excellent progress! ${nextBadge - totalXP} XP to next badge.`;
    } else if (nextBadge === 500) {
      milestoneMessage.textContent = `Amazing dedication! ${nextBadge - totalXP} XP to final badge.`;
    } else {
      milestoneMessage.textContent = 'Congratulations! You have unlocked all badges!';
    }
  }

  function updateBadgeMilestones(badgeInfo) {
    const badges = [
      { element: badge100, threshold: 100, icon: '🎯' },
      { element: badge250, threshold: 250, icon: '⭐' },
      { element: badge500, threshold: 500, icon: '👑' }
    ];

    badges.forEach((badge, index) => {
      if (badgeInfo.unlocked.includes(index)) {
        badge.element.style.opacity = '1';
        badge.element.innerHTML = `${badge.icon} ${badge.threshold} XP (Unlocked!)`;
        badge.element.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
        badge.element.style.color = 'white';
      } else {
        badge.element.style.opacity = '0.6';
        badge.element.innerHTML = `${badge.icon} ${badge.threshold} XP`;
        badge.element.style.background = 'linear-gradient(135deg, var(--mint), #f7fefb)';
        badge.element.style.color = 'inherit';
      }
    });
  }

  // ===== GOALS MANAGEMENT =====
  function renderGoals() {
    const goals = gamification.getGoals();
    
    if (goals.length === 0) {
      goalsList.innerHTML = '<li class="empty-state">No goals yet. Add one to start earning XP!</li>';
      goalsStatus.textContent = 'No goals yet';
      goalCompletionCount.textContent = '0';
      return;
    }

    const completed = gamification.getCompletedGoals().length;
    const pending = gamification.getPendingGoals().length;

    goalsStatus.textContent = `${completed}/${goals.length} completed`;
    goalCompletionCount.textContent = completed;

    goalsList.innerHTML = goals
      .map((goal) => `
        <li class="goal-item ${goal.completed ? 'completed' : 'pending'}">
          <div class="goal-content">
            <input type="checkbox" class="goal-checkbox" data-goal-id="${goal.id}" ${goal.completed ? 'checked' : ''} />
            <span class="goal-text">${goal.text}</span>
            <span class="goal-xp">+${gamification.GOAL_XP} XP</span>
          </div>
          <button class="goal-delete" data-goal-id="${goal.id}" aria-label="Delete goal">×</button>
        </li>
      `)
      .join('');

    // Attach event listeners
    document.querySelectorAll('.goal-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const goalId = Number(e.target.dataset.goalId);
        if (e.target.checked) {
          const result = gamification.completeGoal(goalId);
          if (result) {
            showNotification(`Goal completed! +${result.xpEarned} XP`);
            if (result.newBadges.length > 0) {
              result.newBadges.forEach(badge => {
                showNotification(`🎉 Badge unlocked at ${badge.threshold} XP!`);
              });
            }
            updateProgressDisplay();
            renderGoals();
          }
        }
      });
    });

    document.querySelectorAll('.goal-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const goalId = Number(e.target.dataset.goalId);
        gamification.removeGoal(goalId);
        renderGoals();
        updateProgressDisplay();
      });
    });
  }

  addGoalBtn.addEventListener('click', () => {
    const goalText = goalInput.value.trim();
    if (goalText) {
      gamification.addGoal(goalText);
      goalInput.value = '';
      goalInput.focus();
      renderGoals();
    }
  });

  goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addGoalBtn.click();
    }
  });

  // ===== QUIZ MANAGEMENT =====
  function buildQuizList(topic, difficulty) {
    const normalizedTopic = topic.trim() || 'your topic';
    return quizTemplates[difficulty](normalizedTopic);
  }

  function showQuizModal() {
    quizModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideQuizModal() {
    quizModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function renderQuizPreview() {
    const topic = quizTopic.value.trim() || 'your topic';
    const difficulty = quizDifficulty.value;
    const questions = buildQuizList(topic, difficulty);

    quizTitle.textContent = `${topic} - ${difficulty} Quiz`;
    
    const xpPerCorrect = {
      easy: 5,
      medium: 10,
      hard: 15
    }[difficulty];
    
    quizDescription.textContent = `Try ${questions.length} questions. Earn ${xpPerCorrect} XP for each correct answer.`;
    
    quizQuestionList.innerHTML = questions
      .map((item, index) => `
        <li data-correct="${item.correct}">
          <strong>${index + 1}. ${item.prompt}</strong>
          ${item.choices
            .map(
              (choice, choiceIndex) => `
                <label>
                  <input type="radio" name="question-${index}" value="${choiceIndex}" />
                  ${choice}
                </label>`
            )
            .join('')}
        </li>`
      )
      .join('');

    resultPanel.classList.add('hidden');
    closeResultBtn.classList.add('hidden');
    finishQuizBtn.textContent = 'Submit answers';
    quizScoreText.textContent = 'Score: 0 / 3';
    quizXPEarned.textContent = 'XP earned: 0';
    quizBadgeMessage.textContent = 'Good job!';

    showQuizModal();
  }

  function computeQuizScore() {
    const questions = quizQuestionList.querySelectorAll('li');
    let score = 0;

    questions.forEach((item) => {
      const selected = item.querySelector('input[type="radio"]:checked');
      const correct = Number(item.dataset.correct);
      if (selected && Number(selected.value) === correct) {
        score += 1;
      }
    });

    return score;
  }

  function updateQuizResult() {
    const score = computeQuizScore();
    const total = quizQuestionList.querySelectorAll('li').length;
    const difficulty = quizDifficulty.value;
    
    const result = gamification.completeQuiz(difficulty, score, total);
    const xpEarned = result.xpEarned;
    const newBadges = result.newBadges;

    const percentage = Math.round((score / total) * 100);
    const messages = {
      100: 'Perfect score! You are a master!',
      80: 'Great job! Well done!',
      60: 'Good effort! Keep practicing!',
      0: 'Keep trying! You will improve!'
    };

    let message = messages[0];
    if (percentage === 100) message = messages[100];
    else if (percentage >= 80) message = messages[80];
    else if (percentage >= 60) message = messages[60];

    quizScoreText.textContent = `Score: ${score} / ${total}`;
    quizXPEarned.textContent = `XP earned: ${xpEarned}`;
    quizBadgeMessage.textContent = message;
    
    resultPanel.classList.remove('hidden');
    closeResultBtn.classList.remove('hidden');
    finishQuizBtn.textContent = 'Submit answers';

    // Show badge notifications
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        showNotification(`🎉 Badge unlocked at ${badge.threshold} XP!`);
      });
    }

    updateProgressDisplay();
  }

  quizGenerateBtn.addEventListener('click', renderQuizPreview);
  finishQuizBtn.addEventListener('click', updateQuizResult);
  quizClose.addEventListener('click', hideQuizModal);
  quizBackdrop.addEventListener('click', hideQuizModal);
  closeResultBtn.addEventListener('click', hideQuizModal);

  // ===== NOTIFICATIONS =====
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(123, 184, 255, 0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      font-weight: 700;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }

  // Add notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ===== INITIALIZE =====
  updateProgressDisplay();
  renderGoals();
});
