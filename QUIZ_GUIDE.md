# 🎯 Quiz Questions Reference Guide

## Overview
Each course has interactive multiple-choice quizzes that test your knowledge. Quizzes are only available after completing all lessons in a course.

---

## 📚 Course 1: Web Basic (HTML/CSS/JavaScript)

### Quiz Details:
- **Total Questions:** 3
- **Format:** Multiple choice (4 options each)
- **Passing Score:** Attempt all questions
- **Time Limit:** None

### Questions:

#### Question 1: សម្រាប់អ្វីបានហើយ HTML?
**HTML को उपयोग क्या है?**

**Options:**
- A) រចនាសម្ព័ន្ធគេហទំព័រ *(Correct) ✓*
- B) ការគ្រប់គ្រង
- C) ក្រាហ្វិក
- D) ម៉ាស៊ីនម្ហូប

**Explanation:** HTML (HyperText Markup Language) is used to create the structure of web pages.

---

#### Question 2: CSS តើជាមេរៀន?
**CSS का उपयोग क्या है?**

**Options:**
- A) ឯកសារ
- B) ការគ្រប់គ្រង
- C) ក្រាហ្វិក
- D) ទម្រង់ពណ៌ និងលក្ខណៈ *(Correct) ✓*

**Explanation:** CSS (Cascading Style Sheets) is used to style HTML elements and control their appearance.

---

#### Question 3: JavaScript គឺជា?
**JavaScript क्या है?**

**Options:**
- A) ឯកសារ
- B) ភាសាសរសេរកម្មវិធី *(Correct) ✓*
- C) ឧបករណ៍
- D) ម៉ាកាប់

**Explanation:** JavaScript is a programming language used to add interactivity to web pages.

---

## ⚛️ Course 2: React JS

### Quiz Details:
- **Total Questions:** 3
- **Format:** Multiple choice (4 options each)
- **Difficulty:** Intermediate
- **Prerequisites:** Web Basic recommended

### Questions:

#### Question 1: React គឺជា?
**React क्या है?**

**Options:**
- A) ឧបករណ៍
- B) ប្រអប់
- C) បណ្ណាល័យ *(Correct) ✓*
- D) ភាសា

**Explanation:** React is a JavaScript library developed by Facebook for building user interfaces.

---

#### Question 2: useState គឺជា?
**useState क्या है?**

**Options:**
- A) វាលបញ្ជូន
- B) Hook *(Correct) ✓*
- C) ឧបករណ៍
- D) ប្រអប់

**Explanation:** useState is a React Hook that allows you to add state to functional components.

---

#### Question 3: Component នៅក្នុង React គឺជា?
**React में Component क्या है?**

**Options:**
- A) លេខ
- B) អង្គភាព *(Correct) ✓*
- C) ឯកសារ
- D) ដ៏មាន

**Explanation:** A Component in React is a reusable unit of UI that can be composed together.

---

## 🐍 Course 3: Python Programming

### Quiz Details:
- **Total Questions:** 3
- **Format:** Multiple choice (4 options each)
- **Difficulty:** Beginner
- **No Prerequisites**

### Questions:

#### Question 1: Python ត្រូវបានបង្កើតឡើងឆ្នាំ?
**Python किस साल बना था?**

**Options:**
- A) 1980
- B) 1991 *(Correct) ✓*
- C) 2000
- D) 2010

**Explanation:** Python was created by Guido van Rossum in 1991.

---

#### Question 2: Python ទោះបីជា... អ្វីក៏ដោយ?
**Python के बारे में कौन सा सत्य है?**

**Options:**
- A) លឿន
- B) ខ្ពស់ក្នុងការផលិតបាន
- C) ងាយរៀន និងងាយប្រើប្រាស់ *(Correct) ✓*
- D) ឥតមនុស្ស

**Explanation:** Python is known for being easy to learn and read, making it beginner-friendly.

---

#### Question 3: របៀបសរសេរមតិយោបល់នៅក្នុង Python?
**Python में comment कैसे लिखते हैं?**

**Options:**
- A) // មតិយោបល់
- B) # មតិយោបល់ *(Correct) ✓*
- C) /* មតិយោបល់ */
- D) <!-- មតិយោបល់ -->

