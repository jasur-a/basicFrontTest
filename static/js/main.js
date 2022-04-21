/*General Var*/
var articles_list = document.querySelector('#articles-list');
var count = document.querySelector('#count');
var formNew = document.querySelector("#FormNew");
var formEdit = document.querySelector("#FormEdit");
var formLogin = document.querySelector("#login");
var path = location.pathname

var modalNew = document.getElementById('Modal-New') && new bootstrap.Modal(document.getElementById('Modal-New'));
var modalEdit = document.getElementById('Modal-Edit') && new bootstrap.Modal(document.getElementById('Modal-Edit'));

var baseURL = 'http://localhost:3000/'
const SESSION = sessionStorage.getItem("sess");


const api = async ( method, url = "" , payload = {} ) => (
    fetch(baseURL+url,{
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(data => data.json())
    .catch((e) => {
        console.error(`Error: ${e}`);
        return false;
    })
)

const apiGET = async ( url = "" ) => (
    fetch(baseURL+url)
    .then(data => data.json())
    .catch((e) => {
        console.error(`Error: ${e}`);
        return false;
    })
)


function events(){
    if (formNew)
        formNew.addEventListener("submit", function(e){
            register(e);
        });
    if (formEdit)
        formEdit.addEventListener("submit", function(e){
            edit(e)
        });

    if (formLogin)
        formLogin.addEventListener("submit", function(e){
            login(e)
        });
}


// Actions

function login(e) {
    e.preventDefault();
    var data = new FormData(formLogin);
    var user = data.get('user');
    var pass = data.get('pass');

    if(user === '' || pass === ''){
        alertsForm({'id': 'login' , 'msj': 'Todos los campos son obligatorios ', 'alert': 'danger'});
        return false;
    }else{

        try{
            apiGET( `users?user=${user}&pass=${pass}`)
            .then((data) => {
                if(data.length > 0 ){
                    sessionStorage.setItem("sess", true)
                    path = path.split("login")[0]
                    location.replace(`${path}index.html`)
                } else {
                    alertsForm({'id': 'login' , 'msj': 'Uno de los datos es erroneo', 'alert': 'danger'});
                }
              })
        }catch(e){
            notif({'msj': 'Lo sentimos, hubo un error, por favor intentelo más tarde!', 'notif': 'danger'})
        }

    }
}


const articles = data => {
    for(let i of data){
        articles_list.innerHTML += `
            <div class=" "  >
                <div class="card"  data-id="${ i.id }" >
                    <div class="card-body">
                        <p class="card-text">${ i.name }</p>
                        <p class="card-text">Total: <span>${ i.total }</span></p>
                        <div class="action">
                            <a href="#" class="btn btn-outline-secondary btn-sm" onClick="(remove(${ i.id }))">Eliminar</a>
                            <a href="#" class="btn btn-info btn-sm edit" onClick="(callEdit(${ i.id }))" >Editar</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

/*General enquiry of all items to the api*/
function list(){
    try{
        apiGET( `products`)
        .then((dataJson) => {
            if(dataJson.length > 0 ){
                articles(dataJson);
            }else{
                articles_list.innerHTML += `
                <div class="col no-items"  >
                    <h4>No existen Items, cree uno por favor!</h4>
                </div>`;
            }
            })
    }catch(e){
        console.error(`:: Hubo un error, ${e}`)
        notif({'msj': 'Lo sentimos, en este momento no se pueden cargar los articulos, por favor intentelo más tarde!', 'notif': 'danger'})
    }
}

/*General enquiry of all items to the api*/
function register(e){
    e.preventDefault();
    var data = new FormData(formNew);
    var name = data.get('name');
    var total = data.get('total');

    if(name === '' || total === ''){

        alertsForm({'id': 'FormNew' , 'msj': 'Todos los campos son obligatorios ', 'alert': 'danger'});
        return false;

    }else{

        try{
            var payload = { name, total }
            api( "GET", `products`, payload)
            .then((dataJson) => {
                if( dataJson?.id ){
                    articles([dataJson]);
                    modalNew.hide();
                }else{
                    notif({'msj': 'Lo sentimos, no se pudo crear el producto, por favor intentelo de nuevo más tarde!', 'notif': 'danger'})
                }
            })
        }catch(e){
            console.error(`:: Hubo un error, ${e}`)
            notif({'msj': 'Lo sentimos, no se pudo crear el producto, por favor intentelo más tarde!', 'notif': 'danger'})
        }

    }
}

/* We consult the data and fill out the form to be added*/
function callEdit(id){
    try{
        apiGET( `products/${id}`)
        .then((dataJson) => {
            if(Object.keys(dataJson).length > 0){
                modalEdit.show();
                formEdit.querySelector("#name").value = dataJson.name;
                formEdit.querySelector("#total").value = dataJson.total;
                formEdit.querySelector("#id").value = dataJson.id;
            }
        })
    }catch(e){
        console.error(`:: Hubo un error, ${e}`)
        notif({'msj': 'Lo sentimos, hubo un error, por favor intentelo más tarde!', 'notif': 'danger'})
    }
};


/*Edit Item*/
function edit(e){
    e.preventDefault();
    var data = new FormData(formEdit);
    var name = data.get('name');
    var total = data.get('total');
    var id = data.get('id');

    if(name === '' || total === ''){
        alertsForm({'id': 'FormNew' , 'msj': 'Todos los campos son obligatorios ', 'alert': 'danger'});
        return false;
    }else{
        try{
            var payload = { name, total , id}
            api( "PUTS",  `product/${id}`, payload)
            .then((dataJson) => {
                if( dataJson?.id ){
                    let dom = document.querySelector('[data-id="'+id +'"]');
                    dom = dom.children[0].children;
                    modalEdit.hide();
                    dom[0].innerHTML = dataJson.name
                    dom[1].children[0].innerHTML = dataJson.total
                }else{
                    notif({'msj': 'Lo sentimos, no se pudo Editar el producto, por favor intentelo de nuevo más tarde!', 'notif': 'danger'})
                }
            })
        }catch(e){
            console.error(`:: Hubo un error, ${e}`)
            notif({'msj': 'Lo sentimos, no se pudo Editar el producto, por favor intentelo más tarde!', 'notif': 'danger'})
        }
    }

}

/*Delete Items*/
function remove(id){
    try{
        api("DELETE", `products/${id + 1}`)
        .then((dataJson) => {
            document.querySelector('[data-id="'+id +'"]').parentElement.remove();
        })
    }catch(e){
        console.error(`:: Hubo un error, ${e}`)
        notif({'msj': 'Lo sentimos, hubo un error, por favor intentelo más tarde!', 'notif': 'danger'})
    }
}


/* print alerts
    {'id': 'FormEdit' , 'msj': 'message', 'alert': 'danger'}
*/
const alertsForm = data =>{
    document.querySelector("#"+data.id+" .alerts").innerHTML = `
        <div class="alert alert-${data.alert}" role="alert">
            ${data.msj}
        </div>
    `;
};

/* clear alerts
*/
const clearAlertsForm = id => {
    document.querySelector("#"+id+" .alerts").innerHTML = '';
}

/* print notif
    { 'msj': 'message', 'notif': 'danger'}
*/

const notif = data => {
    document.querySelector(".alert.notif").innerHTML = `
        <div class="alert alert-${data.notif}" role="alert">
            ${data.msj}
            <a href="#" class="btn btn-${data.notif} btn-sm" onClick="(clearNotif())" id="${data.notif}">x</a>
        </div>
    `;
    setTimeout(() => {
        clearNotif();
    }, 10000);
}

 /* clear notif
*/
const clearNotif = _ =>{
    document.querySelector(".notif").innerHTML = '';
};


const init = (function(e){

    events();
    if(!SESSION || SESSION === "false"){
        sessionStorage.setItem("sess", false)
        if (path.indexOf("login") === -1)
            location.replace("./login/index.html")
    }
    else{
        if (path.indexOf("login") !== -1)
            path = path.split("login")[0]
            location.replace(`${path}index.html`)
    }

    if (path.indexOf("login") === -1 && SESSION === "true")
        list();

})();