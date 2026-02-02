// salvar.js - VERSÃO ELITE [2026-02-01] - CORREÇÃO DE IDENTIFICAÇÃO
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    // Captura o título da peça diretamente do cabeçalho do papel
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        const textoScaneado = elementoIdentificador.innerText.trim();
        // Se o scanner já identificou a peça, usa o nome real (ex: RECURSO ORDINÁRIO)
        if (textoScaneado && !textoScaneado.includes("SCANNER") && !textoScaneado.includes("INATIVO")) {
            tituloPeca = textoScaneado;
        }
    }

    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // PAYLOAD AJUSTADO PARA O PADRÃO DA MENTORIA V13
        const payload = {
            exame: exameOficial,
            peca: tituloPeca, // Nome da peça (fundamental para não aparecer undefined)
            conteudo: linhasConteudo,
            data: new Date().toLocaleString('pt-BR'),
            timestamp: serverTimestamp(),
            status: isFinal ? "FINALIZADO" : "RASCUNHO"
        };

        if (isFinal) {
            // SALVAMENTO NO HISTÓRICO OFICIAL
            const historicoRef = ref(db, `producao_v13/historico`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
        } else {
            // SALVAMENTO DO RASCUNHO ATUAL
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }

        // Feedback visual
        if (syncText) {
            syncText.innerText = isFinal ? "HISTÓRICO SALVO ✅" : "AUTO-SAVED";
            if (syncIndicator) syncIndicator.classList.add('sync-success');
            setTimeout(() => {
                syncText.innerText = "SYNC ON";
                if (syncIndicator) syncIndicator.classList.remove('sync-success');
            }, 3000);
        }
        
        return true;
    } catch (error) {
        console.error("Erro no salvamento:", error);
        if (syncText) syncText.innerText = "ERRO DE CONEXÃO";
        return false;
    }
};
