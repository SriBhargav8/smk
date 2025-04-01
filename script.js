document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const formContainer = document.getElementById("form-container")
  const quizContainer = document.getElementById("quiz-container")
  const resultContainer = document.getElementById("result-container")
  const leadForm = document.getElementById("lead-form")
  const questionText = document.getElementById("question-text")
  const optionsContainer = document.getElementById("options-container")
  const correctAnswer = document.getElementById("correct-answer")
  const wrongAnswer = document.getElementById("wrong-answer")
  const overlay = document.getElementById("overlay")
  const popup = document.getElementById("popup")
  const popupContent = document.getElementById("popup-content")
  const popupClose = document.getElementById("popup-close")
  const loadingSpinner = document.getElementById("loading")

  // User data storage
  let userData = {}
  let currentQuestion = null

  // Make sure overlay is hidden initially
  overlay.classList.add("hidden")

  // Check if user has already submitted the form - only after ensuring elements exist
  if (localStorage.getItem("quizSubmitted") === "true") {
    showPopup("You have already participated in this quiz. Would you like to try again?", true)
    return
  } else {
    // Make sure form is visible
    formContainer.classList.remove("hidden")
    quizContainer.classList.add("hidden")
    resultContainer.classList.add("hidden")
  }

  // Form submission
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate form
    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const company = document.getElementById("company").value.trim()

    if (!name || !email || !phone || !company) {
      showPopup("Please fill in all fields to continue.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showPopup("Please enter a valid email address.")
      return
    }

    // Collect form data
    userData = {
      name: name,
      email: email,
      phone: phone,
      company: company,
      timestamp: new Date().toISOString(),
      result: "",
    }

    // Hide form and show quiz with loading spinner
    formContainer.classList.add("hidden")
    quizContainer.classList.remove("hidden")
    loadingSpinner.classList.remove("hidden")

    // Load quiz question
    loadQuizQuestion()
  })

  // Load quiz question from JSON file or use fallback
  function loadQuizQuestion() {
    // Simulate network delay for better UX
    setTimeout(() => {
      // Use inline questions as fallback if fetch fails
      const fallbackQuestions = [
        {
          question: "What is the most effective way to improve productivity?",
          options: [
            "Multitasking on several projects at once",
            "Working longer hours",
            "Using the Pomodoro Technique",
            "Eliminating distractions and focusing on one task",
          ],
          correctIndex: 3,
        },
        {
          question: "Which of these is considered a key principle of effective leadership?",
          options: [
            "Micromanaging team members",
            "Leading by example",
            "Avoiding difficult conversations",
            "Making all decisions independently",
          ],
          correctIndex: 1,
        },
        {
          question: "What is the most important factor in building a successful business?",
          options: [
            "Having a large marketing budget",
            "Solving a real problem for customers",
            "Securing venture capital funding",
            "Having a prestigious office location",
          ],
          correctIndex: 1,
        },
        {
          question: "Which time management strategy is most effective for long-term productivity?",
          options: [
            "Working on urgent tasks first",
            "Prioritizing based on importance rather than urgency",
            "Handling emails as they arrive",
            "Taking on multiple projects simultaneously",
          ],
          correctIndex: 1,
        },
        {
          question: "What is the key to effective communication in a team?",
          options: [
            "Speaking more than listening",
            "Using technical jargon",
            "Active listening and clear messaging",
            "Communicating only through formal channels",
          ],
          correctIndex: 2,
        },
      ]

      // Try to load questions from JSON file
      try {
        // Use inline questions directly to avoid fetch issues
        displayQuestion(fallbackQuestions)
      } catch (error) {
        console.error("Error loading questions:", error)
        // Use fallback questions if there's an error
        displayQuestion(fallbackQuestions)
      }
    }, 1000) // 1 second delay for loading effect
  }

  // Display question from data
  function displayQuestion(questions) {
    // Hide loading spinner
    loadingSpinner.classList.add("hidden")

    // Get random question
    const randomIndex = Math.floor(Math.random() * questions.length)
    currentQuestion = questions[randomIndex]

    // Display question with animation
    questionText.style.opacity = "0"
    questionText.textContent = currentQuestion.question

    // Fade in question
    setTimeout(() => {
      questionText.style.transition = "opacity 0.5s ease"
      questionText.style.opacity = "1"
    }, 100)

    // Clear previous options
    optionsContainer.innerHTML = ""

    // Add options with staggered animation
    currentQuestion.options.forEach((option, index) => {
      const optionButton = document.createElement("button")
      optionButton.classList.add("option")
      optionButton.textContent = option
      optionButton.dataset.index = index
      optionButton.style.opacity = "0"
      optionButton.style.transform = "translateY(10px)"

      optionButton.addEventListener("click", function () {
        checkAnswer(Number.parseInt(this.dataset.index))
      })

      optionsContainer.appendChild(optionButton)

      // Staggered animation
      setTimeout(
        () => {
          optionButton.style.transition = "opacity 0.3s ease, transform 0.3s ease"
          optionButton.style.opacity = "1"
          optionButton.style.transform = "translateY(0)"
        },
        150 + index * 100,
      )
    })
  }

  // Check user's answer
  function checkAnswer(selectedIndex) {
    const isCorrect = selectedIndex === currentQuestion.correctIndex

    // Update user data with result
    userData.result = isCorrect ? "Correct" : "Wrong"

    // Submit data to Google Sheets with error handling
    submitToGoogleSheets(userData)
      .catch((error) => {
        console.error("Error submitting data:", error)
        // Save data locally as fallback
        saveDataLocally(userData)
      })
      .finally(() => {
        // Show appropriate result regardless of submission success
        showResult(isCorrect)
      })
  }

  // Show result based on answer correctness
  function showResult(isCorrect) {
    quizContainer.classList.add("hidden")
    resultContainer.classList.remove("hidden")

    if (isCorrect) {
      correctAnswer.classList.remove("hidden")
      // Start progress bar animation
      const progressFill = document.querySelector(".progress-fill")
      if (progressFill) {
        progressFill.style.animation = "progress 3s linear forwards"
      }
      // Redirect to share page after 3 seconds
      setTimeout(() => {
        window.location.href = "share.html"
      }, 3000)
    } else {
      wrongAnswer.classList.remove("hidden")
    }

    // Mark as submitted in localStorage
    localStorage.setItem("quizSubmitted", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  // Submit data to Google Sheets with proper error handling
  function submitToGoogleSheets(data) {
    return new Promise((resolve, reject) => {
      // Google Apps Script Web App URL - replace with your actual URL
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyC0ps6JWArTK-6ZNrvzm5qe3_bgVAMUrNDO1k6UThHNeWXdP0PV30H--U9mD3SC9q0RQ/exec"

      // Create form data instead of JSON for better CORS compatibility
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })

      // Try to submit with fetch using no-cors mode to avoid CORS errors
      fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors", // This prevents CORS errors but makes response unreadable
      })
        .then(() => {
          // Since we're using no-cors, we can't actually check the response
          // We'll just assume it worked
          console.log("Data submitted successfully (assumed)")
          resolve()
        })
        .catch((error) => {
          console.error("Error:", error)
          reject(error)
        })
    })
  }

  // Save data locally as fallback when Google Sheets submission fails
  function saveDataLocally(data) {
    try {
      // Get existing data or initialize empty array
      const existingData = JSON.parse(localStorage.getItem("quizResponses") || "[]")

      // Add new data
      existingData.push(data)

      // Save back to localStorage
      localStorage.setItem("quizResponses", JSON.stringify(existingData))

      console.log("Data saved locally as fallback")
    } catch (error) {
      console.error("Error saving data locally:", error)
    }
  }

  // Popup functionality
  function showPopup(message, isRetry = false) {
    popupContent.textContent = message

    // If it's a retry popup, add a retry button
    if (isRetry) {
      const retryButton = document.createElement("button")
      retryButton.classList.add("btn-primary")
      retryButton.style.marginTop = "15px"
      retryButton.textContent = "Try Again"
      retryButton.addEventListener("click", () => {
        // Clear localStorage and reload
        localStorage.removeItem("quizSubmitted")
        localStorage.removeItem("userData")
        overlay.classList.add("hidden")
        location.reload()
      })

      popupContent.appendChild(document.createElement("br"))
      popupContent.appendChild(document.createElement("br"))
      popupContent.appendChild(retryButton)
    }

    overlay.classList.remove("hidden")
  }

  // Close popup when button is clicked
  popupClose.addEventListener("click", () => {
    overlay.classList.add("hidden")

    // If user has already submitted and it's not a retry popup
    if (localStorage.getItem("quizSubmitted") === "true" && !popupContent.querySelector(".btn-primary")) {
      // Redirect to discount page as fallback
      window.location.href = "discount.html"
    }
  })
})

