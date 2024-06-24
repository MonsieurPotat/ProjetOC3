
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
            logout.id='logout';
            logout.textContent ='logout';
            navList.appendChild(logout);

            logout.addEventListener('click',function(){
                localStorage.removeItem('authToken');
                location.reload();
            })

            const portfolioHeader = document.querySelector('#titleportfolio');

            const editButton = document.createElement('button');
            editButton.id='editButton';
            editButton.textContent ='Modifier';

            portfolioHeader.appendChild(editButton);

            editButton.addEventListener('click',function(){
                const modal = document.getElementById('modal');
                modal.style.display = 'block';

                
                const addButton = document.createElement('button');
                addButton.id='addbutton';
                addButton.textContent='Ajouter un projet';
                modal.querySelector('.modal-content').appendChild(addButton);

                addButton.addEventListener('click', function() {
                    modal.style.display = 'none'; 
                    const modalAddProject = document.getElementById('modal-add-project');
                    modalAddProject.style.display = 'block'; 

                });
            });

        }
    const closeModalBtns = document.querySelectorAll('.close');

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = btn.closest('.modal');
            modal.style.display = 'none';
        });
    });
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('modal');
            const modalAddProject = document.getElementById('modal-add-project');
            
            if (event.target === modal) {
                modal.style.display = 'none';
            }
            if(event.target === modalAddProject){
                modalAddProject.style.display='none';
            }
        });


        function afficherProjetsDansModal(data) {
            const modalProjects = document.getElementById('modal-projects');
            modalProjects.innerHTML = '';
        
            data.forEach(project => {
                //const figure = document.createElement('figure');
                //const img = document.createElement('img');
                const templatedelete= document.querySelector('#templatedelete');
                const clone = document.importNode( templatedelete.content, true);
                console.log(clone);
                const modalimg = clone.querySelector('.modal-img');
    
                modalimg.src = project.imageUrl;
                modalimg.alt = project.title;
                //img.classList.add('modal-img');
        
                //figure.appendChild(img);
                modalProjects.appendChild(clone);
            });
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
            afficherProjetsDansModal(projects);

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

    