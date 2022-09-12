/* BIENVENIDA */

(async () => {

    let {value:pais} = await swal.fire({

        title: 'Bienvenido!',
        text: 'Selecciona tu pais',
        icon:'info',
        confirmButtonText: 'Seleccionar',
        footer: '*Esta informacion es importante!',
    
        input: 'select',
        inputPlaceholder: 'Pais',
        inputValue: '',
        inputOptions: {
            argentina: 'Argentina',
            brasil: 'Brasil',
            uruguay: 'Uruguay',
            paraguay: 'Paraguay',
        }
        
    });

    pais ? swal.fire({title: 'Excelente! \n Disfruta la experiencia'}) : swal.fire({title: 'No seleccionaste ningún país'}) 
    console.log(pais)

    localStorage.getItem(pais)

    localStorage.setItem('pais', pais)

})() 


const fecha = document.querySelector('.fecha')

const FECHA = new Date()
fecha.innerHTML = `${FECHA.toLocaleDateString('es-MX',{weekday:'long',month:'short',day:'numeric'})}.`

let username = localStorage.getItem("username");
let h1Bienvenida = document.querySelector('.title');


if (!username) {
    username = prompt("Inserte su nombre");
    localStorage.setItem("username", username);
}

h1Bienvenida.innerText = ('Hola, ' + username)

/*FETCH PARA RENDERIZAR ARTISTAS*/

let containter = document.querySelector('.container')

let article = ""
let svgs = []
let url = 'db.json'
let artistas = []

let resultadoFavoritos = document.querySelector('.listas');
let recuperoStorage = localStorage.getItem('favoritosStorage');
let favoritos = []

fetch(url)
    .then((response) => {
        return response.json()
    }) 
    .then(data =>{

        artistas = data 
        artistas.forEach(artista => {
            
            const {id, artist, imgSrc, title, album, duracion} = artista

            //imprimo la lista 
            containter.innerHTML += `<article class="box-song">

                                        <div>
                                            <img src="${imgSrc}" alt="Imagen de ${artist}" class="img-song">
                                        </div>
                                        <div class="descripcion"
                                            <p>${title}</p>
                                            <p>${artist}</p>
                                            <p>${album}</p>
                                            <p>${duracion}</p>
                                        </div>
                                        <div class="fav">

                                            <svg id="${id}" data-id="${artist}" class="${artist.like ? 'like' : 'unlike'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 352V96c0-35.3 28.7-64 64-64H416c35.3 0 64 28.7 64 64V293.5c0 17-6.7 33.3-18.7 45.3l-58.5 58.5c-12 12-28.3 18.7-45.3 18.7H160c-35.3 0-64-28.7-64-64zM272 128c-8.8 0-16 7.2-16 16v48H208c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V256h48c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H320V144c0-8.8-7.2-16-16-16H272zm24 336c13.3 0 24 10.7 24 24s-10.7 24-24 24H136C60.9 512 0 451.1 0 376V152c0-13.3 10.7-24 24-24s24 10.7 24 24l0 224c0 48.6 39.4 88 88 88H296z"</svg>

                                        </div>

                                    </article>`
        });

        //guarto los elementos del json (artistas) dentro del local
        localStorage.setItem('artistaListas',JSON.stringify(artistas)); 

        //agarro todos los svg
        svgs = document.querySelectorAll('svg'); 

        //recorro cada svg dandole un evento para llenar el storage con las canciones favoritas
        for(svg of svgs){
            svg.onclick = (e) => {
                
                let element = e.target.parentElement;

                let id = element.attributes.id.value;
                let track = artistas.find(e => e.id == id);
                console.log(track)
                if(favoritos.includes(track)){
                    artistas[track.id -1].like = false
                    console.log("Cancion repedita");
                    element.classList.remove('like');
                    
                    let trackASacar = favoritos.indexOf(track);
                    favoritos.splice(trackASacar,1);

                    let trackRepetido = document.querySelector(`#id-${track.id}`);

                    resultadoFavoritos.removeChild(trackRepetido); 

                }else{
                    console.log("no se repitio");
                    artistas[track.id -1].like = true
                    element.classList.add('like');

                    favoritos.push(track); 

                    resultadoFavoritos.innerHTML += `
                                        <article class="box-song" id="id-${track.id}" >
                                            <div>
                                                <img src="${track.imgSrc}" alt="Imagen de ${track.artist}" class="img-song">
                                                <div class="descripcion">
                                                    <p>${track.title}</p>
                                                    <p>${track.artist}</p>
                                                </div>  
                                            </div>
                                        </article>`

                }
                
                
                localStorage.setItem('favoritosStorage',JSON.stringify(favoritos));
            }
            
        }
        
    })
    .catch(error => console.log('Ha ocurrido un error....'))

//ver si hay algo dentro del storage 

if(recuperoStorage != null ){
    favoritos = JSON.parse(recuperoStorage);
    console.log(favoritos) 

    favoritos.map(favorito => {
        let idFav = favorito.id
        /* favoritos[idFav - 1].like = true  */

        resultadoFavoritos.innerHTML += `
                <article class="box-song asdddd" id="id-${favorito.id}" >
                    <div>
                        <img src="${favorito.imgSrc}" alt="Imagen de ${favorito.artist}" class="img-song">
                        <div class="descripcion like">
                            <p>${favorito.title}</p>
                            <p>${favorito.artist}</p>
                        </div>  
                    </div>
                </article> `

        console.log(favoritos[idFav - 1]) 
    }) 

    
} 

resultadoFavoritos.appendChild(addDeleteBtn())

//funcion para eliminar la lista de reproducción

function addDeleteBtn() {
    let deleteBtn = document.createElement("button");
  
    deleteBtn.textContent = "Eliminar lista de reproducción";
    deleteBtn.className = "btn-delete";
  
    deleteBtn.addEventListener("click", (e) => {
        console.log(e)
        const item = e.path[1];
        resultadoFavoritos.remove(item);
        
        /* swal.fire({

            title: 'Eliminaste la lista de reproducción!',
            text: 'Por favor, recargar la pagina antes de volver a añadir canciones a la lista'
        }) */
        
        Swal.fire({
            title: 'Eliminaste la lista de reproducción!',
            html: 'Por favor, recargar la pagina antes de volver a añadir canciones a la lista',
            html: 'Este aviso desaparecera en <b></b> milisegundos. \n Por favor, recargar la pagina antes de volver a añadir canciones a la lista',
            timer: 4000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          })

        localStorage.removeItem('favoritosStorage', favoritos )
    });

    let items = document.querySelector('.asdddd')
    if (items.length = 0) {
        deleteBtn.style.display = none
    }
    return deleteBtn;
}

/* :) */
