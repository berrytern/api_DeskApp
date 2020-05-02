var FormData = require('form-data')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
req = new XMLHttpRequest
var formData = new FormData();
req.open("GET", "http://orse.cehop.se.gov.br/insumosargumento.asp?tarefa=consultar",true)
req.setRequestHeader('Content-Type','application/json')
req.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
formData.append("sltFOnte", '0');
formData.append("sltPeriodo", '2020-1-1');
formData.append("sltGrupoInsumo", '0');
formData.append("rdbCriterio", '1');
formData.append("txtDescricao", 'vidro');
formData.append("Submit", 'Consultar');
req.setRequestHeader('data',formData)
req.send(formData)
req.onload=()=>{
    console.log(req.responseText)
}