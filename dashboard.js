// ========== USER DATA SIMULATION ==========
const user = {
    name: "Mahabubul Alam", // You can later fetch this from localStorage or backend
    avatarUrl: "https://ui-avatars.com/api/?name=Mahabubul+Alam&background=6c63ff&color=fff"
};

// ========== ON PAGE LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
    // Set user name and avatar
    const userNameEl = document.getElementById("userName");
    const userAvatarEl = document.querySelector(".user-avatar");

    if (userNameEl && userAvatarEl) {
        userNameEl.textContent = user.name;
        userAvatarEl.src = user.avatarUrl;
    }

    // Setup logout button
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    // Profile avatar click to view profile
    userAvatarEl.addEventListener("click", () => {
        // Redirect to profile page
        window.location.href = "profile.html"; // Ensure profile.html exists
    });

    // Card buttons functionality
    const cardButtons = document.querySelectorAll(".card-action");
    cardButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.currentTarget.closest(".feature-card");
            card.classList.add("card-clicked");

            setTimeout(() => {
                card.classList.remove("card-clicked");
                
                const cardId = card.id;
                console.log("Navigating to:", cardId + ".html");
                
                switch (cardId) {
                    case "mood-tracking":
                        window.location.href = "mood-tracking.html";
                        break;
                    case "selfCare":
                        window.location.href = "selfcare.html";
                        break;
                    case "habitTracker":
                        window.location.href = "habit.html";
                        break;
                    case "journal":
                        window.location.href = "journal.html";
                        break;
                    case "consultation":
                        window.location.href = "consultation.html";
                        break;
                    case "chatbot":
                        window.location.href = "chatbot.html";
                        break;
                    default:
                        console.warn("Unknown card ID:", cardId);
                }
            }, 150);
        });
    });
});

// ========== LOGOUT FUNCTION ==========
function handleLogout(e) {
    e.preventDefault(); // Prevent any default behavior
    
    const logoutBtn = document.querySelector(".logout-btn");
    
    // Change button to loading state
    logoutBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    logoutBtn.disabled = true;

    // Simulate logout process (in a real app, this would be an API call)
    console.log("Logging out...");
    
    setTimeout(() => {
        // Clear user data from localStorage if used
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('userData');
        
        // Redirect to login page
        window.location.href = "login.html";
    }, 1000);
}