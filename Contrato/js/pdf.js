var BASE64_MARKER = ';base64,';
var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';
var orcamento = {};
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
        }]
    }];


function FixPDFTxt(str) {
    str = str.trim();
    str = str.replace("( ", "(");
    str = str.replace(" )", ")");
    str = str.replace("SOL AR", "SOLAR");
    str = str.replace("PRET O", "PRETO");
    str = str.replace("CONECT OR", "CONECTOR");
    str = str.replace("SUPOR TE", "SUPORTE");
    str = str.replace("JUNCA O", "JUNCAO");
    str = str.replace("EMEND A", "EMENDA");
    str = str.replace("  ", " ");

    return str;
}

function RealToNumber(real) {
    return Number(real.replace("R$ ", ""));
}

function RealParaNumero(valor) {
    return Number(valor.replace("R$ ", ""));
}


function SetDateInput(input, date) {
    $("#" + input).val(date.toISOString().split("T")[0]);
}

function TrocarCidade(novaCidade) {
    $("#cidade").val(novaCidade);
    orcamento.cidade = novaCidade;
}

function AtualizarRepresentante(representante) {
    if (representante != '' && representante != null) {
        orcamento.representante = representante;

        if (representante == 'Roseli Borchert') {
            TrocarCidade("Itaipulândia");
        }
    }
    else {
        orcamento.representante = null;
    }

    AtualizarOrcamento(orcamento);
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
        "forncedorGuid": "Bedin",
        "fornecedor": "BEDIN SOLAR",
        "cliente": "",
        "nacionalidade": "brasileiro",
        "estadoCivil": "c",
        "documento": "",
        "cep": "",
        "pronomeTratamento": "o",
        "representante": null,
        "cidade": "",

        "dataOrcamento": new Date(),
        "validade": new Date("0001-01-01"),
        "telhado": "tipo de telha",

        "numeroPlacas": 0,
        "potenciaPlacas": "0",
        "potenciaPico": 0,
        "geracaoMensal": 0,

        "valorCotacao": 0,
        "valorMaoDeObra": 0,
        "valorOrcamento": 0,
        "items": [
        ],
        "financiamento": [
        ]
    }
}

function IptRefresh(input, data) {
    $("#" + input + "Span").text(data[input]);
}

function AtualizarOrcamento(orcamento) {
    $("#clienteSpan").text(orcamento.cliente);
    $("#nacionalidadeSpan").text(orcamento.nacionalidade);
    $("#estadoCivilSpan").text(GetEstadoCivilStr(orcamento.estadoCivil, orcamento.pronomeTratamento));
    $("#documentoSpan").text(orcamento.documento);
    $("#cidadeSpan").text(orcamento.cidade);
    $("#cepSpan").text(orcamento.cep);
    $("#valorNumerico").text(orcamento.valorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));
    $("#valorPorExtenso").text(TitleCase(ValorPorExtensoReal(orcamento.valorOrcamento)));
    $("#valorNumerico1").text(orcamento.valorCotacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));
    $("#valorPorExtenso1").text(TitleCase(ValorPorExtensoReal(orcamento.valorCotacao)));
    $("#valorNumerico2").text(orcamento.valorMaoDeObra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));
    $("#valorPorExtenso2").text(TitleCase(ValorPorExtensoReal(orcamento.valorMaoDeObra)));
    $("#valorNumerico3").text(orcamento.valorMaoDeObra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));

    if (orcamento.forncedorGuid == "Bedin") {
        $("#bedin1").show();
        $("#foco1").hide();
   }
   else {
    $("#foco1").show();
    $("#bedin1").hide();
    
   }

    //Fornecedor
    $("#fornecedorSpan").text(orcamento.fornecedor.toUpperCase());

    $(".fornecedorBancario").hide();
    $("#bancario" + orcamento.forncedorGuid).show();

    //Tabela de Items
    $("#itemsViewBody1").empty();    

    //Tabela de Items
    orcamento.items.forEach((v) => {
        let tr = $("<tr style='border:1px solid black;'></tr>");

        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.quantidade + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.item + '</td>');
        tr.append('<td style="padding-left:10px;text-align:center">' + v.modelo + '</td>');

        $("#itemsViewBody1").append(tr);        
    });

    //Pagina 2
    IptRefresh("numeroPlacas", orcamento);
    $("#potenciaPlacasSpan").text(orcamento.potenciaPlacas.toUpperCase().replace("W", "").replace("P", ""));
    $("#geracaoMensalSpan").text(orcamento.geracaoMensal.toLocaleString());
    $("#valorOrcamentoSpan").text(orcamento.valorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));
    $("#valorExtensoSpan").text(TitleCase(ValorPorExtensoReal(orcamento.valorOrcamento)));

    //Pagina 5
    $("#validade2Span").text(new Date(orcamento.validade).toLocaleDateString());
    $("#clienteFirmaSpan").text(orcamento.cliente);

    //Data
    $("#dataContratoSpan").text(new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));

    AtualizarTitulo();
}

