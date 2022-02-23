var BASE64_MARKER = ';base64,';
var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';
var orcamento = {};

function RealToNumber(real) {
    return Number(real.replace("R$ ", ""));
}

function RealParaNumero(valor) {
    return Number(valor.replace("R$ ", ""));
}

//Somar nova linha
function Somar() {

    let soma = 0;

    orcamento.items.forEach(function (item, i) {
        item.total = item.quantidade * item.valor;
        soma = soma + item.total;

    });

    orcamento.valorCotacao = soma;
    orcamento.valorMaoDeObra = soma * 0.3;
    orcamento.valorOrcamento = soma * 1.3;

    PreencherCampos(orcamento, false);
    AtualizarItems(orcamento);
    AtualizarOrcamento(orcamento);

}

function SomarTotal(orcamento) {
    let total = 0;

    orcamento.items.forEach(v => {
        v.total = v.valor * v.quantidade;
        total += v.total;
    });

    orcamento.valorCotacao   = total;
    orcamento.valorMaoDeObra = total * 0.3;
    orcamento.valorOrcamento = orcamento.valorCotacao + orcamento.valorMaoDeObra;

    AtualizarItems(orcamento);
    AtualizarOrcamento(orcamento);
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

function DefaultObj() {
    return {
        "cliente": "",
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
    //Pagina 1
    IptRefresh("cliente", orcamento);
    IptRefresh("cidade", orcamento);
    IptRefresh("telhado", orcamento);
    $("#potenciaPicoSpan").text((orcamento.potenciaPico).toFixed(2));
    $("#validadeSpan").text(new Date(orcamento.validade).toLocaleDateString());
    $("#dataOrcamentoExtensoSpan").text(new Date(orcamento.dataOrcamento).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }))
    
    $("#valorMaoDeObraSpan").text(orcamento.valorMaoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorCotacaoSpan").text(orcamento.valorCotacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));

    //Tabela de Items
    $("#itemsBody").empty();

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
    $("#valorOrcamentoSpan").text(orcamento.valorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }));
    $("#valorExtensoSpan").text(TitleCase(ValorPorExtensoReal(orcamento.valorOrcamento)));

    //Pagina 5
    $("#validade2Span").text(new Date(orcamento.validade).toLocaleDateString());
    $("#clienteFirmaSpan").text(orcamento.cliente);

    //financiamento
    if (orcamento.financiamento.length == 0) {
        $("#FinanciamentoDiv").hide();
    }
    else {
        $("#FinanciamentoDiv").show();
        $("#financiamentoTable").empty();

        orcamento.financiamento.forEach((v) => {

            let tr = $("<tr></tr>");

            tr.append('<td width="30%">&nbsp;</td>');
            tr.append('<td width="40%" align=center style="border:1px solid black;"><b><span style="color:#dc146a;">' + v.parcelas + ' parcelas</span> de R$ ' + v.mensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }) + '</b></td>');
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

    AtualizarTitulo();
}

function AtualizarItems(orcamento) {
    $("#itemsViewBody").empty();

    //Tabela de Items
    orcamento.items.forEach((v, i, a) => {
        let tr = $("<tr style='border:1px solid black;'></tr>");

        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.quantidade + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.item + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:center">' + v.modelo + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:right">' + v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }) + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:right">' + v.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',minimumFractionDigits: 2 }) + '</td>');
        tr.append('<td style="border-right:1px solid black;padding-left:10px;text-align:right"><button class="btn btn-xs btn-warning" onclick ="ModalProdutos(' + i + ')"><i class="fa fa-edit"></i><button class="btn btn-xs btn-danger" onclick ="DelProduto(' + i + ')"><i class="fa fa-times"></i></td>');

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

        if (d.representante != null) {
            $("#representante").val(d.representante);
            AtualizarRepresentante(d.representante);
        }

        TrocarCidade(d.cidade);
        SetDateInput("dataOrcamento", d.dataOrcamento);
    }

    //Pdf
    SetDateInput("validade", d.validade);
    $("#telhado").val(d.telhado);
    $("#numeroPlacas").val(d.numeroPlacas);
    $("#potenciaPlacas").val(d.potenciaPlacas);
    $("#potenciaPico").val(d.potenciaPico.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#geracaoMensal").val(d.geracaoMensal);

    //Numeros
    $("#valorCotacao").val(d.valorCotacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorMaoDeObra").val(d.valorMaoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    $("#valorOrcamento").val(d.valorOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
}

function ExtractData(pageTxt) {
    orcamento = DefaultObj();
    console.log(pageTxt);

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
            pageTxt.lastIndexOf("CONDIÇ"));

        console.log(total);

        total = total.replace("R$", "");
        total = total.replace(".", "");
        total = total.replace(",", ".");
        total = total.replace(/(\S\))/gm, "");
        total = total.trim();
        console.log(total);

        let value = Number(total);

        orcamento.valorCotacao = value;
    }
    else {
        console.log('-');
    }

    //Extrair Items
    if (pageTxt.includes("VALOR DO PRODUTO")) {

        let itemsTxt = pageTxt.substring(
            pageTxt.lastIndexOf("ITENS DO PROJETO") + 16,
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
                valor: RealToNumber(splits[j + 3]),
                total: RealToNumber(splits[j + 4])
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
            pageTxt.lastIndexOf("ITENS"));

        telhado = telhado.replace("TELHADO", "");
        telhado = telhado.replace(/(\S\))/gm, "");
        telhado = telhado.trim();

        orcamento.telhado = telhado;
    }
    else {
        console.log("T");
    }

    //Validade
    if (pageTxt.includes("VALIDADE")) {

        let validade = pageTxt.substring(
            pageTxt.indexOf("VALIDADE") + 8,
            pageTxt.indexOf("B)"));

        validade = validade.replace("VALIDADE", "");
        validade = validade.trim();

        console.log(validade);

        let parts = validade.split('/');

        orcamento.validade = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
    }
    else {
        console.log("V");
    }

    //Orçamentos    
    orcamento.valorMaoDeObra = orcamento.valorCotacao * 0.3;
    orcamento.valorOrcamento = orcamento.valorMaoDeObra + orcamento.valorCotacao;

    ExtrairInfPlacas(orcamento.items);

    AtualizarOrcamento(orcamento);
    AtualizarItems(orcamento);
    PreencherCampos(orcamento, false);

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

function ImportarOrcamento() {
    var input = document.getElementById("importJson");
    var fReader = new FileReader();
    fReader.readAsText(input.files[0]);

    fReader.onloadend = function (event) {
        orcamento = JSON.parse(event.target.result);

        orcamento.validade = new Date(orcamento.validade);
        orcamento.dataOrcamento = new Date(orcamento.dataOrcamento);

        AtualizarOrcamento(orcamento);
        AtualizarItems(orcamento);
        AtualizarFinanciamento(orcamento);
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