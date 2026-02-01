// salvar.js - VERSÃO ELITE HISTÓRICO COMPLETA [cite: 2026-02-01]
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame) => {
    // AJUSTE MOBILE: Busca o botão pelo ID (PC) ou pela classe do Foguete (Mobile)
    const btnSave = document.getElementById('btn-salvar-elite') || 
                    document.querySelector('.fab-sub[onclick*="dispararSalvar"]');
    
    // Se não achar nenhum dos dois, a função não quebra, apenas executa o save silencioso
    const hasBtn = !!btnSave;

    // 1. Recupera o nome da peça identificado pelo RADAR no topo da folha
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = elementoIdentificador ? elementoIdentificador.innerText : "PEÇA NÃO IDENTIFICADA";

    // 2. Limpa textos de sistema se o radar ainda estiver "escaneando"
    if (tituloPeca.includes("IDENTIFICANDO") || tituloPeca.includes("ESPERA") || tituloPeca.includes("ESCANEANDO")) {
        tituloPeca = "TREINO AVULSO";
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

        // 4. Payload com inteligência de identificação e versão ELITE
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

        // 6. Feedback de Sucesso
        if (hasBtn) btnSave.innerHTML = '<i class="fas fa-check" style="color:#fbbf24"></i>';
        console.log(`✔ Sincronização Elite: Exame ${exameOficial} - ${tituloPeca}`);

        setTimeout(() => {
            // 7. LIBERDADE: Mantém o salvamento no histórico e abre a visualização
            // O usuário agora tem a liberdade de imprimir ou apenas fechar a janela
            window.print(); 
            
            if (hasBtn) {
                btnSave.innerHTML = originalIcon;
                btnSave.style.pointerEvents = 'auto';
            }
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
