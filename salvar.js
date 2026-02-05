// salvar.js - VERSÃO DEFINITIVA [CORREÇÃO DE FLUXO EDITOR -> HISTÓRICO]
import { ref, set, serverTimestamp, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const engineSaveElite = async (db, exame, isFinal = false) => {
    const syncStatus = document.getElementById('sync-status');

    // 1. Captura o título da peça do Scanner
    const elementoIdentificador = document.getElementById('identificador-peca');
    let tituloPeca = "TREINO_AVULSO";
    
    if (elementoIdentificador) {
        const textoScaneado = elementoIdentificador.innerText.trim();
        if (textoScaneado && !textoScaneado.includes("SCANNER") && !textoScaneado.includes("INATIVO")) {
            tituloPeca = textoScaneado;
        }
    }

    // 2. Define o número do exame
    const exameOficial = exame || localStorage.getItem('activeEx') || "44";

    try {
        // 3. CORREÇÃO CRÍTICA: Captura o texto do editor contentEditable
        const editor = document.getElementById('editor-principal');
        if (!editor) {
            console.error("Editor não encontrado!");
            return false;
        }

        // Pegamos o texto bruto. O mentoria.html já está preparado para dar o split('\n')
        const textoBruto = editor.innerText;

        // 4. PAYLOAD - Totalmente compatível com a visualização da Mentoria
        const payload = {
            exame: String(exameOficial),
            nome_peca: tituloPeca,
            conteudo: textoBruto,           // Campo principal de texto
            data_envio: new Date().toLocaleString('pt-BR'),
            timestamp: serverTimestamp(),
            status: isFinal ? "FINALIZADO" : "RASCUNHO"
        };

        // 5. Definição do Caminho (Path)
        if (isFinal) {
            const historicoRef = ref(db, `producao_v13`);
            const novaPecaRef = push(historicoRef); 
            await set(novaPecaRef, payload);
        } else {
            // Rascunho para persistência ao recarregar a página
            const rascunhoPath = `producao_v13/${exameOficial}_RASCUNHO_ATUAL`;
            await set(ref(db, rascunhoPath), payload);
        }

        // 6. Feedback Visual no Header do Index
        if (syncStatus) {
            const originalText = syncStatus.innerHTML;
            syncStatus.innerHTML = isFinal ? "HISTÓRICO SALVO ✅" : "AUTO-SAVED...";
            setTimeout(() => {
                syncStatus.innerHTML = `SYNC ON - EXAME ${exameOficial}`;
            }, 3000);
        }
        
        return true;
    } catch (error) {
        console.error("❌ ERRO NO FIREBASE:", error);
        return false;
    }
};
