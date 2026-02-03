// FolhaEngine.js - VERSÃO COM PREVIEW DE IMPRESSÃO [2026-02-02]
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
                    font-family: 'Courier New', Courier, monospace;
                    line-height: 35px;
                    position: relative;
                    border: 1px solid #d1d5db;
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
                    padding-left: 15px;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 1000px;
                    background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 100% 35px;
                    background-attachment: local;
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
        for(let i=1; i<=150; i++) nums += `<div style="height:35px">${i}</div>`;
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

    // --- NOVA FUNÇÃO: VISUALIZAR IMPRESSÃO ---
    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;

        const conteudo = editor.innerText;
        const janelaImpressao = window.open('', '', 'width=800,height=900');

        janelaImpressao.document.write(`
            <html>
            <head>
                <title>Preview da Peça - Mentoria OAB</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; padding: 40px; line-height: 1.5; color: #000; }
                    .folha-oab { 
                        white-space: pre-wrap; 
                        font-size: 14pt; 
                        border: 1px solid #ccc; 
                        padding: 50px; 
                        min-height: 297mm; /* Tamanho A4 */
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    @media print {
                        body { padding: 0; }
                        .folha-oab { border: none; box-shadow: none; padding: 0; }
                        .no-print { display: none; }
                    }
                    .btn-print { 
                        background: #2563eb; color: white; border: none; 
                        padding: 10px 20px; cursor: pointer; border-radius: 5px; 
                        margin-bottom: 20px; font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <button class="btn-print no-print" onclick="window.print()">Imprimir Peça</button>
                <div class="folha-oab">${conteudo}</div>
            </body>
            </html>
        `);
        janelaImpressao.document.close();
    }
};// FolhaEngine.js - VERSÃO TOTAL [SELEÇÃO MOUSE + INJEÇÃO + TECLADO]
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
                    font-family: 'Courier New', Courier, monospace;
                    line-height: 35px;
                    position: relative;
                    border: 1px solid #d1d5db;
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
                    padding-left: 15px;
                    font-size: 19px !important;
                    font-weight: 700 !important;
                    color: #000 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 5250px; /* 150 linhas * 35px */
                    background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 100% 35px;
                    background-attachment: local;
                }
                .area-editor::selection { background: #bfdbfe; color: #1e3a8a; }
            `;
            document.head.appendChild(style);
        }

        const folha = document.createElement('div');
        folha.className = 'folha-container';

        // 1. Numeração lateral
        const numCol = document.createElement('div');
        numCol.className = 'numeracao';
        let nums = "";
        for(let i=1; i<=150; i++) nums += `<div style="height:35px">${i}</div>`;
        numCol.innerHTML = nums;

        // 2. Editor Único (Permite Seleção de Múltiplas Linhas)
        const editor = document.createElement('div');
        editor.className = 'area-editor';
        editor.id = 'editor-principal'; // ID fixo para injeção
        editor.contentEditable = "true";
        editor.spellcheck = false;

        folha.appendChild(numCol);
        folha.appendChild(editor);
        container.appendChild(folha);

        // --- TECLADO LIBERADO (TAB E ENTER) ---
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
            // O Enter aqui já funciona nativamente pulando a linha
        });
    },

    // REATIVADO: Função de Injetar (Botão Pergaminho / Estruturas)
    injetarTextoMultilinhas: (textoBruto) => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;

        // Limpa o texto e formata
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        const textoFormatado = limpo.replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase());

        // Adiciona ao editor mantendo o foco
        editor.innerText += (editor.innerText ? "\n\n" : "") + textoFormatado;
        editor.focus();
        
        // Move o cursor para o final do texto injetado
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
};
