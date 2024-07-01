
    const token = localStorage.getItem('authToken');
        if (token) {
            const adminBar = document.getElementById('admin-bar');
            const filters = document.querySelector('.filters');
            const login = document.getElementById('login');
            const modal = document.querySelector('#modal');
            const modalContent = document.querySelector('#modal .modal-content');

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
                const templateEdit =document.querySelector('#templateEdit');
                const cloneTemplateEdit = document.importNode(templateEdit.content, true);

                afficherProjetsDansModal(cloneTemplateEdit, JSON.parse(localStorage.getItem('projects')));
                const addButton = cloneTemplateEdit.querySelector('#addbutton');


                addButton.addEventListener('click',function() {
                    const addtemplate = document.querySelector('#addtemplate');
                    const cloneadd = document.importNode(addtemplate.content, true);
                    console.log(cloneadd.querySelector('#addProjectForm'));
                    const addForm = cloneadd.querySelector('#addProjectForm');

                    addForm.addEventListener('submit', function(event) {
                        event.preventDefault(); 
                
                       
                        const imageUrl = document.getElementById('imageUrl').files[0];
                        const title = document.getElementById('title').value;
                        const category = parseInt(document.getElementById('category').value);
                
                        const formData = new FormData();
                        formData.append('image', imageUrl);
                        formData.append('title', title);
                        formData.append('category', category);
                
                
                        fetch('http://localhost:5678/api/works', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                Authorization:"Bearer " + token
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Projet ajouté avec succès :', data);
                
                            addProjectForm.reset();
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'ajout du projet :', error);
                        });
                    }); 
                    modalContent.innerHTML='';
                    modalContent.appendChild(cloneadd);
                });
                modalContent.innerHTML ='';
                modalContent.appendChild(cloneTemplateEdit);
                modal.style.display = 'block';

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


        function afficherProjetsDansModal(modal,data) {
            const modalProjects = modal.getElementById('modal-projects');
            modalProjects.innerHTML = '';
        
            data.forEach(project => {
                const templatedelete= document.querySelector('#templatedelete');
                const clonedelete = document.importNode( templatedelete.content, true);
                const modalimg = clonedelete.querySelector('.modal-img');
    
                modalimg.src = project.imageUrl;
                modalimg.alt = project.title;
                modalProjects.appendChild(clonedelete);
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
            localStorage.setItem('projects',JSON.stringify(projects));
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

    