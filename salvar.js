// salvar.js - VERSÃO ELITE HISTÓRICO COMPLETA [2026-02-01] - SEM ALERTS
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame) => {
    // Busca os elementos de feedback no cabeçalho
    const syncText = document.getElementById('sync-text');
    const syncIcon = document.getElementById('sync-icon');
    const syncIndicator = document.getElementById('sync-indicator');

    // Busca o botão pelo ID (PC) ou pela classe do Foguete (Mobile)
    const btnSave = document.getElementById('btn-salvar-elite') || 
                    document.querySelector('.fab-sub[onclick*="dispararSalvar"]');
    
    const hasBtn = !!btnSave;

    // 1. Recupera o nome da peça identificado pelo RADAR no topo da folha
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = elementoIdentificador ? elementoIdentificador.innerText : "PEÇA NÃO IDENTIFICADA";

    // 2. Limpa textos de sistema se o radar ainda estiver "escaneando"
    if (tituloPeca.includes("IDENTIFICANDO") || tituloPeca.includes("ESPERA") || tituloPeca.includes("SCANNER INATIVO")) {
        tituloPeca = "TREINO_AVULSO";
    }

    // 3. Garante que o número do exame venha do localStorage caso o parâmetro falhe
    const exameOficial = exame || localStorage.getItem('activeEx') || "00";

    const originalIcon = hasBtn ? btnSave.innerHTML : '<i class="fas fa-save"></i>';
    
    if (hasBtn) {
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btnSave.style.pointerEvents = 'none';
    }

    try {
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // 4. Payload formatado para o Histórico da Mentoria
        const payload = {
            exame: exameOficial,
            nome_peca: tituloPeca, 
            linhas: linhasConteudo,
            timestamp: serverTimestamp(),
            data_envio: new Date().toLocaleString('pt-BR'),
            versao: "ELITE-2026-V13"
        };

        // 5. Gravação no Firebase: HISTÓRICO DA MENTORIA (producao_v13)
        const safePecaName = tituloPeca.replace(/\s+/g, '_'); 
        const savePath = `producao_v13/${exameOficial}_${safePecaName}_${Date.now()}`;
        
        await set(ref(db, savePath), payload);

        // 6. Feedback de Sucesso Silencioso e Visual
        if (hasBtn) {
            btnSave.innerHTML = '<i class="fas fa-check" style="color:#fbbf24"></i>';
        }

        // Atualiza o indicador do topo para o modo "Pulsante Verde"
        if (syncText && syncIcon) {
            syncText.innerText = "HISTÓRICO SALVO ✅";
            if (syncIndicator) syncIndicator.classList.add('sync-success');
            syncIcon.className = "fas fa-check-circle sync-success";
        }
        
        console.log(`✔ Peça Enviada ao Histórico: ${tituloPeca}`);

        setTimeout(() => {
            if (hasBtn) {
                btnSave.innerHTML = originalIcon;
                btnSave.style.pointerEvents = 'auto';
            }
            
            // Retorna o status original do cabeçalho após 4 segundos
            setTimeout(() => {
                if (syncText && !window.isFinalizing) {
                    syncText.innerText = "SYNC ON";
                    if (syncIndicator) syncIndicator.classList.remove('sync-success');
                    syncIcon.className = "fas fa-cloud";
                }
            }, 4000);

        }, 1000);

    } catch (error) {
        console.error("Erro na Engine de Salvamento:", error);
        if (syncText) syncText.innerText = "ERRO NA CONEXÃO";
        
        if (hasBtn) {
            btnSave.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            setTimeout(() => {
                btnSave.innerHTML = originalIcon;
                btnSave.style.pointerEvents = 'auto';
            }, 3000);
        }
    }
};
