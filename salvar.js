// salvar.js - RECONSTRUÇÃO TOTAL [2026]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    // 1. Captura do Texto Real do Editor
    const editor = document.getElementById('editor-principal');
    if (!editor) {
        console.error("ERRO: Editor Principal não encontrado no DOM.");
        return false;
    }

    const textoParaSalvar = editor.innerText || "";
    
    // Bloqueia salvamento vazio se for finalização
    if (isFinal && textoParaSalvar.trim().length < 10) {
        alert("Erro: O conteúdo está muito curto para ser salvo como peça finalizada.");
        return false;
    }

    // 2. Captura de Identificadores
    const exameOficial = exame || localStorage.getItem('activeEx') || "35";
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        const textoScaneado = elementoIdentificador.innerText.trim();
        if (textoScaneado && !textoScaneado.includes("SCANNER") && !textoScaneado.includes("INATIVO")) {
            tituloPeca = textoScaneado;
        }
    }

    // 3. Montagem do Payload (Estrutura Blindada)
    const payload = {
        exame: String(exameOficial),
        nome_peca: tituloPeca,
        conteudo: textoParaSalvar, // Salvamos como string pura para evitar erros de array
        data_envio: new Date().toLocaleString('pt-BR'),
        timestamp: serverTimestamp(),
        status: isFinal ? "FINALIZADO" : "RASCUNHO"
    };

    try {
        // 4. Execução do Salvamento
        if (isFinal) {
            // Salva no histórico de produção para a Mentoria ler
            const historicoRef = ref(db, `producao_v13`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
            alert("✅ PEÇA SALVA NO HISTÓRICO COM SUCESSO!");
        } else {
            // Salva apenas o rascunho temporário
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }
        
        return true;
    } catch (error) {
        console.error("ERRO CRÍTICO NO FIREBASE:", error);
        alert("Erro ao conectar com o banco de dados.");
        return false;
    }
};