function AtualizarItems(orcamento) {
    $("#itemsViewBody").empty();    

    //Tabela de Items
    orcamento.items.forEach((v) => {
        let tr = $("<tr style='border:1px solid black;'></tr>");

        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.quantidade + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.item + '</td>');
        tr.append('<td style="padding-left:10px;text-align:center">' + v.modelo + '</td>');

        $("#itemsViewBody").append(tr);        
    });

   

    $("#valorCotacaoViewSpan").text(orcamento.valorCotacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));

}

function AtualizarFinanciamento(orcamento) {
    //financiamento
    if (orcamento.financiamento.length == 0) {
        $("#FinanciamentoViewDiv").hide();
    }
    else {
        $("#FinanciamentoViewDiv").show();
        $("#financiamentoViewTable").empty();

        orcamento.financiamento.forEach((v) => {

            let tr = $("<tr></tr>");

            tr.append('<td width="30%">&nbsp;</td>');
            tr.append('<td width="40%" align=center style="border:1px solid black;"><b><span style="color:#dc146a;">' + v.parcelas + ' parcelas</span> de R$ ' + v.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td>');
            tr.append('<td width="30%">&nbsp;</td>');

            $("#financiamentoViewTable").append(tr);
        });
    }
}

function PreencherCampos(d, completo) {

    //Importação
    if (completo) {

        $("#cliente").val(d.cliente);
        TrocarCidade(d.cidade);
        $("#documento").val(d.documento);
        $("#pronomeTratamento").val(d.pronomeTratamento);
        $("#nacionalidade").val(d.nacionalidade);
        $("#estadoCivil").val(d.estadoCivil);
        $("#cep").val(d.cep);
        //SetDateInput("dataOrcamento", d.dataOrcamento);
    }

    //Numeros
    $("#valorCotacao").val(d.valorCotacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorMaoDeObra").val(d.valorMaoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorOrcamento").val(d.valorOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));

}

