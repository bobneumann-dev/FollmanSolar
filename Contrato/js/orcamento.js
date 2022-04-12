
function ExtrairInfPlacas(items) {

    let item = items.find(element => element.modelo.includes('dulo'));

    if (item != undefined) {

        orcamento.numeroPlacas = item.quantidade;
        let rgx = item.item.match(new RegExp("[0-9]+W"));

        if (rgx != null)
            orcamento.potenciaPlacas = rgx[0].replace("W","");
        else
            orcamento.potenciaPlacas = "";

    }

    return orcamento;
}

function GeracaoMensal(current) {

}

function DownloadJson(data, nome) {
        var textToSave = JSON.stringify(data);
        var hiddenElement = document.createElement('a');

        hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = nome + '.json';
        hiddenElement.click();
}