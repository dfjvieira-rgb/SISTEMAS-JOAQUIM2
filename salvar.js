// salvar.js
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame) => {
    const btnSave = document.getElementById('btn-salvar-elite');
    if (!btnSave) return;

    const originalIcon = '<i class="fas fa-save"></i>';
    
    // Feedback de carregamento
    btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnSave.style.pointerEvents = 'none';

    try {
        const tituloPeca = document.getElementById('identificador-peca').innerText;
        // Captura todas as linhas da folha usando a classe correta
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // Payload blindado para producao_v13
        const payload = {
            exame: exame,
            nome_peca: tituloPeca,
            linhas: linhasConteudo,
            timestamp: serverTimestamp(),
            versao: "ELITE-2026-V13"
        };

        // Salva com ID único baseado no tempo
        await set(ref(db, `producao_v13/${exame}_${Date.now()}`), payload);

        // Sucesso
        btnSave.innerHTML = '<i class="fas fa-check" style="color:#fff"></i>';
        console.log("✔ Sincronização Elite concluída.");

        setTimeout(() => {
            window.print(); // Dispara o PDF após salvar
            btnSave.innerHTML = originalIcon;
            btnSave.style.pointerEvents = 'auto';
        }, 1000);

    } catch (error) {
        console.error("Erro na Engine de Salvamento:", error);
        btnSave.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        setTimeout(() => {
            btnSave.innerHTML = originalIcon;
            btnSave.style.pointerEvents = 'auto';
        }, 3000);
    }
};
