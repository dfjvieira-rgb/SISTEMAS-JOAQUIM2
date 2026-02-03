// FolhaEngine.js - VERSÃO RESTAURADA (ENTER SHIFT + TAB)
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
                .linha-wrapper { background: #fff; border-bottom: 1px solid #d1d5db; display: flex; height: 35px; position: relative; }
                .linha-wrapper::after { content: ""; position: absolute; right: 60px; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.4); pointer-events: none; }
                .linha-num { width: 40px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #94a3b8; border-right: 1px solid #d1d5db; background: #f8fafc; user-select: none; }
                .linha-folha { 
                    flex: 1; border: none; outline: none; padding: 0 15px; padding-right: 95px !important; 
                    font-size: 19px !important; font-family: 'Courier New', monospace !important; 
                    font-weight: 700 !important; color: #000 !important; letter-spacing: 0.5px;
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

                // --- RESTAURANDO O ENTER QUE FUNCIONAVA (SHIFT VERTICAL) ---
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const pos = input.selectionStart;
                    const textoAtual = input.value;
                    const fica = textoAtual.substring(0, pos).trim();
                    const desce = textoAtual.substring(pos).trim();

                    // Abre o espaço (Move todas as linhas abaixo para baixo)
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

                // --- LIBERANDO O TAB (PARÁGRAFO) ---
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = input.selectionStart;
                    input.value = input.value.substring(0, start) + "    " + input.value.substring(input.selectionEnd);
                    input.selectionStart = input.selectionEnd = start + 4;
                }

                // --- NAVEGAÇÃO E BACKSPACE ---
                if (e.key === 'Backspace' && input.selectionStart === 0 && input.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        anterior.setSelectionRange(anterior.value.length, anterior.value.length);
                    }
                }

                if (e.key === 'ArrowUp') { e.preventDefault(); if (anterior) anterior.focus(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); if (proximo) proximo.focus(); }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        let currentLinha = linhaInicial;
        const limpo = textoBruto.replace(/<[^>]*>?/gm, '').trim();
        const textoProcessado = limpo.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase());
        const paragrafos = textoProcessado.split('\n');

        paragrafos.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";
            palavras.forEach(p => {
                if ((acumulador + p).length > 60) {
                    const el = document.getElementById(`L${currentLinha}`);
                    if (el) el.value = acumulador.trim();
                    currentLinha++;
                    acumulador = p + " ";
                } else {
                    acumulador += p + " ";
                }
            });
            const elFinal = document.getElementById(`L${currentLinha}`);
            if (elFinal) elFinal.value = acumulador.trim();
            currentLinha++;
        });
    }
};
