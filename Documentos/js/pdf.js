var documento = DefaultObj();
var estadosCivis = [
    {
        pronome: "o",
        estados: [{
            "name": "c",
            "value": "Casado"
        }, {
            "name": "v",
            "value": "Viúvo"
        }, {
            "name": "s",
            "value": "Solteiro"
        }, {
            "name": "d",
            "value": "Divorciado"   
        }, {
            "name": "u",
            "value": "União Estável" 
        }]
    },
    {
        pronome: "x",
        estados: [{
            "name": "c",
            "value": "Casado"
        }, {
            "name": "v",
            "value": "Viúvo"
        }, {
            "name": "s",
            "value": "Solteiro"
        }, {
            "name": "d",
            "value": "Divorciado"   
        }, {
            "name": "u",
            "value": "União Estável" 
        }]
    },
    {
        pronome: "a",
        estados: [{
            "name": "c",
            "value": "Casada"
        }, {
            "name": "v",
            "value": "Viúva"
        }, {
            "name": "s",
            "value": "Solteira"
        }, {
            "name": "d",
            "value": "Divorciada"
        },{
            "name": "u",
            "value": "União Estável" 
        }]
    }];


function SetDateInput(input, date) {
    $("#" + input).val(date.toISOString().split("T")[0]);
}


function TitleCase(str) {
    var splitStr = str.toLowerCase().split(' ');

    for (var i = 0; i < splitStr.length; i++) {

        if(splitStr[i].length > 1)
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    
    return splitStr.join(' ');
}

function GetEstadoCivilStr(estadoCivil, pronome) {
    return estadosCivis.filter(f => f.pronome == pronome)[0].estados.filter(f => f.name == estadoCivil)[0].value;
    
}

function DefaultObj() {
    return {
        "nomeDoTitular": "",
        "telefoneT": "",
        "endereço": "",
        "n": "",
        "cep":"",
        "bairro":"",
        "referencia":"",
        "rgT":"",
        "orgaoEmissorT":"",
        "ufT":"",
        "cpfT":"",
        "sexo":"o",
        "estadoCivil":"c",
        "profissaoT":"",
        "matricula":"",
        "negativa":"",
        "tipo":"i",

        "nomeConjuge":"",
        "dataNas":"",
        "rgC":"",
        "orgaoEmissorC":"",
        "ufC":"",
        "cpfC":"",
        "telefoneC":"",
        "profissaoC":"",
        
    }
}


function AtualizarDocumento(documento) {
    $("#nomeDoTitularSpan").text(documento.nomeDoTitular);
    $("#telefoneTSpan").text(documento.telefoneT);
    $("#estadoCivilSpan").text(GetEstadoCivilStr(documento.estadoCivil, documento.sexo));
    $("#endereçoSpan").text(documento.endereço);
    $("#nSpan").text(documento.n);
    $("#cepSpan").text(documento.cep);
    $("#bairroSpan").text(documento.bairro);
    $("#referenciaSpan").text(documento.referencia);
    $("#rgTSpan").text(documento.rgT);
    $("#rgTASpan").text(documento.rgT);
    $("#rgTA2Span").text(documento.rgT);
    $("#orgaoEmissorTSpan").text(documento.orgaoEmissorT);
    $("#ufTSpan").text(documento.ufT);
    $("#cpfTSpan").text(documento.cpfT);
    $("#sexoSpan").text(documento.sexo);
    $("#profissaoTSpan").text(documento.profissaoT);
    $("#matriculaSpan").text(documento.matricula);
    $("#negativaSpan").text(documento.negativa);
    $("#tipoSpan").text(documento.tipo);


    $("#nomeConjugeSpan").text(documento.nomeConjuge);
    $("#dataNasSpan").text(documento.dataNas);
    $("#rgCSpan").text(documento.rgC);
    $("#rgCASpan").text(documento.rgC);
    $("#orgaoEmissorCSpan").text(documento.orgaoEmissorC);
    $("#ufCSpan").text(documento.ufC);
    $("#cpfCSpan").text(documento.cpfC);
    $("#telefoneCSpan").text(documento.telefoneC);
    $("#profissaoCSpan").text(documento.profissaoC);


//repetidos
    $("#nomeDoTitularTab").text(documento.nomeDoTitular);
    $("#endereçoTab").text(documento.endereço);
    $("#nTab").text(documento.n);
    $("#cepTab").text(documento.cep);
    $("#bairroTab").text(documento.bairro);
    $("#cpfTTab").text(documento.cpfT);
    $("#rgTab").text(documento.rgT);

    //Sexo
    XSpan("sexo");
    XSpan("tipo");
    XSpan("estadoCivil");
    AtualizarTitulo();
}

function XSpan(name)
{
    $(`.${name}X`).text(' ');
    $(`#${name}X_${documento[name]}`).text("X");
}



