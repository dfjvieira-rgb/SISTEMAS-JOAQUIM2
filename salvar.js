// salvar.js - VERSÃO BLINDADA 2.0 [2026-02-01]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    // 1. Identificação Robusta da Peça
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        const textoScaneado = elementoIdentificador.innerText.trim();
        // Só aceita o nome se o scanner já tiver terminado (não pode ser SCANNER ou INATIVO)
        if (textoScaneado && !textoScaneado.includes("SCANNER") && !textoScaneado.includes("INATIVO") && !textoScaneado.includes("IDENTIFICANDO")) {
            tituloPeca = textoScaneado;
        }
    }

    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        // 2. Captura o conteúdo das linhas
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // 3. Payload com mapeamento exato para a Mentoria V13
        const payload = {
            exame: String(exameOficial),
            peca: tituloPeca, 
            conteudo: linhasConteudo,
            data: new Date().toLocaleString('pt-BR'),
            timestamp: serverTimestamp(),
            finalizado: isFinal // Campo booleano para facilitar filtro na mentoria
        };

        // 4. Lógica de Caminho (Path)
        if (isFinal) {
            // SALVAMENTO NO HISTÓRICO (PRODUÇÃO V13 / HISTÓRICO)
            // Usamos push para criar um novo registro sem apagar os anteriores
            const historicoRef = ref(db, `producao_v13/historico`);
            await set(push(historicoRef), payload);
            console.log("✅ [ELITE] Peça enviada ao Histórico Oficial.");
        } else {
            // SALVAMENTO DO RASCUNHO (Sempre no mesmo lugar para economia de dados)
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }

        // 5. Feedback Visual de Sucesso
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
        console.error("❌ ERRO NO SALVAMENTO:", error);
        if (syncText) syncText.innerText = "ERRO FIREBASE";
        return false;
    }
};
