function ExtrairInfPlacas(items) {

    let item = items.find(element => element.modelo.includes('dulo'));

    if (item != undefined) {

        orcamento.numeroPlacas = item.quantidade;
        let rgx = item.item.match(new RegExp("[0-9]+W"));

        if (rgx != null)
            orcamento.potenciaPlacas = rgx[0];
        else
            orcamento.potenciaPlacas = "";

    }

    return orcamento;
}

function GeracaoMensal(current) {

}

function NumeroPorExtenso(valor) {
    return "Valor por extenso";
}

function ValorOrcamento(current) {
    valorOrcamento = current.valorCotacao * 1.3;
    valorExtenso = NumeroPorExtenso(valor);
}
