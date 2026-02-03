// FolhaEngine.js - EDIÇÃO ELITE [TECLADO LIBERADO]
export const FolhaEngine = {
    LIMITE_OAB: 75, 

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Estilo otimizado para simular folha real
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { background: #fff; border-bottom: 1px solid #d1d5db; display: flex; height: 35px; }
                .linha-num { width: 45px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #94a3b8; border-right: 2px solid #cbd5e1; background: #f8fafc; pointer-events: none; }
                .linha-folha { 
                    flex: 1; border: none; outline: none; padding: 0 15px; 
                    font-size: 19px !important; font-family: 'Courier New', monospace !important; 
                    font-weight: 700 !important; color: #000 !important; background: transparent;
                }
                .linha-folha:focus { background: #fffdeb !important; }
            `;
            document.head.appendChild(style);
        }

        // Criar as 150 linhas com atributos de teclado mobile
        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" 
                       id="L${i}" 
                       data-index="${i}" 
                       type="text" 
                       enterkeyhint="next" 
                       autocomplete="off" 
                       spellcheck="false">`;
            container.appendChild(row);
        }

        // --- A SOLUÇÃO DEFINITIVA PARA AS TECLAS ---
        container.addEventListener('keydown', (e) => {
            const input = e.target;
            if (!input.classList.contains('linha-folha')) return;

            const idx = parseInt(input.getAttribute('data-index'));
            const proximo = document.getElementById(`L${idx + 1}`);
            const anterior = document.getElementById(`L${idx - 1}`);

            // 1. LIBERAR ENTER (Pular linha)
            if (e.key === 'Enter') {
                e.preventDefault();
                if (proximo) {
                    proximo.focus();
                }
            }

            // 2. LIBERAR TAB (Parágrafo de 4 espaços)
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = input.selectionStart;
                const end = input.selectionEnd;
                input.value = input.value.substring(0, start) + "    " + input.value.substring(end);
                input.selectionStart = input.selectionEnd = start + 4;
            }

            // 3. SETAS (Cima/Baixo)
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (anterior) anterior.focus();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (proximo) proximo.focus();
            }

            // 4. BACKSPACE (Voltar linha ao apagar início)
            if (e.key === 'Backspace' && input.selectionStart === 0 && input.value === '') {
                if (anterior) {
                    e.preventDefault();
                    anterior.focus();
                    anterior.setSelectionRange(anterior.value.length, anterior.value.length);
                }
            }
        });
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
