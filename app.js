const express = require('express');
const path = require('path');

const app = express();
const DEFAULT_PORT = 3000;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('pages/home', {
    page: 'home',
    title: 'Understand Smarter, Not Harder',
    description: 'A friendly learning hub for polytechnic students.'
  });
});

app.get('/about', (req, res) => {
  res.render('pages/about', {
    page: 'about',
    title: 'About',
    description: 'How this project supports students.'
  });
});

app.get('/ai-assistant', (req, res) => {
  res.render('pages/ai-assistant', {
    page: 'ai-assistant',
    title: 'Telegram Study Buddy',
    description: 'A Telegram-first study companion powered by n8n.'
  });
});

app.get('/study-tools', (req, res) => {
  res.render('pages/study-tools', {
    page: 'study-tools',
    title: 'Study Tools',
    description: 'Practical tools for calm, steady learning.',
    plan: null
  });
});

app.get('/study-tools/reminders', (req, res) => {
  res.render('pages/study-tools', {
    page: 'study-tools',
    title: 'Study Tools',
    description: 'Practical tools for calm, steady learning.',
    plan: 'reminders',
    reminderPlan: {
      title: 'Your study reminder plan',
      steps: [
        'Review your subject notes for 15 minutes after class.',
        'Set a short quiz each evening for one topic.',
        'Take a 5-minute break after every focused review session.',
        'Check off what you revised and keep the plan simple.'
      ]
    }
  });
});

app.get('/study-tools/quiz', (req, res) => {
  res.render('pages/study-tools', {
    page: 'study-tools',
    title: 'Study Tools',
    description: 'Practical tools for calm, steady learning.',
    plan: 'quiz',
    quizPlan: {
      title: 'Your quiz generation plan',
      steps: [
        'Pick one topic and choose 5 key questions.',
        'Write a short answer or multiple choice question for each.',
        'Try the quiz after a quick review to reinforce memory.',
        'Review any mistakes and add one follow-up question.'
      ]
    }
  });
});

app.get('/resources', (req, res) => {
  res.render('pages/resources', {
    page: 'resources',
    title: 'Resources',
    description: 'Helpful materials for revision and confidence building.'
  });
});

app.get('/contact', (req, res) => {
  res.render('pages/contact', {
    page: 'contact',
    title: 'Contact & Feedback',
    description: 'Share feedback or ask for help.',
    // Provide sensible defaults so the template can safely reference `values`
    values: { name: '', email: '', message: '' },
    errors: []
  });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedMessage = (message || '').trim();
  const errors = [];

  if (!trimmedName) {
    errors.push('Name is required.');
  }
  if (!trimmedEmail) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.push('Please enter a valid email address.');
  }

  if (errors.length) {
    return res.render('pages/contact', {
      page: 'contact',
      title: 'Contact & Feedback',
      description: 'Share feedback or ask for help.',
      errors,
      values: {
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage
      }
    });
  }

  res.render('pages/contact', {
    page: 'contact',
    title: 'Contact & Feedback',
    description: 'Share feedback or ask for help.',
    success: true,
    values: {
      name: '',
      email: '',
      message: ''
    }
  });
});

const server = app.listen(port, () => {
  console.log(`Website running at http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
    if (port === DEFAULT_PORT) {
      console.error(`Try restarting the app with a different port, for example: PORT=3001 node app.js`);
    }
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});
