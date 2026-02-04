// FolhaEngine.js - VERSÃO DEFINITIVA [JUSTIFICADA + SINCRONIA TOTAL]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-elite-master';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .folha-container {
                    display: grid;
                    grid-template-columns: 50px 1fr;
                    background: #fff;
                    font-family: 'Courier New', Courier, monospace;
                    border: 2px solid #000;
                    position: relative;
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #000;
                    user-select: none;
                }
                .num-mecanico {
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 900;
                    border-bottom: 1px solid #cbd5e1;
                    color: #1e293b;
                    box-sizing: border-box;
                }
                .area-editor {
                    outline: none;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    line-height: 35px !important;
                    padding: 0 20px !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 5250px;
                    background-image: linear-gradient(to bottom, transparent 34px, #e2e8f0 34px);
                    background-size: 100% 35px;
                    background-repeat: repeat-y;
                    background-position: 0 -1px;
                    /* JUSTIFICAÇÃO BLINDADA */
                    text-align: justify;
                    text-justify: inter-word;
                }
                .area-editor div, .area-editor p { margin: 0; padding: 0; line-height: 35px; }

                @media (max-width: 768px) {
                    .folha-container { grid-template-columns: 40px 1fr; }
                    .area-editor { font-size: 17px !important; padding: 0 10px !important; }
                }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container';

        const numCol = document.createElement('div');
        numCol.className = 'numeracao';
        for(let i=1; i<=150; i++) {
            const n = document.createElement('div');
            n.className = 'num-mecanico';
            n.innerText = i;
            numCol.appendChild(n);
        }

        const editor = document.createElement('div');
        editor.className = 'area-editor';
        editor.id = 'editor-principal';
        editor.contentEditable = "true";
        editor.spellcheck = false;

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // --- LÓGICA DO TAB (4 ESPAÇOS) ---
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const sel = window.getSelection();
                if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                const tabNode = document.createTextNode("    ");
                range.insertNode(tabNode);
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });

        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    },

    injetarTextoMultilinhas: (textoBruto) => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        
        if (editor.innerText.trim() === "") {
            editor.innerText = limpo;
        } else {
            // Adiciona quebra de linha dupla para separar das inteligências anteriores
            editor.innerText += "\n\n" + limpo;
        }
        
        editor.focus();
        editor.scrollTop = editor.scrollHeight;
    },

    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        
        const conteudo = editor.innerText;
        const linhas = conteudo.split('\n');
        const exameAtivo = localStorage.getItem('activeEx') || "---";

        const overlay = document.createElement('div');
        overlay.style = "position:fixed; inset:0; background:rgba(15,23,42,0.98); z-index:110000; overflow-y:auto; padding:20px; display:flex; flex-direction:column; align-items:center;";
        
        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; box-shadow:0 0 50px #000; padding-bottom:50px; margin-top:20px; border: 1px solid #000;";

        let html = `
            <div style="text-align:center; border-bottom:3px solid #000; padding:20px; font-family:Arial,sans-serif; background:#f8fafc;">
                <h2 style="margin:0; font-size:18px; color:#000;">CADERNO DE RESPOSTAS - EXAME ${exameAtivo}</h2>
                <p style="margin:5px 0 0 0; font-size:12px; color:#444;">PROVA PRÁTICO-PROFISSIONAL</p>
            </div>
        `;

        for(let i=1; i<=150; i++) {
            const txt = linhas[i-1] || "";
            html += `
                <div style="display:flex; min-height:35px; border-bottom:1px solid #eee; align-items:stretch;">
                    <span style="width:40px; min-width:40px; border-right:2px solid #000; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; background:#f1f5f9; color:#000;">${i}</span>
                    <span style="flex:1; padding:5px 15px; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; line-height:25px; white-space:pre-wrap; word-break:break-word; color:#000; text-align:justify;">${txt}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        const btn = document.createElement('button');
        btn.innerHTML = "<b>FECHAR VISUALIZAÇÃO</b>";
        btn.style = "margin-bottom:20px; padding:15px 40px; background:#fbbf24; border:none; border-radius:8px; cursor:pointer; font-weight:bold; color:#000; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);";
        btn.onclick = () => overlay.remove();

        overlay.appendChild(btn);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
