// FolhaEngine.js - VERSÃO FIXADA (SCROLL + 150 LINHAS) [2026-02-02]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-fluida-v2';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .folha-container {
                    display: grid;
                    grid-template-columns: 45px 1fr;
                    background: #fff;
                    font-family: 'Courier New', Courier, monospace;
                    line-height: 35px;
                    position: relative;
                    border: 1px solid #d1d5db;
                    /* Força a altura de 150 linhas (150 * 35px) */
                    min-height: 5250px; 
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #cbd5e1;
                    text-align: center;
                    color: #64748b;
                    font-size: 0.8rem;
                    user-select: none;
                    font-weight: bold;
                    /* Impede a numeração de encolher */
                    min-height: 1000%; 
                }
                .area-editor {
                    outline: none;
                    padding: 0 15px;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    /* Faz o editor ocupar todo o espaço da folha */
                    min-height: 5250px; 
                    background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 100% 35px;
                    background-attachment: local;
                    cursor: text;
                }
                .area-editor::selection { background: #bfdbfe; color: #1e3a8a; }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container';

        const numCol = document.createElement('div');
        numCol.className = 'numeracao';
        let nums = "";
        for(let i=1; i<=150; i++) nums += `<div style="height:35px; display:flex; align-items:center; justify-content:center;">${i}</div>`;
        numCol.innerHTML = nums;

        const editor = document.createElement('div');
        editor.className = 'area-editor';
        editor.id = 'editor-principal';
        editor.contentEditable = "true";
        editor.spellcheck = false;

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // Garante que o Tab funcione
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const sel = window.getSelection();
                const range = sel.getRangeAt(0);
                const tabNode = document.createTextNode("    ");
                range.insertNode(tabNode);
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    },

    injetarTextoMultilinhas: (textoBruto) => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        editor.innerText += (editor.innerText ? "\n\n" : "") + limpo;
        editor.focus();
    },

    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        const conteudo = editor.innerText;
        const janela = window.open('', '', 'width=800,height=900');
        janela.document.write('<html><head><title>Preview</title><style>body{font-family:Courier,monospace;padding:40px;white-space:pre-wrap;}</style></head><body>'+conteudo+'</body></html>');
        janela.document.close();
    }
};
