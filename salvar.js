// salvar.js - VERSÃO ELITE HISTÓRICO COMPLETA [cite: 2026-02-01]
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame) => {
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
        // Criamos uma chave única com Timestamp para não sobrescrever treinos antigos
        const safePecaName = tituloPeca.replace(/\s+/g, '_'); 
        const savePath = `producao_v13/${exameOficial}_${safePecaName}_${Date.now()}`;
        
        await set(ref(db, savePath), payload);

        // 6. Feedback de Sucesso no Botão
        if (hasBtn) {
            btnSave.innerHTML = '<i class="fas fa-check" style="color:#fbbf24"></i>';
        }
        
        console.log(`✔ Peça Enviada ao Histórico: ${tituloPeca}`);

        setTimeout(() => {
            if (hasBtn) {
                btnSave.innerHTML = originalIcon;
                btnSave.style.pointerEvents = 'auto';
            }
            // AVISO DE SUCESSO AO USUÁRIO
            alert("✅ Sincronizado! Sua peça foi enviada para o histórico da mentoria.");
        }, 1000);

    } catch (error) {
        console.error("Erro na Engine de Salvamento:", error);
        if (hasBtn) {
            btnSave.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            setTimeout(() => {
                btnSave.innerHTML = originalIcon;
                btnSave.style.pointerEvents = 'auto';
            }, 3000);
        }
    }
};
