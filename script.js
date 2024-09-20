// help functions

function get(str){
    const el =document.querySelector(str)
    return el.value.trim()
}

// global variables

var newObject ={
    imie:"",
    nazwisko:"",
    dept:"",
    delegacje:{
        
    }
}
const kontener = document.querySelector(".container")
const getButton = document.querySelector(".b1")
const addButton = document.querySelector(".b2")
const createUser = document.querySelector(".b3")
const addDelegacja = document.querySelector(".b4")
const closeWindow = document.querySelectorAll(".x")
const popUpWindow = document.querySelectorAll(".addWindow")
const warning = document.querySelectorAll(".warn")
const error = document.querySelector(".alert")
var heads;
var content;

// html layout creator funtions

function createRows(obj){
    for(var x=0;x<obj.length;x++){
        var div = "<div class='row'> <div class='col-lg-3 head'></div><div class=' content col-lg-9'></div></div>"
        kontener.innerHTML+=div
    }
    heads= document.querySelectorAll(".head")
    content= document.querySelectorAll(".content")
    createSchema(obj)
}
function headDiv({imie,nazwisko,dept},index){
    var schema = `<div class="card text-bg-dark" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${imie} ${nazwisko}</h5>
        <h6 class="card-subtitle mb-2 ">Dział: ${dept}</h6>
    </div>
    </div>`
    heads[index].innerHTML+=schema
}
function contentDiv(arr,index){
    for(var x=0;x<arr.length;x++){
        const {data_w,m_docelowe,nr_rej,dystans,stawka}=arr[x]
        var stawkaValue = (dystans.reduce((prev,item)=>{
            return prev+parseInt(item)
        },0))*stawka
        var schema =`<div class="card text-bg-dark mb-3" style="max-width: 18rem;">
            <div class="card-header">Delegacja nr. ${x+1} </div>
            <div class="card-body">
                <h4 class="card-title">Data: ${data_w} </h4>
                <h4 class="card-title">Kierunek: ${m_docelowe} </h4>
                <p class="card-text mt-3">Pojazd służbowy:${nr_rej}</p>
                <p class="card-text">Stawka za delegacje ${stawkaValue.toFixed(2)}</p>
            </div>
            </div>`
        
        content[index].innerHTML+=schema
    }
}
function createSchema(obj){
    for(var x=0;x<obj.length;x++){
        headDiv(obj[x],x)
        var values = Object.values(obj[x].delegacje)
        contentDiv(values,x)
    }

}

// api calls

async function postdata(){
    try{
        await fetch("http://localhost:8000/addJson",{
            headers:{
                "Content-type":"application/json"
            },
            method:"POST",
            body:JSON.stringify(newObject)
        })
    }catch(err){
        error.style.setProperty("display","block")
        setTimeout(() => {
            error.style.setProperty("display","none")
        }, 2000);
    }
}
async function getData(){
    try{
        const request = await fetch("http://localhost:8000/getJson",{
            headers:{
                "Content-type":"application/json"
            },
            method:"GET"
        })
        const response = await request.json()
        createRows(response)
    }catch(err){
        error.style.setProperty("display","block")
        setTimeout(() => {
            error.style.setProperty("display","none")
        }, 2000);
    }
}

//button actions

getButton.addEventListener('click',()=>{
    kontener.innerHTML=""
    getData()
})

addButton.addEventListener("click",()=>{
    popUpWindow[0].style.setProperty("display","flex")
})

closeWindow.forEach((e,key)=>{
    e.addEventListener("click",()=>{
        popUpWindow[key].style.setProperty("display","none")
        document.querySelectorAll("input").forEach(e=>{
            e.value=""
        })
    })
})

createUser.addEventListener("click",()=>{
    warning[0].style.setProperty("visibility","hidden")
    warning[0].textContent="Wypełnij wszystkie pola"
    if(get(".dane").length==0){
        warning[0].style.setProperty("visibility","visible")
        return 0;
    }
    if(get(".delegacjeNumber").length==0){
        warning[0].style.setProperty("visibility","visible")
        return 0
    }
    if(get(".dzial").length==0){
        warning[0].style.setProperty("visibility","visible")
        return 0
    }
    if(parseInt(get(".delegacjeNumber"))<1||parseInt(get(".delegacjeNumber"))>5){
        warning[0].style.setProperty("visibility","visible")
        warning[0].textContent="Zły zakres numeru delegacji (1-5)"
        return 0
    }
    popUpWindow[0].style.setProperty("display","none")
    popUpWindow[1].style.setProperty("display","flex")
    var dane = get('.dane').split(" ")
    newObject.imie = dane[0]
    newObject.nazwisko = dane[1]
    newObject.dept = get(".dzial")
})

addDelegacja.addEventListener('click',()=>{
    warning[1].style.setProperty("visibility","hidden")
    warning[1].textContent="Wypełnij wszystkie pola"
    var currentNumber = parseInt(addDelegacja.textContent[addDelegacja.textContent.length-1])
    var delegacjeNumber = parseInt(get(".delegacjeNumber"))
    var arrDystansStr = get(".dystans").includes(",")?get(".dystans").split(","):get(".dystans").split(".")
    var arrDystansNr= arrDystansStr.map(Number);
    if(get(".data").length==0){
        warning[1].style.setProperty("visibility","visible")
        return 0
    }
    if(get(".cel").length==0){
        warning[1].style.setProperty("visibility","visible")
        return 0    
    }
    if(get(".rejestracja").length==0){
        warning[1].style.setProperty("visibility","visible")
        return 0    
    }
    if(get(".dystans").length==0){
        warning[1].style.setProperty("visibility","visible")
        return 0    
    }
    if(get(".stawka").length==0){
        warning[1].style.setProperty("visibility","visible")
        return 0    
    }
    if(parseFloat(get(".stawka"))<0.5|| parseFloat(get(".stawka"))>2){
        warning[1].style.setProperty("visibility","visible")
        warning[1].textContent="Nieprawidłowa liczba stawki (0.5 - 2)"
        return 0    
    }
    if(arrDystansNr.length!==2||!arrDystansNr.every(Number.isFinite)){
        warning[1].style.setProperty("visibility","visible")
        warning[1].textContent="Pole dystans zawiera tekst"
        return 0    
    }
        addDelegacja.textContent=`Add delegacja ${currentNumber+1}`
            newObject.delegacje[`del_${currentNumber}`]={
                data_w:get(".data"),
                m_docelowe:get(".cel"),
                nr_rej:get(".rejestracja"),
                dystans:arrDystansNr,
                stawka:parseFloat(get(".stawka")),
            }
            document.querySelectorAll(".form2 input").forEach(e=>{
                e.value=""
            })
            if(currentNumber==delegacjeNumber){
                document.querySelectorAll("input").forEach(e=>{
                    e.value=""
                })
                postdata()
                popUpWindow[1].style.setProperty("display","none")
            }
})