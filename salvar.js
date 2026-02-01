// salvar.js
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/**
 * Engine de Salvamento Isolada
 * @param {Object} db - Instância do banco de dados Firebase
 * @param {String} exame - Número do exame atual
 */
export const engineSaveElite = async (db, exame) => {
    const btn = document.getElementById('btn-save-elite');
    const icon = btn.querySelector('i');
    
    // Bloqueio de segurança para evitar cliques duplos
    btn.style.pointerEvents = 'none';
    icon.className = 'fas fa-spinner fa-spin';

    try {
        const titulo = document.getElementById('identificador-peca').innerText;
        // Captura todas as linhas da folha
        const conteudo = Array.from(document.querySelectorAll('.linha-input')).map(input => input.value);

        // Envio para a coleção blindada producao_v13
        await set(ref(db, 'producao_v13/' + Date.now()), {
            exame: exame,
            nome_peca: titulo,
            linhas: conteudo,
            timestamp: serverTimestamp()
        });

        // Feedback de sucesso
        icon.className = 'fas fa-check';
        console.log("✔ Backup Elite Concluído com sucesso.");

        setTimeout(() => {
            window.print(); // Dispara o PDF oficial
            icon.className = 'fas fa-save';
            btn.style.pointerEvents = 'auto';
        }, 1000);

    } catch (error) {
        console.error("❌ Falha na Engine de Salvamento:", error);
        icon.className = 'fas fa-exclamation-triangle';
        alert("Erro ao sincronizar. Dados mantidos localmente.");
        setTimeout(() => {
            icon.className = 'fas fa-save';
            btn.style.pointerEvents = 'auto';
        }, 3000);
    }
};
