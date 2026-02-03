// FolhaEngine.js - VERSÃO FINAL "TOTAL LIBERATION" [2026-02-02]
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
                .linha-wrapper { background: #fff; border-bottom: 1px solid #d1d5db; display: flex; height: 35px; }
                .linha-num { width: 45px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #94a3b8; border-right: 2px solid #cbd5e1; background: #f8fafc; user-select: none; }
                .linha-folha { 
                    flex: 1; border: none; outline: none; padding: 0 15px; 
                    font-size: 19px !important; font-family: 'Courier New', monospace !important; 
                    font-weight: 700 !important; color: #000 !important; background: transparent;
                }
                .linha-folha:focus { background: #fffdeb !important; outline: none; }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `<div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" data-index="${i}" 
                       type="text" 
                       inputmode="text" 
                       enterkeyhint="next" 
                       spellcheck="false" 
                       autocomplete="off">`;
            container.appendChild(row);

            const input = row.querySelector('input');

            // USANDO 'KEYDOWN' COM CAPTURA PRIORITÁRIA
            input.addEventListener('keydown', function(e) {
                const idx = parseInt(this.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // --- COMANDO ENTER (FORÇADO) ---
                if (e.key === 'Enter' || e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation(); // Impede que o formulário "sinta" o Enter
                    if (proximo) {
                        proximo.focus();
                        proximo.click(); // Simula toque para abrir teclado mobile se necessário
                    }
                    return false;
                }

                // --- COMANDO TAB (JÁ FUNCIONAL) ---
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = this.selectionStart;
                    this.value = this.value.substring(0, start) + "    " + this.value.substring(this.selectionEnd);
                    this.selectionStart = this.selectionEnd = start + 4;
                }

                // --- SETAS E BACKSPACE ---
                if (e.key === 'ArrowUp' && anterior) { e.preventDefault(); anterior.focus(); }
                if (e.key === 'ArrowDown' && proximo) { e.preventDefault(); proximo.focus(); }
                
                if (e.key === 'Backspace' && this.selectionStart === 0 && this.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        anterior.setSelectionRange(anterior.value.length, anterior.value.length);
                    }
                }
            }, true); // O 'true' aqui garante prioridade máxima no evento
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
