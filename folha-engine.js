// FolhaEngine.js - VERSÃO MECÂNICA 150 LINHAS (PRECISÃO ABSOLUTA) [2026-02-03]
export const FolhaEngine = {
    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        const styleId = 'style-folha-mecanica';
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
                    border: 2px solid #000;
                    width: 100%;
                    max-width: 850px;
                }
                .numeracao {
                    background: #f1f5f9;
                    border-right: 2px solid #000;
                    display: flex;
                    flex-direction: column;
                }
                .area-editor {
                    outline: none;
                    padding: 0;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    line-height: 35px !important;
                    display: flex;
                    flex-direction: column;
                }
                .linha-mecanica {
                    height: 35px;
                    min-height: 35px;
                    max-height: 35px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 0 15px;
                }
                .num-mecanico {
                    height: 35px;
                    min-height: 35px;
                    border-bottom: 1px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: #64748b;
                    box-sizing: border-box;
                }
                /* Remove a borda da última linha para não dobrar */
                .linha-mecanica:last-child, .num-mecanico:last-child { border-bottom: none; }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container';

        const numCol = document.createElement('div');
        numCol.className = 'numeracao';
        
        const editor = document.createElement('div');
        editor.className = 'area-editor';
        editor.id = 'editor-principal';
        editor.contentEditable = "true";
        editor.spellcheck = false;

        // Criamos 150 divs físicas. O texto vai morar dentro delas ou sobre elas.
        // Para o editor aceitar digitação fluida, usamos o editor como um bloco único, 
        // mas as linhas de fundo agora são divs reais no grid.
        
        let nums = "";
        for(let i=1; i<=150; i++) {
            nums += `<div class="num-mecanico">${i}</div>`;
        }
        numCol.innerHTML = nums;

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // Força o editor a ter a altura exata de 150 linhas
        editor.style.height = (150 * 35) + "px";
        // Aplica as linhas de fundo via CSS de forma que não acumule erro
        editor.style.backgroundImage = "linear-gradient(to bottom, transparent 34px, #e2e8f0 34px)";
        editor.style.backgroundSize = "100% 35px";

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
        btnSair.innerHTML = "<b>VOLTAR</b>";
        btnSair.style = "position:fixed; top:20px; left:20px; padding:15px 30px; background:#fbbf24; border:none; border-radius:8px; cursor:pointer; font-weight:bold; z-index:1000001;";
        btnSair.onclick = () => overlay.remove();

        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:850px; padding:40px; box-shadow:0 15px 50px rgba(0,0,0,0.5); margin-bottom:50px;";

        let html = `<div style="text-align:center; border:3px solid #000; padding:10px; margin-bottom:20px; font-weight:bold;">EXAME ${exameAtivo}</div>`;
        
        for(let i=1; i<=150; i++) {
            const txt = linhas[i-1] || "";
            html += `
                <div style="display:flex; height:35px; border-bottom:1px solid #000; align-items:center; overflow:hidden; box-sizing:border-box;">
                    <span style="width:40px; border-right:2px solid #000; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; height:35px; background:#eee;">${i}</span>
                    <span style="flex:1; padding-left:15px; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; line-height:35px; white-space:nowrap;">${txt}</span>
                </div>`;
        }
        
        papel.innerHTML = html;
        overlay.appendChild(btnSair);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
