// FolhaEngine.js - VERSÃO PRECISÃO MÁXIMA [2026-02-03]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-v3-final';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .folha-container {
                    display: grid;
                    grid-template-columns: 50px 1fr;
                    background: #fff;
                    font-family: 'Courier New', Courier, monospace;
                    position: relative;
                    border: 1px solid #94a3b8;
                    min-height: 5250px;
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #64748b;
                    text-align: center;
                    color: #1e293b;
                    font-size: 0.85rem;
                    user-select: none;
                    font-weight: 900;
                }
                .linha-num {
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #cbd5e1;
                    box-sizing: border-box;
                }
                .area-editor {
                    outline: none;
                    padding: 0 25px;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 5250px;
                    line-height: 35px !important;
                    background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
                    background-size: 100% 35px;
                    background-repeat: repeat-y;
                    background-position: 0 -1px;
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
        for(let i=1; i<=150; i++) {
            nums += `<div class="linha-num">${i}</div>`;
        }
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
                document.execCommand('insertText', false, '    ');
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
        const linhas = conteudo.split('\n');
        const exameAtivo = localStorage.getItem('activeEx') || "---";

        const overlay = document.createElement('div');
        overlay.style = "position:fixed; inset:0; background:rgba(15, 23, 42, 0.98); z-index:999999; overflow-y:auto; padding:40px 10px; display:flex; flex-direction:column; align-items:center;";
        
        const btnSair = document.createElement('button');
        btnSair.innerHTML = "<b>VOLTAR AO EDITOR</b>";
        btnSair.style = "position:fixed; top:20px; left:20px; padding:15px 30px; background:#fbbf24; border:none; border-radius:8px; cursor:pointer; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.3); z-index:1000000;";
        btnSair.onclick = () => overlay.remove();

        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; padding:50px; box-shadow:0 15px 50px rgba(0,0,0,0.5); margin-bottom: 50px; min-height: 100vh;";

        let html = `
            <div style="text-align:center; border:3px solid #000; padding:15px; margin-bottom:30px; font-family: Arial, sans-serif;">
                <h2 style="margin:0; font-size:18px; text-transform:uppercase;">Caderno de Respostas - Exame ${exameAtivo}</h2>
                <p style="margin:5px 0 0 0; font-size:12px;">Texto Definitivo - Peça Profissional</p>
            </div>
        `;
        
        for(let i=1; i<=150; i++) {
            const textoLinha = linhas[i-1] || "";
            html += `
                <div style="display:flex; height:35px; min-height:35px; max-height:35px; border-bottom:1px solid #d1d5db; align-items:center; box-sizing:border-box; overflow:hidden;">
                    <span style="width:45px; min-width:45px; height:35px; background:#f1f5f9; border-right:2px solid #000; color:#000; font-size:11px; font-weight:bold; display:flex; align-items:center; justify-content:center; margin-right:15px; user-select:none;">${i}</span>
                    <span style="flex:1; font-family:'Courier New', monospace; font-size:18px; font-weight:700; line-height:35px; height:35px; white-space:nowrap; overflow:hidden;">${textoLinha}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        overlay.appendChild(btnSair);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
