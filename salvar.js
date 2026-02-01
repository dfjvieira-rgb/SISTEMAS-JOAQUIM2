// salvar.js - VERSÃO ELITE [2026-02-01]
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = elementoIdentificador ? elementoIdentificador.innerText : "TREINO_AVULSO";

    if (tituloPeca.includes("SCANNER") || tituloPeca.includes("IDENTIFICANDO")) {
        tituloPeca = "TREINO_AVULSO";
    }

    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        const payload = {
            exame: exameOficial,
            nome_peca: tituloPeca, 
            linhas: linhasConteudo,
            timestamp: serverTimestamp(),
            data_envio: new Date().toLocaleString('pt-BR'),
            status: isFinal ? "FINALIZADO" : "RASCUNHO"
        };

        const safePecaName = tituloPeca.replace(/\s+/g, '_'); 

        const savePath = isFinal 
            ? `historico_mentoria/${exameOficial}_${safePecaName}_${Date.now()}`
            : `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
        
        await set(ref(db, savePath), payload);

        if (syncText) {
            syncText.innerText = isFinal ? "HISTÓRICO SALVO ✅" : "AUTO-SAVED";
            if (syncIndicator) syncIndicator.classList.add('sync-success');
            setTimeout(() => {
                syncText.innerText = "SYNC ON";
                if (syncIndicator) syncIndicator.classList.remove('sync-success');
            }, 3000);
        }
        console.log(`[FIREBASE] ${isFinal ? 'HISTÓRICO' : 'AUTO-SAVE'} concluído.`);
        return true;
    } catch (error) {
        console.error("Erro no salvamento:", error);
        if (syncText) syncText.innerText = "ERRO DE CONEXÃO";
        return false;
    }
};
