var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';
var orcamento = {};

function DefaultObj() {
    return {
        "cliente": "",
        "representante": null,
        "cidade": "",

        "dataOrcamento": "0001-01-01",
        "validade": "0001-01-01",
        "telha": "tipo de telha",

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
    //Pagina 1
    IptRefresh("cliente", orcamento);
    IptRefresh("cidade", orcamento);
    IptRefresh("telha", orcamento);
    $("#potenciaPicoSpan").text((orcamento.potenciaPico).toFixed(2));
    $("#validadeSpan").text(new Date(orcamento.validade).toLocaleDateString());
    $("#dataOrcamentoExtensoSpan").text(new Date(orcamento.dataOrcamento).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }))
    
    $("#valorMaoDeObraSpan").text(orcamento.valorMaoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorCotacaoSpan").text(orcamento.valorCotacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    //Tabela de Items
    orcamento.items.forEach((v) => {
        let tr = $("<tr style='border:1px solid black;'></tr>");

        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.quantidade + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.item + '</td>');
        tr.append('<td style="padding-left:10px;text-align:center">' + v.modelo + '</td>');

        $("#itemsBody").append(tr);
    });

    //Pagina 2
    IptRefresh("numeroPlacas", orcamento);
    $("#potenciaPlacasSpan").text(orcamento.potenciaPlacas.toUpperCase().replace("W", "").replace("P", ""));
    $("#geracaoMensalSpan").text(orcamento.geracaoMensal.toLocaleString());
    $("#valorOrcamentoSpan").text(orcamento.valorOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorExtensoSpan").text(ValorPorExtensoReal(orcamento.valorOrcamento));

    //Pagina 5
    $("#validade2Span").text(new Date(orcamento.validade).toLocaleDateString());
    $("#clienteFirmaSpan").text(orcamento.cliente);

    //financiamento
    if (orcamento.financiamento.length == 0) {
        $("#FinanciamentoDiv").hide();
    }
    else {
        orcamento.financiamento.forEach((v) => {

            let tr = $("<tr></tr>");

            tr.append('<td width="30%">&nbsp;</td>');
            tr.append('<td width="40%" align=center style="border:1px solid black;"><b><span style="color:#dc146a;">' + v.parcelas + ' parcelas</span> de R$ ' + v.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td>');
            tr.append('<td width="30%">&nbsp;</td>');

            $("#financiamentoTable").append(tr);
        });
    }


    //Representante
    if (orcamento.representante != null && orcamento.representante != "") {
        IptRefresh("representante", orcamento);

        $(".representanteShow").show();
        $(".representanteHide").hide();
    }
    else {
        $(".representanteShow").hide();
        $(".representanteHide").show();
    }


}

function ExtractData(pageTxt) {
    orcamento = DefaultObj();

    //POTÊNCIA kWp  8.18 kWp  LINHAS
    if (pageTxt.includes("CIA kWp")) {

        let kwp = pageTxt.substring(
            pageTxt.lastIndexOf("CIA kWp") + 7,
            pageTxt.lastIndexOf("LINHAS"));

        kwp = kwp.toUpperCase();
        kwp = kwp.replace("KWP", "");
        kwp = kwp.trim();
        let potenciaPico = Number(kwp);

        orcamento.potenciaPico = potenciaPico;
    }
    else {
        console.log("K");
    }

    //Extrair Valor Total
    if (pageTxt.includes("VALOR DO PRODUTO")) {

        let total = pageTxt.substring(
            pageTxt.lastIndexOf("VALOR DO PRODUTO") + 16,
            pageTxt.lastIndexOf("F)"));

        total = total.replace("R$", "");
        total = total.replace(".", "");
        total = total.replace(",", ".");
        total = total.trim();

        let value = Number(total);

        orcamento.valorCotacao = value;
    }
    else {
        console.log('-');
    }

    //Extrair Items
    if (pageTxt.includes("VALOR DO PRODUTO")) {

        let itemsTxt = pageTxt.substring(
            pageTxt.lastIndexOf("E)") + 2,
            pageTxt.lastIndexOf("VALOR DO PRODUTO"));

        var splits = itemsTxt.split("   ");
        splits.shift();

        let nItems = splits.length / 5;
        let items = [];

        for (let i = 0; i < nItems; i++) {
            let j = i * 5;

            items.push({
                quantidade: Number(splits[j]),
                item: splits[j + 1],
                modelo: splits[j + 2],
                valor: splits[j + 3],
                total: splits[j + 4]
            });
        }

        orcamento.items = items;
    }
    else {
        console.log("I");
    }

    //Telhado
    if (pageTxt.includes("TELHADO")) {

        let telhado = pageTxt.substring(
            pageTxt.lastIndexOf("TELHADO") + 7,
            pageTxt.lastIndexOf("E)"));

        telhado = telhado.replace("TELHADO", "");
        telhado = telhado.trim();

        orcamento.telhado = telhado;
    }
    else {
        console.log("T");
    }

    //Validade
    if (pageTxt.includes("VALIDADE")) {

        let validade = pageTxt.substring(
            pageTxt.lastIndexOf("VALIDADE") + 8,
            pageTxt.lastIndexOf("B)"));

        validade = validade.replace("VALIDADE", "");
        validade = validade.trim();

        let parts = validade.split('/');

        orcamento.validade = parts[2] + "-" + parts[1] + "-" + parts[0];
    }
    else {
        console.log("V");
    }

    //Orçamentos    
    orcamento.valorMaoDeObra = orcamento.valorCotacao * 0.3;
    orcamento.valorOrcamento = orcamento.valorMaoDeObra + orcamento.valorCotacao;

    ExtrairInfPlacas(orcamento.items);
    console.log(orcamento);
}

function ExtractText() {
    var input = document.getElementById("file-id");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    // console.log(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}

var BASE64_MARKER = ';base64,';

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