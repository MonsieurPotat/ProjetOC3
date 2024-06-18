
    const token = localStorage.getItem('authToken');
        if (token) {
            const adminBar = document.getElementById('admin-bar');
            const filters = document.querySelector('.filters');
            const login = document.getElementById('login');
            adminBar.style.display = 'block';
            filters.style.display = 'none';
            login.style.display = 'none';
            const navList = document.querySelector('nav ul')
            const logout = document.createElement('li');
            console.log(logout)
            logout.id='logout';
            console.log('logout')
            logout.textContent ='logout';
            navList.appendChild(logout);

                }
    const gallery = document.querySelector('.gallery');
    const filters = document.querySelector('.filters');

    function afficherprojet(data){
        data.forEach(project => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            img.src = project.imageUrl;
            img.alt = project.title;
            figcaption.textContent = project.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
            console.log(project);
        });
 
        
    }

    function afficherfiltre(categories,projects){
        categories.forEach(category =>{
            const licategory = document.createElement('li');

            licategory.textContent=category.name;
            
            filters.appendChild(licategory);

            licategory.addEventListener('click', function(){
                const categoryId = category.id;
                console.log('essaiconsole');
                const projetfiltre = projects.filter(function(project){
                    return project.categoryId === categoryId;
                })
                document.querySelector('.gallery').innerHTML='';
                afficherprojet(projetfiltre);

            });
        });
    }
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            afficherprojet(projects);

            fetch('http://localhost:5678/api/categories')
                .then(response => response.json())
                .then(filtre => {
                    const allCategory = document.createElement('li');
                    allCategory.textContent = 'Tous';
                    filters.appendChild(allCategory);
    
                    allCategory.addEventListener('click', function() {
                        gallery.innerHTML = '';
                        afficherprojet(projects);
            
                    })
                    afficherfiltre(filtre,projects);
                })
                .catch(error => console.error('Erreur lors du chargement des données :', error)); 
                });

    