**Explanation:** In Python, comments are written using the hash symbol (#).

---

## 🎯 How to Take a Quiz

### Step-by-Step:
1. **Complete Course**
   - Watch all lessons (100% progress)
   - Mark all lessons as done

2. **Open Quiz Tab**
   - Click "ការប្រឡង" in sidebar
   - See available quizzes

3. **Start Quiz**
   - Click "ចាប់ផ្ដើម Quiz" button
   - Questions appear

4. **Answer Questions**
   - Select one option per question
   - Change answers if needed
   - Cannot change after submit!

5. **Submit Quiz**
   - Click "ដាក់ស្នើ Quiz"
   - Quiz submitted

6. **View Results**
   - See score: `Correct / Total`
   - Green = Correct answers
   - Red = Your wrong answers

7. **Get Certificate**
   - Click "ទទួលលទ្ធផល"
   - Certificate added to your account

---

## 📊 Scoring System

### Point Calculation:
- **Each Question:** 1 point
- **Total Points:** Number of questions
- **Score Formula:** (Correct Answers / Total Questions) × 100

### Example Scoring:
```
Web Basic Quiz:
Question 1: ✓ Correct = 1 point
Question 2: ✓ Correct = 1 point
Question 3: ✗ Wrong = 0 points

Total: 2/3 = 66.67%
```

---

## 🏆 Certificate Information

### What You Get:
- Professional certificate design
- Your name on certificate
- Course name
- Completion date
- Golden award seal
- Printable format

### Certificate Details:
```
Certificate of Completion
Certifies that: [Your Name]
Has successfully completed: [Course Title]
With passing score: [Your Score]%
Date: [Current Date]
```

---

## 📝 Adding More Quiz Questions

### Question Structure:
```javascript
{
  id: 'unique-id',
  question: 'Question text in English/Khmer',
  options: [
    'Option A',
    'Option B',
    'Option C',
    'Option D'
  ],
  correct: 0, // Index (0-3) of correct answer
  category: 'Topic Name'
}
```

### How to Add New Questions:

1. **Find Quiz Data:**
   - Open DashboardPage.tsx
   - Find `quizQuestions` object

2. **Add Course Quiz:**
   ```javascript
   'course-id': [
     {
       id: 'q1',
       question: 'Your question?',
       options: ['A', 'B', 'C', 'D'],
       correct: 0, // A is correct
       category: 'Topic'
     }
   ]
   ```

3. **Save and Reload**
   - Quiz automatically available

---

## 💡 Tips for Taking Quizzes

### Before Quiz:
- ✅ Review lessons again
- ✅ Make sure you're ready
- ✅ Have good internet connection
- ✅ No time pressure

### During Quiz:
- ✅ Read questions carefully
- ✅ Think before selecting
- ✅ Can change answers (before submit)
- ✅ Take your time

### After Quiz:
- ✅ Review your score
- ✅ Check wrong answers
- ✅ Learn from mistakes
- ✅ Retake if needed

---

## 🚀 Future Quiz Courses

### Planned Additions:
- React JS Advanced
- Node.js Backend
- Python Advanced
- Flutter Mobile
- UI/UX Design
- And more!

---

## 🎓 Learning Path Recommendation

### Beginner Path:
1. Start with **Web Basic** (HTML/CSS/JS)
2. Then try **Python** (easier language)
3. Move to **React** (advanced frontend)

### Intermediate Path:
1. **React** (if you know HTML/CSS/JS)
2. **Python** (for backend concepts)
3. Advanced courses (coming soon)

### Professional Path:
1. Complete all available courses
2. Take all quizzes
3. Get all certificates
4. Join community projects

---

## ❓ FAQ About Quizzes

### Q: Can I retake a quiz?
**A:** Yes! You can take a quiz multiple times. Your latest score counts.

### Q: What if I fail?
**A:** No penalty! Review lessons and try again. Keep learning!

### Q: Do I need 100% to pass?
**A:** No time limit or minimum score. Any attempt counts as completion.

### Q: Can I edit answers after submit?
**A:** No, once submitted, answers are locked. Review before submitting!

### Q: How many questions per quiz?
**A:** Currently 3 questions per quiz. More will be added.

### Q: Is there a time limit?
**A:** No time limit. Take as long as you need.

### Q: Can I see explanations?
**A:** Yes! After submitting, you see which answers were correct.

### Q: Are quizzes required?
**A:** No, they're optional. But recommended for better learning!

---

## 🎉 Achievement Badges (Future)

These badges will be added soon:
- 🌟 Quiz Master (Pass all quizzes)
- 🏆 Perfect Score (100% on a quiz)
- 📚 Course Completer (Complete a full course)
- ⭐ Favorite Learner (Save 10+ favorites)
- 🚀 Speed Learner (Complete course fast)

---

**Quiz System Version:** 1.0
**Last Updated:** December 2024
**Status:** Active ✅

**Happy Learning! 🎓**

