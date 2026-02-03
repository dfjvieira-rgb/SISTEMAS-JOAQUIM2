// FolhaEngine.js - VERSÃO SELEÇÃO MÚLTIPLA + ENTER SHIFT
export const FolhaEngine = {
    LIMITE_OAB: 60, 

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { 
                    background: #fff; 
                    border-bottom: 1px solid #d1d5db; 
                    display: flex; 
                    height: 35px; 
                    position: relative;
                }
                /* Permite que a seleção do mouse "atravesse" as linhas */
                .linha-folha::selection {
                    background: #3b82f6;
                    color: white;
                }
                .linha-num { 
                    width: 40px; display: flex; align-items: center; justify-content: center; 
                    font-size: 0.7rem; color: #94a3b8; border-right: 1px solid #d1d5db; 
                    background: #f8fafc; user-select: none; 
                }
                .linha-folha { 
                    flex: 1; border: none; outline: none; padding: 0 15px; 
                    font-size: 19px !important; font-family: 'Courier New', monospace !important; 
                    font-weight: 700 !important; color: #000 !important;
                    background: transparent;
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `<div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="95" spellcheck="false" autocomplete="off" data-index="${i}">`;
            container.appendChild(row);

            const input = row.querySelector('input');

            input.addEventListener('keydown', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // --- ENTER SHIFT (ABRE ESPAÇO) ---
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const pos = input.selectionStart;
                    const textoAtual = input.value;
                    const fica = textoAtual.substring(0, pos).trim();
                    const desce = textoAtual.substring(pos).trim();

                    for (let j = 150; j > idx + 1; j--) {
                        const linhaAlvo = document.getElementById(`L${j}`);
                        const linhaAcima = document.getElementById(`L${j - 1}`);
                        if (linhaAlvo && linhaAcima) {
                            linhaAlvo.value = linhaAcima.value;
                        }
                    }
                    if (proximo) {
                        input.value = fica; 
                        proximo.value = desce; 
                        proximo.focus();
                        proximo.setSelectionRange(0, 0);
                    }
                }

                // --- TAB (PARÁGRAFO) ---
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = input.selectionStart;
                    input.value = input.value.substring(0, start) + "    " + input.value.substring(input.selectionEnd);
                    input.selectionStart = input.selectionEnd = start + 4;
                }

                // --- NAVEGAÇÃO ---
                if (e.key === 'ArrowUp') { e.preventDefault(); if (anterior) anterior.focus(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); if (proximo) proximo.focus(); }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        // ... (Mesma lógica de injeção anterior)
    }
};
