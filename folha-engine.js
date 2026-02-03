// FolhaEngine.js - VERSÃO BLINDADA (SEM TELA BRANCA + ALINHAMENTO TOTAL)
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
                }
                .area-editor {
                    outline: none;
                    padding: 0 15px;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 5250px; 
                    background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 100% 35px;
                    background-attachment: local;
                    cursor: text;
                    line-height: 35px !important;
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
        if (!editor) {
            alert("Erro: Editor não encontrado!");
            return;
        }
        
        const conteudo = editor.innerText || "";
        const linhas = conteudo.split('\n');
        const exameAtivo = localStorage.getItem('activeEx') || "---";

        // Cria o Overlay
        const overlay = document.createElement('div');
        overlay.id = "overlay-view";
        overlay.style = "position:fixed; inset:0; background:rgba(30, 41, 59, 0.98); z-index:999999; overflow-y:auto; display:flex; flex-direction:column; align-items:center; padding:40px 10px;";
        
        const btnSair = document.createElement('button');
        btnSair.innerText = "VOLTAR AO EDITOR";
        btnSair.style = "position:fixed; top:20px; right:20px; padding:15px 25px; background:#fbbf24; border:none; font-weight:bold; border-radius:8px; cursor:pointer; z-index:1000000;";
        btnSair.onclick = () => overlay.remove();

        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; padding:40px; box-shadow:0 0 50px rgba(0,0,0,0.5); font-family:'Courier New', monospace; min-height: 100vh;";

        let html = `<div style="text-align:center; border:4px solid #000; padding:15px; margin-bottom:30px; font-weight:bold; font-size:20px;">EXAME ${exameAtivo} - PEÇA PROFISSIONAL</div>`;
        
        for(let i=1; i<=150; i++) {
            const txt = linhas[i-1] || "";
            html += `
                <div style="display:flex; height:35px; border-bottom:1px solid #eee; align-items:center; overflow:hidden;">
                    <span style="width:40px; min-width:40px; background:#f1f5f9; border-right:2px solid #000; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; height:35px; margin-right:15px;">${i}</span>
                    <span style="flex:1; font-size:18px; font-weight:700; line-height:35px; white-space:pre;">${txt}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        overlay.appendChild(btnSair);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
