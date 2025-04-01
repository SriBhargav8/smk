document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const linkedinReview = document.getElementById("linkedin-review")
  const copyLinkedin = document.getElementById("copy-linkedin")
  const facebookShare = document.getElementById("facebook-share")
  const twitterShare = document.getElementById("twitter-share")
  const instagramShare = document.getElementById("instagram-share")
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")
  const confettiContainer = document.getElementById("confetti-container")

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")

  // Create confetti effect
  createConfetti()

  // Review templates
  const reviews = [
    {
      linkedin:
        "I just took an amazing quiz and won a free book! The content was incredibly insightful and I can't wait to dive into the book. If you're looking to improve your skills, I highly recommend checking this out!",
      facebook:
        "Just won a free book through an awesome quiz! 📚 The questions were thought-provoking and I learned a lot in the process. Check it out if you're interested in professional development!",
      twitter:
        "Just aced a quiz and won a free book! 🎉 The questions were challenging but insightful. Definitely worth your time if you're looking to grow professionally. #FreeLearning #ProfessionalDevelopment",
      instagram:
        "📚 QUIZ WINNER! 📚\nJust won an amazing book by taking a quick quiz online! The questions really made me think about my professional approach. Can't wait to start reading and implementing these strategies!\n.\n.\n.\n#ProfessionalDevelopment #FreeBook #LifelongLearning",
    },
    {
      linkedin:
        "I'm excited to share that I just participated in an insightful quiz that tested my knowledge on professional development. As a reward, I received a free book that I'm looking forward to reading. If you're interested in growing professionally, I recommend giving it a try!",
      facebook:
        "Just completed a quick professional quiz and won a free book! 🤓 The questions were really thought-provoking and made me reflect on my current practices. Excited to dive into my new read!",
      twitter:
        "Just won a free book by taking a quick professional quiz! 📚 The questions were spot-on and really made me think. Highly recommend giving it a try! #ProfessionalGrowth #FreeLearning",
      instagram:
        "🎁 FREE BOOK ALERT! 🎁\nJust won this amazing book by taking a quick online quiz! The questions were challenging but so relevant to professional growth. Can't wait to dive in and learn some new strategies!\n.\n.\n.\n#ProfessionalDevelopment #QuizWinner #NewBook",
    },
    {
      linkedin:
        "I recently participated in a quiz about professional development and was pleasantly surprised to win a free book! The quiz itself was valuable as it made me reflect on my current practices. If you're looking to assess your professional knowledge while potentially winning a great resource, I recommend checking it out.",
      facebook:
        "Just won a free book by taking this awesome quiz! 📖 The questions were super relevant to my professional journey and made me think about areas where I can improve. Definitely worth a few minutes of your time!",
      twitter:
        "Took a quick quiz and won a free book! 🎯 The questions were surprisingly insightful and made me rethink some of my professional approaches. Give it a try! #FreeBook #ProfessionalDevelopment",
      instagram:
        "📚 QUIZ & WIN! 📚\nJust scored this amazing book by taking a quick professional development quiz! The questions were challenging but incredibly relevant. Looking forward to implementing these new strategies!\n.\n.\n.\n#ProfessionalGrowth #FreeBook #AlwaysLearning",
    },
  ]

  // Display review
  function displayReview() {
    // Get random review template
    const randomIndex = Math.floor(Math.random() * reviews.length)
    const reviewTemplate = reviews[randomIndex]

    // Replace placeholders with user data if available
    let reviewText = reviewTemplate.linkedin
    if (userData.name) {
      reviewText = reviewText.replace("{name}", userData.name)
    }

    // Display LinkedIn review with typing effect
    typeText(linkedinReview, reviewText)

    // Set up social share links
    setupSocialSharing(reviewTemplate)
  }

  // Call displayReview to show the review
  displayReview()

  // Typing effect for LinkedIn review
  function typeText(element, text, speed = 30) {
    let i = 0
    element.textContent = ""

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(type, speed)
      }
    }

    type()
  }

  // Set up social sharing links
  function setupSocialSharing(reviewTemplate) {
    // Prepare the share URL - this should be your website URL
    const shareUrl = window.location.origin || "https://yourwebsite.com"

    // LinkedIn share
    linkedinReview.addEventListener("click", copyLinkedInText)
    copyLinkedin.addEventListener("click", copyLinkedInText)

    function copyLinkedInText() {
      const linkedinText = linkedinReview.textContent

      // Copy to clipboard
      navigator.clipboard
        .writeText(linkedinText)
        .then(() => {
          showToast("LinkedIn post copied to clipboard!")

          // Create the LinkedIn share URL with prefilled text
          const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedinText)}`

          // Open LinkedIn share dialog
          window.open(linkedinShareUrl, "_blank")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          // Fallback if clipboard fails
          window.open("https://www.linkedin.com/", "_blank")
        })
    }

    // Facebook share
    facebookShare.addEventListener("click", (e) => {
      e.preventDefault()

      // Format the Facebook share text
      const facebookText = reviewTemplate.facebook

      // Copy to clipboard
      navigator.clipboard
        .writeText(facebookText)
        .then(() => {
          showToast("Facebook post copied to clipboard!")

          // Create the Facebook share URL
          const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(facebookText)}`

          // Open Facebook share dialog
          window.open(facebookShareUrl, "_blank", "width=600,height=400")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          // Fallback if clipboard fails
          const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          window.open(facebookShareUrl, "_blank", "width=600,height=400")
        })
    })

    // Twitter share
    twitterShare.addEventListener("click", (e) => {
      e.preventDefault()

      // Format the Twitter share text
      const twitterText = reviewTemplate.twitter

      // Copy to clipboard
      navigator.clipboard
        .writeText(twitterText)
        .then(() => {
          showToast("Twitter post copied to clipboard!")

          // Create the Twitter share URL
          const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`

          // Open Twitter share dialog
          window.open(twitterShareUrl, "_blank", "width=600,height=400")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          // Fallback if clipboard fails
          const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
          window.open(twitterShareUrl, "_blank", "width=600,height=400")
        })
    })

    // Instagram share (note: Instagram doesn't support direct web sharing with prefilled text)
    instagramShare.addEventListener("click", (e) => {
      e.preventDefault()

      // Format the Instagram share text
      const instagramText = reviewTemplate.instagram

      // Copy to clipboard
      navigator.clipboard
        .writeText(instagramText)
        .then(() => {
          showToast("Instagram post copied to clipboard! Opening Instagram...")

          // On mobile, try to open the Instagram app
          if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Try to open Instagram app first
            setTimeout(() => {
              window.location.href = "instagram://"

              // Fallback to website after a delay (in case app doesn't open)
              setTimeout(() => {
                window.open("https://www.instagram.com/", "_blank")
              }, 2000)
            }, 500)
          } else {
            // On desktop, just open the Instagram website
            window.open("https://www.instagram.com/", "_blank")
          }
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          // Fallback if clipboard fails
          window.open("https://www.instagram.com/", "_blank")
        })
    })
  }

  // Show toast notification
  function showToast(message) {
    toastMessage.textContent = message
    toast.classList.remove("hidden")

    setTimeout(() => {
      toast.classList.add("hidden")
    }, 3000)
  }

  // Create confetti effect
  function createConfetti() {
    const colors = ["#4361ee", "#3a56d4", "#38b000", "#ffbe0b", "#fb5607"]
    const confettiCount = 150

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"

      // Random properties
      const size = Math.random() * 10 + 5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const delay = Math.random() * 3
      const duration = Math.random() * 3 + 3

      // Apply styles
      confetti.style.width = `${size}px`
      confetti.style.height = `${size}px`
      confetti.style.backgroundColor = color
      confetti.style.left = `${left}%`
      confetti.style.top = "-10px"
      confetti.style.position = "absolute"
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0"
      confetti.style.opacity = Math.random() + 0.5
      confetti.style.animation = `fall ${duration}s ease-in forwards ${delay}s`

      confettiContainer.appendChild(confetti)
    }

    // Add animation keyframes
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(${window.innerHeight}px) rotate(360deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
})

