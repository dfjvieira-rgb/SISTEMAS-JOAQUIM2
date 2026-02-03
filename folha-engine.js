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
        const linhas = conteudo.split('\n');
        const exameAtivo = localStorage.getItem('activeEx') || "---";

        // Cria o Overlay de Visualização (Substitui a Janela em Branco)
        const overlay = document.createElement('div');
        overlay.style = "position:fixed; inset:0; background:#333d47; z-index:999999; overflow-y:auto; display:flex; flex-direction:column; align-items:center; padding:40px 15px; font-family:'Courier New', monospace;";
        
        // Botão Voltar Amarelo
        const btnSair = document.createElement('button');
        btnSair.innerHTML = "<b>VOLTAR AO EDITOR</b>";
        btnSair.style = "position:fixed; top:15px; left:15px; padding:12px 25px; background:#fbbf24; border:none; border-radius:5px; cursor:pointer; font-size:12px; z-index:1000; box-shadow:0 4px 10px rgba(0,0,0,0.3);";
        btnSair.onclick = () => overlay.remove();

        const papel = document.createElement('div');
        papel.style = "background:white; width:100%; max-width:820px; padding:60px 50px; box-shadow:0 0 40px rgba(0,0,0,0.5); position:relative; color:#000; font-size:18px;";

        // Cabeçalho FGV-Style
        let htmlFinal = `
            <div style="text-align:center; border:3px solid #000; padding:15px; margin-bottom:40px;">
                <h2 style="margin:0; font-size:18px;">CADERNO DE TEXTO DEFINITIVO - EXAME ${exameAtivo}</h2>
            </div>
        `;

        for (let i = 1; i <= 150; i++) {
            const textoLinha = linhas[i - 1] || "";
            htmlFinal += `
                <div style="display:flex; border-bottom:1px solid #d1d5db; height:35px; align-items:center;">
                    <span style="width:40px; color:#1e293b; font-size:12px; font-weight:bold; border-right:2px solid #000; margin-right:15px; display:block; text-align:center; background:#eee;">
                        ${i}
                    </span>
                    <span style="flex:1; white-space:pre-wrap;">${textoLinha}</span>
                </div>
            `;
        }

        papel.innerHTML = htmlFinal;
        overlay.appendChild(btnSair);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
