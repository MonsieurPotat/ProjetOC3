
    //Si login alors, barre admin apparait, login disparait/logout apparait
    const token = localStorage.getItem('authToken');
        if (token) {
            const adminBar = document.getElementById('adminBar');
            const filters = document.querySelector('.filters');
            const login = document.getElementById('login');
            const logout = document.getElementById('logout');

            adminBar.style.display = 'block';
            filters.style.display = 'none';
            login.style.display = 'none';
            logout.style.display = 'block';

            logout.addEventListener('click',function(){
                localStorage.removeItem('authToken');
                location.reload();

            })
            
            //Création bouton modifier
            const portfolioHeader = document.querySelector('#titleportfolio');
            const editButton = document.createElement('button');
            editButton.id='editButton';
            const icon = document.createElement('i');
            icon.className = 'fa-regular fa-pen-to-square';
            editButton.appendChild(icon);
            editButton.appendChild(document.createTextNode(' Modifier '));

            portfolioHeader.appendChild(editButton);
            
            //Quand click sur bouton modifier alors clonage du template "templateEdit" qui ajoute la modale
            editButton.addEventListener('click',function(){
                creermodal();
            });


        }
    const closeModalBtns = document.querySelectorAll('.close');

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = btn.closest('.modal');
            modal.style.display = 'none';
        });
    });
        //Cliquer à côté permet de faire disparaitre la modale
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('modal');
            const modalAddProject = document.getElementById('modalAddProject');
            
            if (event.target === modal) {
                modal.style.display = 'none';
            }
            if(event.target === modalAddProject){
                modalAddProject.style.display='none';
            }
        });
        //Fait apparaitre la modal avec les différentes images
        function afficherProjetsDansModal(modal,data) {
            const modalProjects = modal.getElementById('modalProjects');
            modalProjects.innerHTML = '';
        
            data.forEach(project => {
                const templateDelete= document.querySelector('#templateDelete');
                const cloneDelete = document.importNode( templateDelete.content, true);
                const modalImg = cloneDelete.querySelector('.modalImg');
                const deleteButton = cloneDelete.querySelector('.delete');
        //Génération de l'image et de son titre puis clic pour enlever image
                modalImg.src = project.imageUrl; 
                modalImg.alt = project.title;
                deleteButton.addEventListener('click',function(){
                    fetch(`http://localhost:5678/api/works/${project.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    .then(response =>{
                        if (response.ok){
                            console.log('Projet supprimé avec succès');
                            let projects = JSON.parse(localStorage.getItem('projects')) || [];
                            projects=projects.filter(prjct => prjct.id !== project.id);
                            localStorage.setItem('projects',JSON.stringify(projects));
                            deleteButton.closest('.figureDelete').remove();
                            afficherprojet(projects);
                        } else {
                            console.log("Erreur lors de la suppression");
                        }
                    })
                })
                modalProjects.appendChild(cloneDelete);

            });
        }

    const gallery = document.querySelector('.gallery');
    const filters = document.querySelector('.filters');
        //Génère les images sur la page index, pas la modal
        function afficherprojet(data){
            gallery.innerHTML='';
            data.forEach(project => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const figCaption = document.createElement('figCaption');

                img.src = project.imageUrl;
                img.alt = project.title;
                figCaption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(figCaption);
                gallery.appendChild(figure);
                console.log(project);
        });
 
        
    }
    //Créeer les boutons filtres (chaque id = un nom)
    function afficherfiltre(categories,projects){
        categories.forEach(category =>{
            const licategory = document.createElement('li');

            licategory.textContent=category.name;
            
            filters.appendChild(licategory);

            licategory.addEventListener('click', function(){
                const categoryId = category.id;
                console.log('essaiconsole');
                const projetFiltre = projects.filter(function(project){
                    return project.categoryId === categoryId;
                })
                document.querySelector('.gallery').innerHTML='';
                afficherprojet(projetFiltre);

            });
        });
    }
    //Fetch pour récupérer les infos 
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
    
    //Création de la modale formulaire  
    function creerformulaire () {

        const addTemplate = document.querySelector('#addTemplate');
        const cloneAdd = document.importNode(addTemplate.content, true);
        console.log(cloneAdd.querySelector('#addProjectForm'));
        const addForm = cloneAdd.querySelector('#addProjectForm');
        const modalContent = document.querySelector('#modal .modalContent');
        var imageUrl = cloneAdd.getElementById('imageUrl');
        imageUrl.addEventListener('change', function(event) {
            const faImage = document.getElementById("faImage");
            faImage.style.display='none';
            const previewImg = document.querySelector('#previewImg');
            previewImg.src=URL.createObjectURL(event.target.files[0]);
            previewImg.style.display='block';
            previewImg.onload = function (){
                URL.revokeObjectURL(previewImg.src)
                }
            })
            
    addForm.addEventListener('submit', function(event) {
                event.preventDefault(); 
        
               
        const imageUrl = document.getElementById('imageUrl').files[0];
        const title = document.getElementById('title').value;
        const category = parseInt(document.getElementById('category').value);
        const faImage = document.getElementById("faImage");
        const previewImg = document.querySelector('#previewImg');
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
                faImage.style.display='block';
                previewImg.style.display='none';
                let projects =JSON.parse(localStorage.getItem('projects'));
                projects.push(data);
                localStorage.setItem('projects',JSON.stringify(projects));
                afficherprojet(projects);
                })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du projet :', error);
                });
            }); 
            modalContent.innerHTML='';
            const retarr = cloneAdd.querySelector('.retour');
            retarr.addEventListener('click',function(){
                creermodal ();
            })        
            modalContent.appendChild(cloneAdd);
        };

        //
        function creermodal () {
            const modalContent = document.querySelector('#modal .modalContent');
            const templateEdit =document.querySelector('#templateEdit');
            const cloneTemplateEdit = document.importNode(templateEdit.content, true);
            console.log('créer modale ne fonctionne pas');

            //Afficher projet dans la modale
            afficherProjetsDansModal(cloneTemplateEdit, JSON.parse(localStorage.getItem('projects')));
            const addButton = cloneTemplateEdit.querySelector('#addButton');
            console.log("afficher projet dans modal ne fonctionne pas");

            //Ajouter form
            addButton.addEventListener('click',function() {
                creerformulaire();

            })
            modalContent.innerHTML ='';
            modalContent.appendChild(cloneTemplateEdit);
            modal.style.display = 'block';
            console.log("créer formulaire ne fonctionne pas")

        }