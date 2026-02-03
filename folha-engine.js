// FolhaEngine.js - VERSÃO SELEÇÃO FLUIDA [2026-02-02]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-fluida')) {
            const style = document.createElement('style');
            style.id = 'style-folha-fluida';
            style.innerHTML = `
                .folha-container {
                    display: grid;
                    grid-template-columns: 45px 1fr;
                    background: #fff;
                    font-family: 'Courier New', monospace;
                    line-height: 35px; /* Altura da linha */
                    position: relative;
                }
                .numeracao {
                    background: #f8fafc;
                    border-right: 2px solid #cbd5e1;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.8rem;
                    user-select: none;
                }
                .area-editor {
                    outline: none;
                    padding-left: 15px;
                    font-size: 19px;
                    font-weight: 700;
                    color: #000;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background-image: linear-gradient(#d1d5db 1px, transparent 1px);
                    background-size: 100% 35px; /* Alinha a régua com o texto */
                }
                /* Cor da seleção do mouse */
                .area-editor::selection { background: #bfdbfe; }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container';

        // 1. Criar coluna de numeração (1 a 150)
        let numsHtml = "";
        for(let i=1; i<=150; i++) numsHtml += `<div>${i}</div>`;
        
        const numCol = document.createElement('div');
        numCol.className = 'numeracao';
        numCol.innerHTML = numsHtml;

        // 2. Criar área única de edição (Permite seleção múltipla)
        const editor = document.createElement('div');
        editor.className = 'area-editor';
        editor.contentEditable = "true";
        editor.spellcheck = false;

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // --- LÓGICA DO TECLADO ---
        editor.addEventListener('keydown', (e) => {
            // TAB: Insere 4 espaços
            if (e.key === 'Tab') {
                e.preventDefault();
                const doc = editor.ownerDocument.defaultView;
                const sel = doc.getSelection();
                const range = sel.getRangeAt(0);
                const tabNode = document.createTextNode("    ");
                range.insertNode(tabNode);
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode); 
                sel.removeAllRanges();
                sel.addRange(range);
            }

            // ENTER: O navegador já lida com o Enter nativamente no contenteditable,
            // mas aqui garantimos que ele siga o estilo da folha.
        });
    }
};
