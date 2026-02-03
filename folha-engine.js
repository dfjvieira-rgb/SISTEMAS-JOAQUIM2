// FolhaEngine.js - VERSÃO ANTI-MESCLAGEM (BLOQUEIO DE LINHA ESTREITO)
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-celular';
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
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #000;
                    display: flex;
                    flex-direction: column;
                }
                .num-mecanico {
                    height: 35px;
                    min-height: 35px;
                    border-bottom: 1px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 900;
                    color: #1e293b;
                }
                .area-editor {
                    outline: none;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    min-height: 5250px;
                    /* RESET DE PARÁGRAFO PARA EVITAR MESCLAGEM */
                    line-height: 35px !important;
                    padding: 0 20px !important;
                }
                /* FORÇA O NAVEGADOR A NÃO CRIAR ESPAÇOS ENTRE AS LINHAS DIGITADAS */
                .area-editor div, .area-editor p {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 35px !important;
                    line-height: 35px !important;
                }
                .pauta-fixa {
                    background-image: linear-gradient(to bottom, transparent 34px, #e2e8f0 34px);
                    background-size: 100% 35px;
                    background-repeat: repeat-y;
                }
                
                /* MOBILE RESPONSIVO */
                @media (max-width: 768px) {
                    .area-editor { font-size: 17px !important; padding: 0 10px !important; }
                    .folha-container { grid-template-columns: 40px 1fr; }
                }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container pauta-fixa';

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
        editor.style.height = "5250px";

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // Previne colagem de texto com formatação que quebra as linhas
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    },

    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        const linhas = editor.innerText.split('\n');

        const overlay = document.createElement('div');
        overlay.style = "position:fixed; inset:0; background:#0f172a; z-index:999999; overflow-y:auto; padding:20px; display:flex; flex-direction:column; align-items:center;";
        
        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; box-shadow:0 0 50px #000;";

        let html = "";
        for(let i=1; i<=150; i++) {
            const txt = linhas[i-1] || "";
            // TRAVA ABSOLUTA: Cada linha é uma div de 35px com overflow hidden
            html += `
                <div style="display:flex; height:35px; min-height:35px; border-bottom:1px solid #000; align-items:center; overflow:hidden;">
                    <span style="width:40px; min-width:40px; border-right:2px solid #000; height:35px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold; background:#eee;">${i}</span>
                    <span style="flex:1; padding:0 15px; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; white-space:nowrap;">${txt}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        const btn = document.createElement('button');
        btn.innerText = "VOLTAR";
        btn.style = "margin-bottom:20px; padding:10px 40px; background:#fbbf24; font-weight:900; border:none; border-radius:5px; cursor:pointer;";
        btn.onclick = () => overlay.remove();

        overlay.appendChild(btn);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
