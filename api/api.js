const expres = require("express")
const cors = require("cors")
const fs = require("fs")
const jsonFile = require("./file.json")
const app = expres()
app.use(expres.json())
app.use(cors())
app.listen(8000)
app.get("/getJson",(req,res)=>{
    res.json(jsonFile)
})
app.post("/addJson",(req,res)=>{
    var obj =req.body
    jsonFile.push(obj)
    fs.writeFile("./file.json",JSON.stringify(jsonFile,null,2),'utf-8',(err)=>{
        if(err){
            console.log("TRAGEDIA")
        }
    })
    res.sendStatus(200).end()
})