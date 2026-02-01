// carregar.js - VERSÃO ELITE [2026-02-01]
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineLoadElite = async (db, exame) => {
    const exameOficial = exame || localStorage.getItem('activeEx') || "44";
    const loadPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;

    try {
        const snapshot = await get(ref(db, loadPath));
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const linhas = dados.linhas || [];
            
            // Preenche cada linha da folha com o que estava salvo
            linhas.forEach((texto, i) => {
                const input = document.getElementById(`L${i + 1}`);
                if (input) input.value = texto;
            });
            
            console.log("[Elite Load] Rascunho recuperado com sucesso.");
            return true;
        }
    } catch (error) {
        console.error("Erro ao carregar rascunho:", error);
    }
    return false;
};