function ExtractData(pageTxt) {
    orcamento = DefaultObj();
    console.log(pageTxt);

    //Cliente/Cidade
    if (pageTxt.includes("Cliente:")) {

        let cliente = pageTxt.substring(
            pageTxt.indexOf("Cliente:") + 8,
            pageTxt.indexOf(";"));

        cliente = cliente.trim();
        orcamento.cliente = cliente;

        //Cidade
        let cidade = pageTxt.substring(
            pageTxt.indexOf("Cliente:") + 8,
            pageTxt.indexOf(","));

        cidade = cidade.substring(
            cidade.indexOf(";") + 1,
            cidade.indexOf("-"),
        );

        cidade = cidade.trim();
        orcamento.cidade = cidade;

    }
    else {
        console.log('Erro ao tentar capturar o cliente');
    }

    
    //Valor Cotacao
    if (pageTxt.includes("T O T AL:")) {

        let total = pageTxt.substring(
            pageTxt.indexOf("T O T AL:") + 9,
            pageTxt.indexOf(";"));

        //console.log(total);

        total = total.replace("R$", "");
        total = total.replace(".", "");
        total = total.replace(",", ".");
        total = total.replace(/(\S\))/gm, "");
        total = total.trim();        

        let value = Number(total);
        orcamento.valorCotacao = value;
    }
    else {
        console.log('Erro ao tentar capturar os valores');
    }

    //Valor Mao de Obra
    if (pageTxt.includes("Liberação do sistema fotovoltaíco;")) {

        let total = pageTxt.substring(
            pageTxt.indexOf("Liberação") + 34,
            pageTxt.indexOf("INVESTIMENTO"));
        

        total = total.replace("R$", "");
        total = total.replace(".", "");
        total = total.replace(",", ".");
        total = total.replace(/(\S\))/gm, "");
        total = total.trim();
        

        let value = Number(total);
        orcamento.valorMaoDeObra = value;
    }
    else {
        console.log('Erro ao tentar capturar os valores');
    }
    //Valor Total
    orcamento.valorOrcamento = orcamento.valorMaoDeObra + orcamento.valorCotacao;

    //Fornecedor

    if (pageTxt.includes("BEDIN SOLAR")) {
        orcamento.forncedorGuid = "Bedin";
        orcamento.fornecedor = "BEDIN SOLAR";
    }
    else {
        orcamento.fornecedor = "FOCO ENERGIA";
        orcamento.forncedorGuid = "Foco";
    }
  
    //Extrair Items
    if (pageTxt.includes("Q TD ITEM MODEL O")) {

        let itemsTxt = pageTxt.substring(
            pageTxt.lastIndexOf("Q TD ITEM MODEL O") + 17,
            pageTxt.lastIndexOf(" T O T AL:"));

        var splits = itemsTxt.split(";");
        splits.shift();
        splits.pop();        

        let items = [];
        for (let i = 0; i < splits.length; i++) {

            let rowSplit = splits[i].split('~');

            //console.log(FixPDFTxt(rowSplit[1]));

            items.push({
                quantidade: Number(rowSplit[0].trim()),
                item: FixPDFTxt(rowSplit[1]),
                modelo: rowSplit[2].trim(),
                valor: 0,
                total: 0
            });
        }

        orcamento.items = items;        
    }
    else {
        console.log("Capturar Items");
    }
    

    AtualizarOrcamento(orcamento);
    AtualizarItems(orcamento);
    PreencherCampos(orcamento, true);

    //console.log(orcamento);
}

function ExtractText() {
    var input = document.getElementById("file-id");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
     console.log(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}


function ImportarOrcamento() {
    var input = document.getElementById("importJson");
    var fReader = new FileReader();
    fReader.readAsText(input.files[0]);

    fReader.onloadend = function (event) {
        orcamento = JSON.parse(event.target.result);

        orcamento.validade = new Date(orcamento.validade);
        orcamento.dataOrcamento = new Date(orcamento.dataOrcamento);

        //AtualizarOrcamento(orcamento);
        AtualizarItems(orcamento);
        //AtualizarFinanciamento(orcamento);
        PreencherCampos(orcamento, true);
    }
}

function convertDataURIToBinary(dataURI) {

    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array)

}
function convertDataURIToBinary2(dataURI) {

    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray2(array)

}

function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];

                    finalString += item.str + " ";
                }

                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}

function pdfAsArray(pdfAsArray) {

    PDFJS.getDocument(pdfAsArray).then(function (pdf) {

        var pdfDocument = pdf;
        // Create an array that will contain our promises
        var pagesPromises = [];

        for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
            // Required to prevent that i is always the total of pages
            (function (pageNumber) {
                // Store the promise of getPageText that returns the text of a page
                pagesPromises.push(getPageText(pageNumber, pdfDocument));
            })(i + 1);
        }

        // Execute all the promises
        Promise.all(pagesPromises).then(function (pagesText) {
            let pageText = "";

            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                pageText += pagesText[pageNum];
            }

            ExtractData(pageText);
        });

    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}


function pdfAsArray2(pdfAsArray) {

    PDFJS.getDocument(pdfAsArray).then(function (pdf) {

        var pdfDocument = pdf;
        // Create an array that will contain our promises
        var pagesPromises = [];

        for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
            // Required to prevent that i is always the total of pages
            (function (pageNumber) {
                // Store the promise of getPageText that returns the text of a page
                pagesPromises.push(getPageText(pageNumber, pdfDocument));
            })(i + 1);
        }

        // Execute all the promises
        Promise.all(pagesPromises).then(function (pagesText) {
            let pageText = "";

            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                pageText += pagesText[pageNum];
            }

            ExtractData2(pageText);
        });

    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}