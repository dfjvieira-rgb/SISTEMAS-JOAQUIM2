// FolhaEngine.js - VERSÃO ELITE CORRIGIDA [2026-02-02]
export const FolhaEngine = {
    LIMITE_OAB: 75, 

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
                .linha-num { 
                    width: 45px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.8rem; 
                    color: #64748b; 
                    border-right: 2px solid #cbd5e1; 
                    background: #f1f5f9; 
                    user-select: none; 
                }
                .linha-folha { 
                    flex: 1; 
                    border: none; 
                    outline: none; 
                    padding: 0 15px; 
                    font-size: 18px !important; 
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 600 !important; 
                    color: #000 !important; 
                    background: transparent;
                }
                .linha-folha:focus { background: #fffdeb; }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" spellcheck="false" autocomplete="off" data-index="${i}">
            `;
            container.appendChild(row);

            const input = row.querySelector('input');

            input.addEventListener('keydown', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // 1. FUNCIONALIDADE DO TAB (Simula Parágrafo OAB)
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = input.selectionStart;
                    const val = input.value;
                    // Insere 4 espaços (padrão de recuo)
                    input.value = val.substring(0, start) + "    " + val.substring(input.selectionEnd);
                    input.selectionStart = input.selectionEnd = start + 4;
                }

                // 2. FUNCIONALIDADE DO ENTER (Pula para próxima linha)
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (proximo) {
                        proximo.focus();
                    }
                }

                // 3. BACKSPACE (Volta linha se estiver no início)
                if (e.key === 'Backspace' && input.selectionStart === 0 && input.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        const len = anterior.value.length;
                        anterior.setSelectionRange(len, len);
                    }
                }

                // 4. SETAS (Cima e Baixo)
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (anterior) anterior.focus();
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        if (!textoBruto) return;
        let currentLinha = linhaInicial;
        const textoProcessado = textoBruto.replace(/<[^>]*>?/gm, '').split('\n');

        textoProcessado.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";
            palavras.forEach(p => {
                if ((acumulador + p).length > 70) { 
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
