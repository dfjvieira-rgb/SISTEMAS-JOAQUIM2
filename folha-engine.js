// FolhaEngine.js - VERSÃO PRECISÃO ELITE [2026-02-03]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-final-blindada';
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
                    min-height: 5250px;
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #000;
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
                    background-image: linear-gradient(to bottom, transparent 34px, #e2e8f0 34px);
                    background-size: 100% 35px;
                }
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
        editor.style.minHeight = "5250px";

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);
    },

    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        
        // Captura o texto preservando as quebras de linha reais
        const conteudo = editor.innerText;
        const linhas = conteudo.split('\n');

        const overlay = document.createElement('div');
        overlay.style = "position:fixed; inset:0; background:rgba(15,23,42,0.98); z-index:999999; overflow-y:auto; padding:20px; display:flex; flex-direction:column; align-items:center;";
        
        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; box-shadow:0 0 50px #000; padding-bottom:50px;";

        let html = `
            <div style="text-align:center; border:3px solid #000; padding:15px; margin:20px; font-family:Arial,sans-serif; font-weight:900;">
                CADERNO DE TEXTO DEFINITIVO
            </div>
        `;

        for(let i=1; i<=150; i++) {
            const txt = linhas[i-1] || "";
            // AJUSTE PARA NÃO CORTAR: min-height em vez de height fixo e pre-wrap
            html += `
                <div style="display:flex; min-height:35px; border-bottom:1px solid #eee; align-items: stretch;">
                    <span style="width:40px; min-width:40px; border-right:2px solid #000; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; background:#f8fafc; color:#000;">${i}</span>
                    <span style="flex:1; padding:5px 15px; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; line-height:25px; white-space:pre-wrap; word-break:break-word; color:#000;">${txt}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        const btn = document.createElement('button');
        btn.innerHTML = "<b>VOLTAR AO EDITOR</b>";
        btn.style = "margin-bottom:20px; padding:15px 40px; background:#fbbf24; border:none; border-radius:8px; cursor:pointer; font-size:14px;";
        btn.onclick = () => overlay.remove();

        overlay.appendChild(btn);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
