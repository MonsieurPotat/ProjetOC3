document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); //Ecoute de l'appui sur le bouton
    
    const email = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'none';
    //Récupération des différents éléments du form et le message d'erreur
    
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
    //Try pour essayer de gérer les potentielles erreurs
        });
        

        if (!response.ok) {
            throw new Error('Erreur de connexion');
        }

        const data = await response.json();
        const token= data.token;
        localStorage.setItem('authToken',token);
        console.log(token);
        
        // Gestion de la connexion réussie (par exemple, redirection)
        console.log('Connexion réussie', data);
        window.location.href = '/index.html';  // Remplacez cette ligne par la page de redirection appropriée

    } catch (error) {
        console.error('Erreur:', error);
        errorDiv.textContent = 'Erreur de connexion. Veuillez réessayer.';
        errorDiv.style.display = 'block';
    }
});