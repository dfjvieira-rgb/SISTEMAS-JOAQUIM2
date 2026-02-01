import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame) => {
    const btnSave = document.getElementById('btn-salvar-elite');
    if (!btnSave) return;

    // Recupera o nome da peça identificado pelo RADAR no topo da folha
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = elementoIdentificador ? elementoIdentificador.innerText : "PEÇA NÃO IDENTIFICADA";

    // Limpa textos de sistema se o radar ainda estiver "escaneando"
    if (tituloPeca.includes("IDENTIFICANDO") || tituloPeca.includes("ESPERA")) {
        tituloPeca = "TREINO AVULSO";
    }

    // Garante que o número do exame venha do localStorage caso o parâmetro falhe
    const exameOficial = exame || localStorage.getItem('activeEx') || "00";

    const originalIcon = '<i class="fas fa-save"></i>';
    btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnSave.style.pointerEvents = 'none';

    try {
        const linhasConteudo = Array.from(document.querySelectorAll('.linha-folha'))
                                    .map(input => input.value || "");

        // Payload com inteligência de identificação recuperada
        const payload = {
            exame: exameOficial,
            nome_peca: tituloPeca, // Agora garantido que não será undefined
            linhas: linhasConteudo,
            timestamp: serverTimestamp(),
            versao: "ELITE-2026-V13"
        };

        // Gravação no Firebase com a chave estruturada: EXAME_NOME_TIMESTAMP
        const safePecaName = tituloPeca.replace(/\s+/g, '_'); // Remove espaços para o ID do Firebase
        await set(ref(db, `producao_v13/${exameOficial}_${safePecaName}_${Date.now()}`), payload);

        // Feedback de Sucesso
        btnSave.innerHTML = '<i class="fas fa-check" style="color:#fff"></i>';
        console.log(`✔ Sincronização Elite: Exame ${exameOficial} - ${tituloPeca}`);

        setTimeout(() => {
            // O disquete agora limpa o salvamento e foca apenas no PDF conforme solicitado [cite: 2026-01-30]
            window.print(); 
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
