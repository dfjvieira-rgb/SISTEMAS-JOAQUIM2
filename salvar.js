// salvar.js - VERSÃO BLINDADA 3.6 [2026-02-01]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    // 1. Captura e Limpeza Rigorosa do Título
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        let textoScaneado = elementoIdentificador.innerText.trim();
        // Remove quebras de linha e caracteres especiais que travam o Firebase
        textoScaneado = textoScaneado.replace(/[\n\r]/g, " ").replace(/[.#$[\]]/g, ""); 

        if (textoScaneado && 
            !textoScaneado.includes("SCANNER") && 
            !textoScaneado.includes("INATIVO") && 
            !textoScaneado.includes("IDENTIFICANDO")) {
            tituloPeca = textoScaneado;
        }
    }

    // 2. Define o número do exame
    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        // 3. Captura o conteúdo das linhas
        const inputs = document.querySelectorAll('.linha-folha');
        if (inputs.length === 0 && isFinal) {
            alert("Erro: Nenhuma linha de texto encontrada para salvar.");
            return false;
        }

        const linhasConteudo = Array.from(inputs).map(input => input.value || "");

        // 4. PAYLOAD - Redundância de campos para o Histórico
        const payload = {
            exame: String(exameOficial),
            nome_peca: tituloPeca,
            peca: tituloPeca, // Campo reserva
            linhas: linhasConteudo,
            conteudo: linhasConteudo, // Campo reserva
            data_envio: new Date().toLocaleString('pt-BR'),
            timestamp: serverTimestamp(),
            status: isFinal ? "FINALIZADO" : "RASCUNHO"
        };

        // 5. Execução do Salvamento
        if (isFinal) {
            // Caminho da Mentoria
            const historicoRef = ref(db, `producao_v13`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
            alert("✅ PEÇA SALVA NO HISTÓRICO!");
        } else {
            // Rascunho (Auto-save)
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }

        // 6. Feedback Visual na UI
        if (syncText) {
            syncText.innerText = isFinal ? "HISTÓRICO SALVO ✅" : "AUTO-SAVED";
            if (syncIndicator) syncIndicator.classList.add('sync-success');
            setTimeout(() => {
                if (syncText) syncText.innerText = "SYNC ON";
                if (syncIndicator) syncIndicator.classList.remove('sync-success');
            }, 3000);
        }
        
        return true;
    } catch (error) {
        console.error("❌ ERRO NO FIREBASE:", error);
        // Alerta vital para diagnóstico no mobile
        alert("FALHA AO SALVAR: Verifique sua conexão ou permissões do Banco.");
        if (syncText) syncText.innerText = "ERRO DE CONEXÃO";
        return false;
    }
};
