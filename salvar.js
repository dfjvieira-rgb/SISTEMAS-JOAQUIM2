// salvar.js - VERSÃO BLINDADA 3.5 [2026-02-01]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    // 1. Captura o título da peça do Scanner
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        const textoScaneado = elementoIdentificador.innerText.trim();
        // Limpa ruídos do scanner
        if (textoScaneado && !textoScaneado.includes("SCANNER") && !textoScaneado.includes("INATIVO") && !textoScaneado.includes("IDENTIFICANDO")) {
            tituloPeca = textoScaneado;
        }
    }

    // 2. Define o número do exame
    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        // 3. Captura o conteúdo das linhas (importante: o nome deve ser 'linhas')
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // 4. PAYLOAD - Aqui está o segredo: Nomes de campos idênticos ao mentoria.html
        const payload = {
            exame: String(exameOficial),     // Traz o número do Exame
            nome_peca: tituloPeca,           // Traz o nome identificado
            linhas: linhasConteudo,          // Traz o texto (para o botão VER funcionar)
            data_envio: new Date().toLocaleString('pt-BR'),
            timestamp: serverTimestamp(),
            status: isFinal ? "FINALIZADO" : "RASCUNHO"
        };

        // 5. Definição do Caminho (Path)
        // Para aparecer na Mentoria, salvamos direto na raiz de producao_v13
        if (isFinal) {
            const historicoRef = ref(db, `producao_v13`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
            console.log("✅ [HISTÓRICO] Peça enviada com sucesso.");
        } else {
            // Rascunho continua fixo para não poluir
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }

        // 6. Feedback Visual
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
        console.error("❌ ERRO NO FIREBASE:", error);
        if (syncText) syncText.innerText = "ERRO DE CONEXÃO";
        return false;
    }
};
