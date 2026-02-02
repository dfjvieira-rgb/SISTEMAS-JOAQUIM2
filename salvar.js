// salvar.js - VERSÃO BLINDADA [2026-02-01]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncText = document.getElementById('sync-text');
    const syncIndicator = document.getElementById('sync-indicator');

    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = elementoIdentificador ? elementoIdentificador.innerText : "TREINO_AVULSO";

    // Limpa o título para evitar nomes genéricos do scanner
    if (tituloPeca.includes("SCANNER") || tituloPeca.includes("IDENTIFICANDO") || tituloPeca.includes("INATIVO")) {
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

        // LÓGICA DE CAMINHO RESTRUTURADA
        let savePath;
        
        if (isFinal) {
            // Para o Histórico da Mentoria: Salvamos dentro de producao_v13 com um ID único (push)
            // Isso garante que apareça na lista de treinos realizados
            const historicoRef = ref(db, `producao_v13/historico`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
            console.log("[FIREBASE] Enviado para Histórico Produção V13");
        } else {
            // Para o Rascunho Atual: Sobrescreve sempre o mesmo nó para não poluir o banco
            savePath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, savePath), payload);
            console.log("[FIREBASE] Rascunho Auto-Save concluído.");
        }

        // Feedback Visual Elite
        if (syncText) {
            syncText.innerText = isFinal ? "PEÇA FINALIZADA ✅" : "AUTO-SAVED";
            if (syncIndicator) syncIndicator.classList.add('sync-success');
            setTimeout(() => {
                syncText.innerText = "SYNC ON";
                if (syncIndicator) syncIndicator.classList.remove('sync-success');
            }, 3000);
        }
        
        return true;
    } catch (error) {
        console.error("Erro crítico no salvamento:", error);
        if (syncText) syncText.innerText = "ERRO DE CONEXÃO";
        return false;
    }
};
