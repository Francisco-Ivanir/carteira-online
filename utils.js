export function formatarMoeda(valor) {

return "R$ " +
Number(valor)
.toLocaleString("pt-BR");

}

export function calcularPercentual(
pago,
emprestado
) {

if (!emprestado) {
return 0;
}

return (
pago / emprestado
) * 100;

}
