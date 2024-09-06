document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");
    errorDiv.style.display = "none";

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      console.log(token);

      console.log("Connexion réussie", data);
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Erreur:", error);
      errorDiv.textContent = "Erreur de connexion. Veuillez réessayer.";
      errorDiv.style.display = "block";
    }
  });
