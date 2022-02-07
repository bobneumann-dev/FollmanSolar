var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';
var orcamento = {};

function ExtractData(pageTxt) {
    
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

        orcamento.validade = validade;
    }
    else {
        console.log("V");
    }

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